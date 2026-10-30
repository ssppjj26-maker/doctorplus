// Service layer ("backend"). Every function performs its own authorization check,
// exactly as server-side route handlers / Supabase RLS would. UI code must only talk to this module.

import { getDb, mutate, uid, bookingId, hashPw, resetDb } from './db';
import { generateSlots, nextAvailableSlot, availableDates, LOCK_TTL_MS, ACTIVE_STATUSES } from './slots';
import { parseQuery, nearestCity } from './search';
import { notify, appointmentEmailLines, scheduleReminders, cancelReminders, processDueJobs, typeLabel } from './notifications';
import { fmtDate, fmtTime, todayISO, addDays, apptTimestamp } from './dates';
import { slugify } from '../data/doctors';
import * as V from './validate';

export class ApiError extends Error {
  constructor(message, code = 400, field = null) { super(message); this.code = code; this.field = field; }
}
const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms + Math.random() * 180));

// ---------------------------------------------------------------- session / auth
const SESSION_KEY = 'carefind_session';
const authListeners = new Set();
export const onAuthChange = (fn) => { authListeners.add(fn); return () => authListeners.delete(fn); };
const emitAuth = () => authListeners.forEach((f) => f());

export const tabId = (() => {
  let id = sessionStorage.getItem('cf_tab');
  if (!id) { id = uid('tab'); sessionStorage.setItem('cf_tab', id); }
  return id;
})();

const safeUser = (u) => { if (!u) return null; const { password, ...rest } = u; return rest; };

export function currentUser() {
  const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!s) return null;
  const u = getDb().users.find((x) => x.id === s.userId);
  if (!u || u.status === 'suspended') return null;
  return safeUser(u);
}
function setSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, at: Date.now() }));
  else localStorage.removeItem(SESSION_KEY);
  emitAuth();
}
function requireUser(roles) {
  const u = currentUser();
  if (!u) throw new ApiError('Please log in to continue.', 401);
  if (roles && !roles.includes(u.role)) throw new ApiError('You do not have permission to perform this action.', 403);
  return u;
}
function requireDoctor() {
  const u = requireUser(['doctor']);
  const doc = getDb().doctors.find((d) => d.id === u.doctorId);
  if (!doc) throw new ApiError('Doctor profile not found.', 404);
  return { user: u, doc };
}

export async function login(email, password) {
  await delay();
  V.check(V.email(email), 'email');
  const u = getDb().users.find((x) => x.email?.toLowerCase() === email.trim().toLowerCase());
  if (!u || !u.password || u.password !== hashPw(password)) throw new ApiError('Incorrect email or password.', 401);
  if (u.status === 'suspended') throw new ApiError('This account has been suspended. Please contact support.', 403);
  setSession(u); return safeUser(u);
}

export async function signup({ name, email, phone, password }) {
  await delay();
  V.check(V.name(name), 'name'); V.check(V.email(email), 'email'); V.check(V.phone(phone), 'phone'); V.check(V.password(password), 'password');
  const user = mutate((db) => {
    const existing = db.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
    if (existing && existing.password) throw new ApiError('An account with this email already exists.', 409, 'email');
    if (existing) { // upgrade guest account created during booking
      Object.assign(existing, { name, phone, password: hashPw(password), guest: false });
      return existing;
    }
    const u = { id: uid('user'), role: 'patient', name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), password: hashPw(password), status: 'active', createdAt: new Date().toISOString() };
    db.users.push(u);
    return u;
  });
  setSession(user); return safeUser(user);
}

export async function requestOtp(phone) {
  await delay();
  V.check(V.phone(phone), 'phone');
  const code = String(Math.floor(100000 + Math.random() * 900000));
  mutate((db) => {
    db.otps = db.otps.filter((o) => o.phone !== phone && o.expiresAt > Date.now());
    db.otps.push({ phone, code, expiresAt: Date.now() + 5 * 60e3, attempts: 0 });
  });
  return { demoCode: code }; // In production the code is sent by SMS and never returned to the client.
}

export async function verifyOtp(phone, code) {
  await delay();
  const user = mutate((db) => {
    const o = db.otps.find((x) => x.phone === phone && x.expiresAt > Date.now());
    if (!o) throw new ApiError('Code expired. Please request a new one.', 400, 'code');
    o.attempts++;
    if (o.attempts > 5) throw new ApiError('Too many attempts. Request a new code.', 429, 'code');
    if (o.code !== code.trim()) throw new ApiError('Incorrect code.', 400, 'code');
    db.otps = db.otps.filter((x) => x !== o);
    let u = db.users.find((x) => x.phone === phone);
    if (!u) { u = { id: uid('user'), role: 'patient', name: 'New Patient', phone, email: '', status: 'active', createdAt: new Date().toISOString() }; db.users.push(u); }
    if (u.status === 'suspended') throw new ApiError('This account has been suspended.', 403);
    return u;
  });
  setSession(user); return safeUser(user);
}

/** Simulated Google OAuth (replace with Supabase `signInWithOAuth({ provider: 'google' })`). */
export async function googleLogin(email) {
  await delay(400);
  V.check(V.email(email), 'email');
  const user = mutate((db) => {
    let u = db.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
    if (!u) { u = { id: uid('user'), role: 'patient', name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), email: email.toLowerCase(), phone: '', provider: 'google', status: 'active', createdAt: new Date().toISOString() }; db.users.push(u); }
    if (u.status === 'suspended') throw new ApiError('This account has been suspended.', 403);
    return u;
  });
  setSession(user); return safeUser(user);
}

export function logout() { setSession(null); }

// ---------------------------------------------------------------- public serializers
const PUBLIC_STATUSES = ['verified', 'pending'];
const isPublic = (d) => PUBLIC_STATUSES.includes(d.verificationStatus);

export function ratingFor(db, doc) {
  const real = db.reviews.filter((r) => r.doctorId === doc.id && r.status === 'approved' && !r.isSample);
  const n = doc.baseReviewCount + real.length;
  const sum = doc.baseRating * doc.baseReviewCount + real.reduce((s, r) => s + r.rating, 0);
  return { rating: n ? Math.round((sum / n) * 10) / 10 : 0, reviewCount: n };
}

function slotCtx(db) { return { appointments: db.appointments, locks: db.locks, sessionId: tabId }; }

function publicDoctor(db, d, { next = true } = {}) {
  // Never expose registration numbers, verification documents or linked user ids.
  const { registrationNumber, verificationDocs, userId, ...pub } = d;
  const city = db.cities.find((c) => c.id === d.cityId);
  const state = city && db.states.find((s) => s.id === city.stateId);
  const clinics = d.clinicIds.map((id) => db.clinics.find((c) => c.id === id)).filter(Boolean);
  return {
    ...pub, ...ratingFor(db, d),
    verified: d.verificationStatus === 'verified',
    city: city ? { id: city.id, name: city.name, slug: city.slug } : null,
    stateName: state?.name || '',
    clinic: clinics[0] || null, clinics,
    categories: d.categoryIds.map((id) => db.categories.find((c) => c.id === id)).filter(Boolean).map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
    nextAvailable: next ? nextAvailableSlot(d, slotCtx(db)) : null,
  };
}

// ---------------------------------------------------------------- public catalogue
export async function listCategories() {
  await delay(80);
  const db = getDb();
  return [...db.categories].sort((a, b) => a.order - b.order).map((c) => ({
    ...c, doctorCount: db.doctors.filter((d) => isPublic(d) && (d.categoryIds.includes(c.id) || c.specialties.includes(d.specialty))).length,
  }));
}
export function categoriesSync() { return [...getDb().categories].sort((a, b) => a.order - b.order); }
export function citiesSync() { return getDb().cities; }

export async function listCities() {
  await delay(60);
  const db = getDb();
  return db.cities.map((c) => ({ ...c, stateName: db.states.find((s) => s.id === c.stateId)?.name, doctorCount: db.doctors.filter((d) => isPublic(d) && d.cityId === c.id).length }));
}

export async function featuredDoctors(limit = 6) {
  await delay();
  const db = getDb();
  return db.doctors.filter((d) => isPublic(d) && d.featured && d.verificationStatus === 'verified').slice(0, limit).map((d) => publicDoctor(db, d));
}

export async function searchDoctors(params = {}) {
  await delay(350);
  const db = getDb();
  const parsed = parseQuery(params.q || '', { categories: db.categories, cities: db.cities });
  const category = params.category ? db.categories.find((c) => c.slug === params.category) : parsed.category;
  let city = params.city ? db.cities.find((c) => c.slug === params.city) : null;
  let area = null;
  // Location field can be a city, area or PIN code.
  if (!city && params.location) {
    const loc = parseQuery(params.location, { categories: [], cities: db.cities });
    city = loc.city; area = loc.area;
  }
  if (!city && parsed.city) { city = parsed.city; area = parsed.area; }
  if (parsed.nearMe && !city && params.coords) city = nearestCity(params.coords.lat, params.coords.lng, db.cities);
  if (params.area) area = city?.areas.find((a) => a.name === params.area) || area;

  let list = db.doctors.filter(isPublic).map((d) => {
    let relevance = 1;
    if (category) {
      if (d.categoryIds[0] === category.id) relevance = 3;
      else if (d.categoryIds.includes(category.id)) relevance = 2;
      else if (category.specialties.includes(d.specialty)) relevance = 1.5;
      else relevance = 0;
    } else if (parsed.text) {
      const hay = `${d.name} ${d.specialty} ${d.specialties.join(' ')} ${d.services.join(' ')}`.toLowerCase();
      const words = parsed.text.split(' ');
      const hits = words.filter((w) => hay.includes(w)).length;
      relevance = hits ? hits / words.length : 0;
    }
    return { d, relevance };
  }).filter((x) => x.relevance > 0);

  if (city) list = list.filter(({ d }) => d.cityId === city.id);
  let areaFallback = false;
  if (area) {
    const inArea = list.filter(({ d }) => d.area === area.name || d.clinicIds.some((cid) => db.clinics.find((c) => c.id === cid)?.area === area.name));
    if (inArea.length) list = inArea; else areaFallback = true;
  }

  const f = params.filters || {};
  let out = list.map(({ d, relevance }) => ({ ...publicDoctor(db, d), relevance }));
  if (f.gender) out = out.filter((d) => d.gender === f.gender);
  if (f.minExp) out = out.filter((d) => d.experienceYears >= Number(f.minExp));
  if (f.minRating) out = out.filter((d) => d.rating >= Number(f.minRating));
  if (f.languages?.length) out = out.filter((d) => f.languages.some((l) => d.languages.includes(l)));
  if (f.consultType) out = out.filter((d) => d.consultTypes.includes(f.consultType));
  if (f.verified) out = out.filter((d) => d.verified);
  if (f.specialty) out = out.filter((d) => d.specialties.includes(f.specialty));
  if (f.free) out = out.filter((d) => d.pricing.isFree);
  if (f.availability) {
    const t = todayISO();
    const limit = { today: t, tomorrow: addDays(t, 1), week: addDays(t, 6) }[f.availability];
    out = out.filter((d) => d.nextAvailable && d.nextAvailable.date <= limit);
  }

  const ts = (d) => (d.nextAvailable ? apptTimestamp(d.nextAvailable.date, d.nextAvailable.time) : Infinity);
  const sorters = {
    recommended: (a, b) => (b.relevance * 10 + (b.featured ? 2 : 0) + (b.verified ? 2 : 0) + b.rating) - (a.relevance * 10 + (a.featured ? 2 : 0) + (a.verified ? 2 : 0) + a.rating) || ts(a) - ts(b),
    rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    experience: (a, b) => b.experienceYears - a.experienceYears,
    earliest: (a, b) => ts(a) - ts(b),
    reviews: (a, b) => b.reviewCount - a.reviewCount,
  };
  out.sort(sorters[params.sort] || sorters.recommended);

  return {
    doctors: out, total: out.length,
    interpreted: { category: category || null, city: city || null, area: area || null, nearMe: parsed.nearMe, text: parsed.text, areaFallback },
  };
}

export async function getDoctorBySlug(slug) {
  await delay(300);
  const db = getDb();
  const d = db.doctors.find((x) => x.slug === slug);
  if (!d || !isPublic(d)) throw new ApiError('Doctor not found', 404);
  return publicDoctor(db, d);
}

export function allPublicDoctorsSync() {
  const db = getDb();
  return db.doctors.filter(isPublic).map((d) => ({ id: d.id, slug: d.slug, name: d.name, specialty: d.specialty }));
}

export async function compareDoctors(ids) {
  await delay();
  const db = getDb();
  return ids.map((id) => db.doctors.find((d) => d.id === id)).filter((d) => d && isPublic(d)).map((d) => publicDoctor(db, d));
}

export async function doctorReviewsPublic(doctorId) {
  await delay(150);
  return getDb().reviews.filter((r) => r.doctorId === doctorId && r.status === 'approved')
    .map(({ patientId, appointmentId, ...r }) => r) // never expose patient identifiers publicly
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function recentPublicReviews(limit = 6) {
  await delay(150);
  const db = getDb();
  return db.reviews.filter((r) => r.status === 'approved').slice(0, limit).map(({ patientId, appointmentId, ...r }) => ({ ...r, doctor: db.doctors.find((d) => d.id === r.doctorId) && { name: db.doctors.find((d) => d.id === r.doctorId).name, slug: db.doctors.find((d) => d.id === r.doctorId).slug, specialty: db.doctors.find((d) => d.id === r.doctorId).specialty } }));
}

export async function platformStats() {
  const db = getDb();
  return {
    doctors: db.doctors.filter((d) => d.verificationStatus === 'verified').length,
    cities: db.cities.length, categories: db.categories.length,
    specialties: new Set(db.categories.flatMap((c) => [...c.specialties, ...c.problems])).size,
  };
}

export function contentSync() { return getDb().content; }
export function faqsSync() { return getDb().faqs; }
export async function listPosts() { await delay(150); return getDb().posts.filter((p) => p.published); }
export async function getPost(slug) {
  await delay(150);
  const db = getDb();
  const p = db.posts.find((x) => x.slug === slug && x.published);
  if (!p) throw new ApiError('Article not found', 404);
  const cats = db.categories.filter((c) => p.categorySlugs.includes(c.slug));
  const related = db.doctors.filter((d) => isPublic(d) && d.verificationStatus === 'verified' && cats.some((c) => d.categoryIds[0] === c.id)).slice(0, 3).map((d) => publicDoctor(db, d));
  return { ...p, relatedCategories: cats, relatedDoctors: related };
}

// ---------------------------------------------------------------- availability & booking
export async function getDateAvailability(doctorId, days = 14) {
  await delay(120);
  const db = getDb();
  const d = db.doctors.find((x) => x.id === doctorId);
  return d ? availableDates(d, slotCtx(db), days) : [];
}

export async function getSlots(doctorId, date, { ignoreAppointmentId } = {}) {
  await delay(260);
  const db = getDb();
  const d = db.doctors.find((x) => x.id === doctorId);
  if (!d) throw new ApiError('Doctor not found', 404);
  return generateSlots(d, date, { ...slotCtx(db), ignoreAppointmentId });
}

const SLOT_TAKEN = 'This appointment slot was just booked. Please select another available time.';

/** Cross-tab mutual exclusion (Web Locks API) around critical booking sections. */
function withLock(fn) {
  if (navigator.locks?.request) return navigator.locks.request('carefind-booking', fn);
  return fn();
}

/** Step 3/4: temporarily reserve a slot for this browser tab while the patient fills the form. */
export async function reserveSlot(doctorId, date, time, { ignoreAppointmentId } = {}) {
  await delay(120);
  return withLock(() => mutate((db) => {
    db.locks = db.locks.filter((l) => l.expiresAt > Date.now() && l.sessionId !== tabId);
    const d = db.doctors.find((x) => x.id === doctorId);
    const slot = generateSlots(d, date, { ...slotCtx(db), ignoreAppointmentId }).find((s) => s.time === time);
    if (!slot || !slot.available) throw new ApiError(SLOT_TAKEN, 409);
    const lock = { id: uid('lock'), doctorId, date, time, sessionId: tabId, expiresAt: Date.now() + LOCK_TTL_MS };
    db.locks.push(lock);
    return lock;
  }));
}

export function releaseMyLocks() {
  const db = getDb();
  if (!db.locks.some((l) => l.sessionId === tabId)) return;
  mutate((x) => { x.locks = x.locks.filter((l) => l.sessionId !== tabId && l.expiresAt > Date.now()); });
}

export async function bookAppointment(input) {
  await delay(450);
  const errors = V.collect({
    name: V.name(input.patient?.name), phone: V.phone(input.patient?.phone), email: V.email(input.patient?.email),
    age: V.age(input.patient?.age), gender: V.required(input.patient?.gender, 'Please select gender'),
    reason: V.text(input.reason, 3, 300, 'Please describe the reason (3–300 characters)'),
    message: input.message ? V.text(input.message, 0, 1000, 'Message is too long') : null,
  });
  if (errors) { const e = new ApiError('Please fix the highlighted fields.', 422); e.fields = errors; throw e; }

  try {
    return await withLock(() => mutate((db) => {
      // 1. Check doctor & availability
      const doc = db.doctors.find((d) => d.id === input.doctorId);
      if (!doc || !isPublic(doc)) throw new ApiError('This doctor is not accepting appointments.', 404);
      if (!doc.consultTypes.includes(input.type)) throw new ApiError('Selected consultation type is not offered.', 400);
      // 2. Check whether the slot is already booked (or held by someone else)
      db.locks = db.locks.filter((l) => l.expiresAt > Date.now());
      const slot = generateSlots(doc, input.date, slotCtx(db)).find((s) => s.time === input.time);
      if (!slot || !slot.available) throw new ApiError(SLOT_TAKEN, 409);

      // Resolve patient: logged-in patient, existing account by email/phone, or a guest record.
      const sess = currentUser();
      const p = input.patient;
      let patient = sess?.role === 'patient' ? db.users.find((u) => u.id === sess.id) : null;
      if (!patient) patient = db.users.find((u) => u.role === 'patient' && u.email && u.email === p.email.trim().toLowerCase());
      if (!patient) {
        patient = { id: uid('user'), role: 'patient', guest: true, name: p.name.trim(), email: p.email.trim().toLowerCase(), phone: p.phone.trim(), age: Number(p.age), gender: p.gender, status: 'active', createdAt: new Date().toISOString() };
        db.users.push(patient);
      }
      if (patient.status === 'suspended') throw new ApiError('This account cannot book appointments. Please contact support.', 403);
      // Same patient cannot hold two overlapping appointments.
      if (db.appointments.some((a) => a.patientId === patient.id && a.date === input.date && a.time === input.time && ACTIVE_STATUSES.includes(a.status)))
        throw new ApiError('You already have an appointment at this time.', 409);

      // 4. Create appointment (5. slot becomes unavailable because it is now an active appointment)
      const status = doc.autoConfirm === false ? 'pending' : 'confirmed';
      const now = new Date().toISOString();
      const appt = {
        id: bookingId(new Set(db.appointments.map((a) => a.id))),
        doctorId: doc.id, patientId: patient.id, clinicId: input.clinicId || doc.clinicIds[0],
        date: input.date, time: input.time, duration: doc.availability.duration, type: input.type, status,
        patient: { name: p.name.trim(), phone: p.phone.trim(), email: p.email.trim().toLowerCase(), age: Number(p.age), gender: p.gender },
        reason: V.clean(input.reason), message: V.clean(input.message || ''),
        createdAt: now, updatedAt: now, history: [{ status, at: now, by: 'patient' }],
        // Payment-ready: MVP is free. Future: fee, coupon, insurance, refund fields live here.
        payment: { required: false, amount: 0, currency: doc.pricing.currency, status: 'not_required', coupon: null, insurance: null },
      };
      db.appointments.push(appt);
      // release this tab's temporary lock
      db.locks = db.locks.filter((l) => l.sessionId !== tabId);

      // 6. Notifications
      const lines = appointmentEmailLines(db, appt);
      notify(db, {
        userId: patient.id, type: status === 'confirmed' ? 'appointment_confirmed' : 'appointment_booked',
        title: status === 'confirmed' ? 'Appointment confirmed' : 'Appointment request received',
        body: `${doc.name} · ${fmtDate(appt.date)} at ${fmtTime(appt.time)}`, link: '/dashboard/upcoming',
        email: { subject: status === 'confirmed' ? 'Your Doctor Appointment is Confirmed' : 'We received your appointment request', lines },
      });
      if (doc.userId) notify(db, { userId: doc.userId, type: 'new_booking', title: 'New appointment booked', body: `${appt.patient.name} · ${fmtDate(appt.date)} at ${fmtTime(appt.time)} (${typeLabel(appt.type)})`, link: '/doctor-dashboard/appointments' });
      if (status === 'confirmed') scheduleReminders(db, appt);

      const clinic = db.clinics.find((c) => c.id === appt.clinicId);
      return { ...appt, doctor: { name: doc.name, specialty: doc.specialty, slug: doc.slug }, clinic, guest: !!patient.guest || !sess };
    }));
  } catch (e) {
    releaseMyLocks(); // 7. release lock on failure
    throw e;
  }
}

// ---------------------------------------------------------------- patient
function enrichAppt(db, a) {
  const doc = db.doctors.find((d) => d.id === a.doctorId);
  const clinic = db.clinics.find((c) => c.id === a.clinicId);
  const city = clinic && db.cities.find((c) => c.id === clinic.cityId);
  return { ...a, doctor: doc ? { id: doc.id, name: doc.name, slug: doc.slug, specialty: doc.specialty, hue: doc.hue, gender: doc.gender } : null, clinic: clinic ? { ...clinic, cityName: city?.name } : null };
}
const isUpcoming = (a) => ACTIVE_STATUSES.includes(a.status) && apptTimestamp(a.date, a.time) >= Date.now() - 30 * 60e3;

export async function myAppointments() {
  await delay();
  const u = requireUser(['patient']);
  const db = getDb();
  const all = db.appointments.filter((a) => a.patientId === u.id).map((a) => enrichAppt(db, a));
  const byTime = (a, b) => apptTimestamp(a.date, a.time) - apptTimestamp(b.date, b.time);
  return { upcoming: all.filter(isUpcoming).sort(byTime), past: all.filter((a) => !isUpcoming(a)).sort((a, b) => byTime(b, a)) };
}

function assertCanManage(db, appt, u) {
  if (!appt) throw new ApiError('Appointment not found', 404);
  if (u.role === 'admin') return;
  if (u.role === 'patient' && appt.patientId === u.id) return;
  if (u.role === 'doctor' && appt.doctorId === u.doctorId) return;
  throw new ApiError('You do not have access to this appointment.', 403);
}

export async function cancelAppointment(id, reason = '') {
  await delay();
  const u = requireUser(['patient', 'doctor', 'admin']);
  return mutate((db) => {
    const a = db.appointments.find((x) => x.id === id);
    assertCanManage(db, a, u);
    if (!ACTIVE_STATUSES.includes(a.status)) throw new ApiError('This appointment can no longer be cancelled.', 400);
    a.status = 'cancelled'; a.cancelReason = V.clean(reason); a.updatedAt = new Date().toISOString();
    a.history.push({ status: 'cancelled', at: a.updatedAt, by: u.role });
    cancelReminders(db, a.id);
    const doc = db.doctors.find((d) => d.id === a.doctorId);
    const lines = appointmentEmailLines(db, a);
    notify(db, { userId: a.patientId, type: 'appointment_cancelled', title: 'Appointment cancelled', body: `${doc.name} · ${fmtDate(a.date)} at ${fmtTime(a.time)}`, link: '/dashboard/past', email: { subject: 'Your appointment has been cancelled', lines } });
    if (doc.userId && u.role !== 'doctor') notify(db, { userId: doc.userId, type: 'appointment_cancelled', title: 'Appointment cancelled', body: `${a.patient.name} cancelled ${fmtDate(a.date)} at ${fmtTime(a.time)}` });
    return a;
  });
}

export async function rescheduleAppointment(id, date, time) {
  await delay(350);
  const u = requireUser(['patient', 'admin']);
  try {
    return await withLock(() => mutate((db) => {
      const a = db.appointments.find((x) => x.id === id);
      assertCanManage(db, a, u);
      if (!ACTIVE_STATUSES.includes(a.status)) throw new ApiError('Only upcoming appointments can be rescheduled.', 400);
      const doc = db.doctors.find((d) => d.id === a.doctorId);
      db.locks = db.locks.filter((l) => l.expiresAt > Date.now());
      const slot = generateSlots(doc, date, { ...slotCtx(db), ignoreAppointmentId: a.id }).find((s) => s.time === time);
      if (!slot || !slot.available) throw new ApiError(SLOT_TAKEN, 409);
      const prev = `${fmtDate(a.date)} ${fmtTime(a.time)}`;
      a.date = date; a.time = time; a.updatedAt = new Date().toISOString();
      a.history.push({ status: a.status, at: a.updatedAt, by: u.role, note: `Rescheduled from ${prev}` });
      db.locks = db.locks.filter((l) => l.sessionId !== tabId);
      if (a.status === 'confirmed') scheduleReminders(db, a);
      notify(db, { userId: a.patientId, type: 'appointment_rescheduled', title: 'Appointment rescheduled', body: `${doc.name} · now ${fmtDate(date)} at ${fmtTime(time)}`, link: '/dashboard/upcoming', email: { subject: 'Your appointment has been rescheduled', lines: appointmentEmailLines(db, a) } });
      if (doc.userId) notify(db, { userId: doc.userId, type: 'appointment_rescheduled', title: 'Appointment rescheduled', body: `${a.patient.name}: ${prev} → ${fmtDate(date)} ${fmtTime(time)}` });
      return a;
    }));
  } catch (e) { releaseMyLocks(); throw e; }
}

export function savedIdsSync() {
  const u = currentUser();
  if (!u) return [];
  return getDb().savedDoctors.filter((s) => s.userId === u.id).map((s) => s.doctorId);
}
export async function toggleSaved(doctorId) {
  const u = requireUser(['patient']);
  return mutate((db) => {
    const i = db.savedDoctors.findIndex((s) => s.userId === u.id && s.doctorId === doctorId);
    if (i >= 0) { db.savedDoctors.splice(i, 1); return false; }
    db.savedDoctors.push({ userId: u.id, doctorId, createdAt: new Date().toISOString() });
    return true;
  });
}
export async function savedDoctors() {
  await delay();
  const u = requireUser(['patient']);
  const db = getDb();
  return db.savedDoctors.filter((s) => s.userId === u.id).map((s) => db.doctors.find((d) => d.id === s.doctorId)).filter((d) => d && isPublic(d)).map((d) => publicDoctor(db, d));
}

export function myNotificationsSync() {
  const u = currentUser();
  if (!u) return [];
  return getDb().notifications.filter((n) => n.userId === u.id);
}
export function markNotificationsRead(ids) {
  const u = requireUser();
  mutate((db) => { db.notifications.forEach((n) => { if (n.userId === u.id && (!ids || ids.includes(n.id))) n.read = true; }); });
}

export async function updateMyProfile(patch) {
  await delay();
  const u = requireUser(['patient', 'doctor', 'admin']);
  const errors = V.collect({ name: V.name(patch.name), email: patch.email ? V.email(patch.email) : null, phone: patch.phone ? V.phone(patch.phone) : null, age: patch.age ? V.age(patch.age) : null });
  if (errors) { const e = new ApiError('Please fix the highlighted fields.', 422); e.fields = errors; throw e; }
  const updated = mutate((db) => {
    const me = db.users.find((x) => x.id === u.id);
    if (patch.email && db.users.some((x) => x.id !== u.id && x.email === patch.email.toLowerCase())) throw new ApiError('Email already in use.', 409, 'email');
    ['name', 'phone', 'age', 'gender', 'cityId'].forEach((k) => { if (patch[k] !== undefined) me[k] = patch[k]; });
    if (patch.email) me.email = patch.email.toLowerCase();
    return me;
  });
  emitAuth();
  return safeUser(updated);
}

export async function submitReview(appointmentId, { rating, text, aspects }) {
  await delay();
  const u = requireUser(['patient']);
  if (!(rating >= 1 && rating <= 5)) throw new ApiError('Please choose a rating from 1 to 5.', 422, 'rating');
  const t = V.text(text, 10, 1500, 'Review should be 10–1500 characters');
  if (t) throw new ApiError(t, 422, 'text');
  return mutate((db) => {
    const a = db.appointments.find((x) => x.id === appointmentId);
    if (!a || a.patientId !== u.id) throw new ApiError('Appointment not found.', 404);
    if (a.status !== 'completed') throw new ApiError('You can review a doctor only after a completed appointment.', 400);
    if (a.reviewId || db.reviews.some((r) => r.appointmentId === a.id)) throw new ApiError('You have already reviewed this appointment.', 409);
    const r = { id: uid('rev'), doctorId: a.doctorId, appointmentId: a.id, patientId: u.id, patientName: `${u.name.split(' ')[0]} ${u.name.split(' ')[1]?.[0] || ''}.`.trim(), rating, text: V.clean(text), aspects: aspects || {}, status: 'pending', createdAt: new Date().toISOString(), verified: true };
    db.reviews.unshift(r);
    a.reviewId = r.id;
    const doc = db.doctors.find((d) => d.id === a.doctorId);
    if (doc.userId) notify(db, { userId: doc.userId, type: 'review_received', title: 'New review submitted', body: `${rating}★ review – visible after moderation.` });
    return r;
  });
}

// ---------------------------------------------------------------- doctor
export async function doctorOverview() {
  await delay();
  const { doc } = requireDoctor();
  const db = getDb();
  const mine = db.appointments.filter((a) => a.doctorId === doc.id);
  const t = todayISO();
  return {
    doctor: { ...doc, ...ratingFor(db, doc), clinics: doc.clinicIds.map((id) => db.clinics.find((c) => c.id === id)) },
    stats: {
      today: mine.filter((a) => a.date === t && ACTIVE_STATUSES.includes(a.status)).length,
      upcoming: mine.filter(isUpcoming).length,
      patients: new Set(mine.map((a) => a.patientId)).size,
      completed: mine.filter((a) => a.status === 'completed').length,
      cancelled: mine.filter((a) => a.status === 'cancelled').length,
      pending: mine.filter((a) => a.status === 'pending' && isUpcoming(a)).length,
    },
  };
}

export async function doctorAppointments() {
  await delay();
  const { doc } = requireDoctor();
  const db = getDb();
  return db.appointments.filter((a) => a.doctorId === doc.id).map((a) => enrichAppt(db, a))
    .sort((a, b) => apptTimestamp(a.date, a.time) - apptTimestamp(b.date, b.time));
}

const TRANSITIONS = { pending: ['confirmed', 'cancelled'], confirmed: ['completed', 'no_show', 'cancelled'] };

export async function setAppointmentStatus(id, status) {
  await delay();
  const u = requireUser(['doctor', 'admin']);
  if (status === 'cancelled') return cancelAppointment(id);
  return mutate((db) => {
    const a = db.appointments.find((x) => x.id === id);
    assertCanManage(db, a, u);
    if (!(TRANSITIONS[a.status] || []).includes(status)) throw new ApiError(`Cannot change status from ${a.status} to ${status}.`, 400);
    if (['completed', 'no_show'].includes(status) && apptTimestamp(a.date, a.time) > Date.now()) throw new ApiError('You can mark this only after the appointment time.', 400);
    a.status = status; a.updatedAt = new Date().toISOString();
    a.history.push({ status, at: a.updatedAt, by: u.role });
    const doc = db.doctors.find((d) => d.id === a.doctorId);
    if (status === 'confirmed') {
      scheduleReminders(db, a);
      notify(db, { userId: a.patientId, type: 'appointment_confirmed', title: 'Appointment confirmed', body: `${doc.name} confirmed ${fmtDate(a.date)} at ${fmtTime(a.time)}`, link: '/dashboard/upcoming', email: { subject: 'Your Doctor Appointment is Confirmed', lines: appointmentEmailLines(db, a) } });
    }
    if (status === 'completed') {
      cancelReminders(db, a.id);
      notify(db, { userId: a.patientId, type: 'review_request', title: `How was your visit with ${doc.name}?`, body: 'Share your experience to help other patients.', link: '/dashboard/past', email: { subject: `How was your appointment with ${doc.name}?`, lines: ['Your feedback helps other patients choose the right doctor.', 'Log in to your dashboard to leave a review.'] } });
    }
    if (status === 'no_show') cancelReminders(db, a.id);
    return a;
  });
}

const DOCTOR_EDITABLE = ['bio', 'services', 'languages', 'consultTypes', 'specialties', 'qualifications', 'experience', 'autoConfirm', 'specialty', 'categoryIds'];
export async function updateMyDoctorProfile(patch) {
  await delay();
  const { doc } = requireDoctor();
  if (patch.consultTypes && !patch.consultTypes.length) throw new ApiError('Enable at least one consultation type.', 422, 'consultTypes');
  if (patch.bio !== undefined && V.text(patch.bio, 30, 3000)) throw new ApiError('Bio should be 30–3000 characters.', 422, 'bio');
  return mutate((db) => {
    const d = db.doctors.find((x) => x.id === doc.id);
    DOCTOR_EDITABLE.forEach((k) => { if (patch[k] !== undefined) d[k] = patch[k]; });
    if (patch.clinic) {
      const c = db.clinics.find((x) => x.id === d.clinicIds[0]);
      ['name', 'address', 'phone', 'hours', 'area', 'pincode'].forEach((k) => { if (patch.clinic[k] !== undefined) c[k] = V.clean(patch.clinic[k]); });
    }
    return d;
  });
}

export async function updateAvailability({ weekly, duration, buffer }) {
  await delay();
  const { doc } = requireDoctor();
  if (![15, 20, 30, 45, 60].includes(Number(duration))) throw new ApiError('Invalid appointment duration.', 422);
  if (![0, 5, 10, 15].includes(Number(buffer))) throw new ApiError('Invalid buffer time.', 422);
  for (const [day, wins] of Object.entries(weekly)) {
    const sorted = [...wins].sort((a, b) => a.start.localeCompare(b.start));
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].start >= sorted[i].end) throw new ApiError(`${day.toUpperCase()}: start time must be before end time.`, 422);
      if (i && sorted[i].start < sorted[i - 1].end) throw new ApiError(`${day.toUpperCase()}: working hours overlap.`, 422);
    }
  }
  return mutate((db) => { const d = db.doctors.find((x) => x.id === doc.id); d.availability = { weekly, duration: Number(duration), buffer: Number(buffer) }; return d.availability; });
}

export async function addBlockedTime({ date, start, end, reason }) {
  await delay(150);
  const { doc } = requireDoctor();
  if (!date || date < todayISO()) throw new ApiError('Choose today or a future date.', 422, 'date');
  if ((start && !end) || (!start && end) || (start && start >= end)) throw new ApiError('Provide a valid time range or leave both empty for the full day.', 422);
  return mutate((db) => {
    const d = db.doctors.find((x) => x.id === doc.id);
    const b = { id: uid('blk'), date, start: start || null, end: end || null, reason: V.clean(reason || (start ? 'Break' : 'Holiday')) };
    d.blocked = [...(d.blocked || []), b];
    return b;
  });
}
export async function removeBlockedTime(id) {
  const { doc } = requireDoctor();
  return mutate((db) => { const d = db.doctors.find((x) => x.id === doc.id); d.blocked = d.blocked.filter((b) => b.id !== id); });
}

export async function doctorPatients() {
  await delay();
  const { doc } = requireDoctor();
  const db = getDb();
  const map = new Map();
  db.appointments.filter((a) => a.doctorId === doc.id).forEach((a) => {
    const p = map.get(a.patientId) || { id: a.patientId, ...a.patient, visits: 0, last: null };
    p.visits++;
    if (!p.last || a.date > p.last) p.last = a.date;
    map.set(a.patientId, p);
  });
  return [...map.values()].sort((a, b) => b.last.localeCompare(a.last));
}

export async function doctorReviews() {
  await delay();
  const { doc } = requireDoctor();
  return getDb().reviews.filter((r) => r.doctorId === doc.id).map(({ patientId, ...r }) => r);
}

export async function registerDoctor(form) {
  await delay(500);
  const errors = V.collect({
    name: V.name(form.name), email: V.email(form.email), phone: V.phone(form.phone), password: V.password(form.password),
    registrationNumber: V.text(form.registrationNumber, 4, 40, 'Enter your medical registration number'),
    specialty: V.required(form.specialty, 'Select a specialization'), cityId: V.required(form.cityId, 'Select a city'),
    clinicName: V.text(form.clinicName, 2, 120, 'Enter clinic / hospital name'), qualification: V.text(form.qualification, 2, 200, 'Enter qualifications'),
    experienceYears: Number(form.experienceYears) >= 0 && Number(form.experienceYears) <= 70 ? null : 'Enter years of experience',
  });
  if (errors) { const e = new ApiError('Please fix the highlighted fields.', 422); e.fields = errors; throw e; }
  const user = mutate((db) => {
    if (db.users.some((u) => u.email === form.email.toLowerCase())) throw new ApiError('An account with this email already exists.', 409, 'email');
    const cat = db.categories.find((c) => c.specialties.includes(form.specialty)) || db.categories.find((c) => c.slug === 'other');
    const city = db.cities.find((c) => c.id === form.cityId);
    const id = uid('doc');
    const userId = uid('user');
    const clinicId = uid('clinic');
    const name = form.name.trim().startsWith('Dr') ? form.name.trim() : `Dr. ${form.name.trim()}`;
    db.clinics.push({ id: clinicId, doctorIds: [id], name: V.clean(form.clinicName), address: V.clean(form.clinicAddress || city.areas[0].name), area: city.areas[0].name, cityId: city.id, pincode: city.areas[0].pincode, phone: form.phone, hours: 'Mon–Sat: 10:00 AM – 06:00 PM', lat: city.lat, lng: city.lng });
    let slug = slugify(name); let n = 2;
    while (db.doctors.some((d) => d.slug === slug)) slug = `${slugify(name)}-${n++}`;
    db.doctors.push({
      id, slug, name, gender: form.gender || 'male', specialty: form.specialty, specialties: [form.specialty], categoryIds: [cat.id],
      qualifications: form.qualification.split(',').map((q) => ({ degree: q.trim(), institute: '', year: '' })).filter((q) => q.degree),
      experienceYears: Number(form.experienceYears), experience: [], bio: `${name} is a ${form.specialty.toLowerCase()} practicing in ${city.name}.`,
      services: cat.problems.slice(0, 4), languages: ['English'], clinicIds: [clinicId], cityId: city.id, area: city.areas[0].name, pincode: city.areas[0].pincode,
      consultTypes: ['clinic'], availability: { weekly: { mon: [{ start: '10:00', end: '13:00' }], tue: [{ start: '10:00', end: '13:00' }], wed: [{ start: '10:00', end: '13:00' }], thu: [{ start: '10:00', end: '13:00' }], fri: [{ start: '10:00', end: '13:00' }], sat: [], sun: [] }, duration: 30, buffer: 0 },
      blocked: [], verificationStatus: 'pending', registrationNumber: V.clean(form.registrationNumber), verificationDocs: [], featured: false,
      baseRating: 0, baseReviewCount: 0, pricing: { isFree: true, fee: 0, currency: 'INR' }, hue: Math.floor(Math.random() * 360), userId, createdAt: new Date().toISOString(),
    });
    const u = { id: userId, role: 'doctor', name, email: form.email.toLowerCase(), phone: form.phone, password: hashPw(form.password), doctorId: id, status: 'active', createdAt: new Date().toISOString() };
    db.users.push(u);
    notify(db, { userId, type: 'doctor_verification', title: 'Profile submitted for verification', body: 'Our team will review your registration and documents. You will be notified once verified.', email: { subject: 'Your CareFind doctor profile is under review', lines: ['Thank you for joining CareFind.', 'Verification usually takes 1–2 business days.'] } });
    db.users.filter((x) => x.role === 'admin').forEach((a) => notify(db, { userId: a.id, type: 'doctor_verification', title: 'New doctor awaiting verification', body: `${name} · ${form.specialty}`, link: '/admin/doctors' }));
    return u;
  });
  setSession(user); return safeUser(user);
}

// ---------------------------------------------------------------- admin
const admin = () => requireUser(['admin']);

export async function adminOverview() {
  await delay();
  admin();
  const db = getDb();
  const t = todayISO();
  const days = Array.from({ length: 14 }, (_, i) => addDays(t, i - 10));
  return {
    patients: db.users.filter((u) => u.role === 'patient').length,
    doctors: db.doctors.length,
    verified: db.doctors.filter((d) => d.verificationStatus === 'verified').length,
    pendingDoctors: db.doctors.filter((d) => d.verificationStatus === 'pending').length,
    appointments: db.appointments.length,
    today: db.appointments.filter((a) => a.date === t).length,
    completed: db.appointments.filter((a) => a.status === 'completed').length,
    cancelled: db.appointments.filter((a) => a.status === 'cancelled').length,
    pendingReviews: db.reviews.filter((r) => r.status === 'pending').length,
    perDay: days.map((d) => ({ date: d, count: db.appointments.filter((a) => a.date === d).length })),
    topCategories: db.categories.map((c) => ({ name: c.name.split(' / ')[0], count: db.appointments.filter((a) => db.doctors.find((d) => d.id === a.doctorId)?.categoryIds[0] === c.id).length })).filter((x) => x.count).sort((a, b) => b.count - a.count).slice(0, 6),
  };
}

export async function adminDoctors() {
  await delay();
  admin();
  const db = getDb();
  return db.doctors.map((d) => ({ ...d, ...ratingFor(db, d), city: db.cities.find((c) => c.id === d.cityId), clinic: db.clinics.find((c) => c.id === d.clinicIds[0]), appointments: db.appointments.filter((a) => a.doctorId === d.id).length }));
}

export async function adminUpdateDoctor(id, patch) {
  await delay(150);
  admin();
  return mutate((db) => {
    const d = db.doctors.find((x) => x.id === id);
    if (!d) throw new ApiError('Doctor not found', 404);
    const prev = d.verificationStatus;
    ['verificationStatus', 'featured', 'name', 'specialty', 'experienceYears', 'cityId', 'autoConfirm'].forEach((k) => { if (patch[k] !== undefined) d[k] = patch[k]; });
    if (patch.verificationStatus && patch.verificationStatus !== prev && d.userId) {
      const msg = { verified: 'Your profile is verified and now shows the ✓ Verified badge.', rejected: 'Your verification was not approved. Please contact support for details.', suspended: 'Your profile has been suspended and is hidden from search.', pending: 'Your profile has been moved back to pending verification.' }[patch.verificationStatus];
      notify(db, { userId: d.userId, type: 'doctor_verification', title: `Verification status: ${patch.verificationStatus}`, body: msg, email: { subject: 'Update on your CareFind verification', lines: [msg] } });
    }
    return d;
  });
}

export async function adminDeleteDoctor(id) {
  await delay(150);
  admin();
  mutate((db) => {
    db.doctors = db.doctors.filter((d) => d.id !== id);
    db.clinics = db.clinics.filter((c) => !c.doctorIds.includes(id));
    db.users.forEach((u) => { if (u.doctorId === id) u.status = 'suspended'; });
  });
}

export async function adminPatients() {
  await delay();
  admin();
  const db = getDb();
  return db.users.filter((u) => u.role === 'patient').map((u) => ({ ...safeUser(u), appointments: db.appointments.filter((a) => a.patientId === u.id).map((a) => enrichAppt(db, a)) }));
}
export async function adminSetUserStatus(userId, status) {
  admin();
  mutate((db) => { const u = db.users.find((x) => x.id === userId); if (u && u.role !== 'admin') u.status = status; });
}

export async function adminAppointments() {
  await delay();
  admin();
  const db = getDb();
  return db.appointments.map((a) => enrichAppt(db, a)).sort((a, b) => apptTimestamp(b.date, b.time) - apptTimestamp(a.date, a.time));
}

export async function adminSaveCategory(cat) {
  admin();
  if (V.text(cat.name, 2, 60)) throw new ApiError('Category name is required.', 422, 'name');
  return mutate((db) => {
    const slug = cat.slug || slugify(cat.name).replace(/^dr-/, '');
    if (db.categories.some((c) => c.slug === slug && c.id !== cat.id)) throw new ApiError('A category with this slug exists.', 409);
    const clean = { ...cat, slug, name: V.clean(cat.name), description: V.clean(cat.description || ''), problems: cat.problems || [], specialties: cat.specialties || [], keywords: cat.keywords || [] };
    clean.seoTitle = clean.seoTitle || `Find the Best ${clean.name} Doctors Near You | Free Appointment`;
    clean.seoDescription = clean.seoDescription || `Find verified ${clean.name.toLowerCase()} doctors, compare profiles, check availability, and book a free appointment.`;
    if (cat.id) { const i = db.categories.findIndex((c) => c.id === cat.id); db.categories[i] = { ...db.categories[i], ...clean }; return db.categories[i]; }
    const n = { ...clean, id: uid('cat'), icon: cat.icon || 'Plus', color: cat.color || '#2563EB', order: db.categories.length + 1, popular: false };
    db.categories.push(n);
    return n;
  });
}
export async function adminDeleteCategory(id) {
  admin();
  mutate((db) => {
    if (db.doctors.some((d) => d.categoryIds[0] === id)) throw new ApiError('Reassign doctors whose primary category is this one before deleting.', 400);
    db.categories = db.categories.filter((c) => c.id !== id);
    db.doctors.forEach((d) => { d.categoryIds = d.categoryIds.filter((c) => c !== id); });
  });
}

export async function adminLocations() { await delay(120); admin(); const db = getDb(); return { countries: db.countries, states: db.states, cities: db.cities.map((c) => ({ ...c, doctorCount: db.doctors.filter((d) => d.cityId === c.id).length })) }; }
export async function adminSaveCity({ id, name, stateId, lat, lng }) {
  admin();
  if (V.text(name, 2, 60)) throw new ApiError('City name is required.', 422);
  return mutate((db) => {
    const slug = slugify(name).replace(/^dr-/, '');
    if (id) { const c = db.cities.find((x) => x.id === id); Object.assign(c, { name, stateId }); return c; }
    if (db.cities.some((c) => c.slug === slug)) throw new ApiError('City already exists.', 409);
    const c = { id: uid('city'), slug, name: V.clean(name), stateId, lat: Number(lat) || 0, lng: Number(lng) || 0, areas: [], popular: true };
    db.cities.push(c); return c;
  });
}
export async function adminDeleteCity(id) {
  admin();
  mutate((db) => { if (db.doctors.some((d) => d.cityId === id)) throw new ApiError('Cannot delete a city that has doctors.', 400); db.cities = db.cities.filter((c) => c.id !== id); });
}
export async function adminAddArea(cityId, name, pincode) {
  admin();
  if (V.text(name, 2, 60) || !/^[0-9A-Za-z -]{3,10}$/.test(pincode || '')) throw new ApiError('Enter a valid area and ZIP/PIN code.', 422);
  mutate((db) => { const c = db.cities.find((x) => x.id === cityId); c.areas.push({ name: V.clean(name), pincode: pincode.trim() }); });
}
export async function adminRemoveArea(cityId, name) { admin(); mutate((db) => { const c = db.cities.find((x) => x.id === cityId); c.areas = c.areas.filter((a) => a.name !== name); }); }
export async function adminSaveState({ name, countryId }) {
  admin();
  if (V.text(name, 2, 60)) throw new ApiError('State name is required.', 422);
  return mutate((db) => { const s = { id: uid('st'), name: V.clean(name), countryId }; db.states.push(s); return s; });
}
export async function adminSaveCountry({ id, name, currency }) {
  admin();
  if (!/^[A-Z]{2}$/.test(id || '') || V.text(name, 2, 60)) throw new ApiError('Enter a 2-letter country code and name.', 422);
  return mutate((db) => { if (db.countries.some((c) => c.id === id)) throw new ApiError('Country exists.', 409); db.countries.push({ id, name: V.clean(name), currency: currency || 'USD' }); });
}

export async function adminReviews() {
  await delay();
  admin();
  const db = getDb();
  return db.reviews.map((r) => ({ ...r, doctorName: db.doctors.find((d) => d.id === r.doctorId)?.name }));
}
export async function adminModerateReview(id, status) { admin(); mutate((db) => { const r = db.reviews.find((x) => x.id === id); if (r) r.status = status; }); }
export async function adminDeleteReview(id) {
  admin();
  mutate((db) => { db.reviews = db.reviews.filter((r) => r.id !== id); db.appointments.forEach((a) => { if (a.reviewId === id) delete a.reviewId; }); });
}

export async function adminSaveContent(patch) { await delay(150); admin(); mutate((db) => { db.content = { ...db.content, ...patch }; }); }
export async function adminSaveFaqs(faqs) { admin(); mutate((db) => { db.faqs = faqs.filter((f) => f.q.trim() && f.a.trim()); }); }
export async function adminOutbox() { await delay(100); admin(); return getDb().outbox; }
export async function adminJobs() { admin(); return getDb().jobs; }
export function adminResetDemo() { admin(); resetDb(); }

// ---------------------------------------------------------------- background jobs (reminders, lock cleanup)
export function runBackgroundTick() {
  const db = getDb();
  const hasDue = db.jobs.some((j) => j.status === 'queued' && j.sendAt <= Date.now());
  const hasExpired = db.locks.some((l) => l.expiresAt <= Date.now());
  if (hasDue || hasExpired) mutate((x) => { processDueJobs(x); x.locks = x.locks.filter((l) => l.expiresAt > Date.now()); });
}
