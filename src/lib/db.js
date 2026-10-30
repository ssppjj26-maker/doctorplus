// Mock relational database persisted in localStorage.
// Tables mirror the planned Supabase/PostgreSQL schema (see docs/schema.sql) so the
// service layer in lib/api.js can be swapped for real API calls later.

import { SEED_CATEGORIES } from '../data/categories';
import { SEED_COUNTRIES, SEED_STATES, SEED_CITIES } from '../data/locations';
import { buildSeedDoctors } from '../data/doctors';
import { SEED_POSTS, SEED_FAQS, SEED_CONTENT } from '../data/content';
import { generateSlots } from './slots';
import { todayISO, addDays } from './dates';

const KEY = 'carefind_db_v3';
let state = null;
let version = 0;
const listeners = new Set();

export const DEMO_PASSWORD = 'demo1234';
// NOTE: demo-only obfuscation. A real backend must use Supabase Auth / bcrypt and never store passwords client-side.
export const hashPw = (pw) => `demo$${btoa(unescape(encodeURIComponent(pw)))}`;

const FICTIONAL_PATIENTS = [
  ['Ravi Kumar', 'male', 34], ['Sneha Patel', 'female', 29], ['Amit Shah', 'male', 45], ['Fatima Sheikh', 'female', 38],
  ['Rahul Verma', 'male', 52], ['Pooja Mishra', 'female', 26], ['Imran Khan', 'male', 41], ['Nisha Rao', 'female', 33],
  ['Suresh Iyer', 'male', 60], ['Kiran Joshi', 'female', 47], ['Anil Gupta', 'male', 55], ['Megha Jain', 'female', 31],
];

let idCounter = 0;
export function uid(prefix) {
  idCounter = (idCounter + 1) % 1000;
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
export function bookingId(existing = new Set()) {
  let id;
  do { id = `APT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`; } while (existing.has(id));
  return id;
}

function seed() {
  const categories = SEED_CATEGORIES;
  const { doctors, clinics } = buildSeedDoctors(categories);
  const now = new Date().toISOString();
  const today = todayISO();

  const users = [
    { id: 'user_admin', role: 'admin', name: 'Platform Admin', email: 'admin@demo.com', phone: '+910000000001', password: hashPw(DEMO_PASSWORD), status: 'active', createdAt: now },
    { id: 'user_patient', role: 'patient', name: 'Demo Patient', email: 'patient@demo.com', phone: '+919999900000', password: hashPw(DEMO_PASSWORD), status: 'active', age: 32, gender: 'female', cityId: 'city_1', createdAt: now },
    { id: 'user_doctor', role: 'doctor', name: doctors[0].name, email: 'doctor@demo.com', phone: '+919999900001', password: hashPw(DEMO_PASSWORD), status: 'active', doctorId: doctors[0].id, createdAt: now },
  ];
  doctors[0].userId = 'user_doctor';
  FICTIONAL_PATIENTS.forEach(([name, gender, age], i) => {
    users.push({ id: `user_p${i + 1}`, role: 'patient', name, gender, age, email: `${name.split(' ')[0].toLowerCase()}.sample${i + 1}@example.com`, phone: `+9190000${String(10000 + i).slice(-5)}`, status: 'active', isSample: true, createdAt: now });
  });

  const appointments = [];
  const ids = new Set();
  const mk = (doc, patientUser, date, time, status, extra = {}) => {
    const id = bookingId(ids); ids.add(id);
    const a = {
      id, doctorId: doc.id, patientId: patientUser.id, clinicId: doc.clinicIds[0], date, time,
      duration: doc.availability.duration, type: extra.type || 'clinic', status,
      patient: { name: patientUser.name, phone: patientUser.phone, email: patientUser.email, age: patientUser.age, gender: patientUser.gender },
      reason: extra.reason || 'Consultation', message: '', createdAt: now, updatedAt: now,
      history: [{ status, at: now, by: 'system' }],
      payment: { required: false, amount: 0, currency: doc.pricing.currency, status: 'not_required' },
      isSample: true,
    };
    appointments.push(a);
    return a;
  };
  // pick the n-th free future slot for a doctor, starting dayOffset days out
  const futureSlot = (doc, dayOffset, n = 2) => {
    for (let i = dayOffset; i < dayOffset + 14; i++) {
      const date = addDays(today, i);
      const free = generateSlots(doc, date, { appointments }).filter((s) => s.available);
      if (free.length > n) return { date, time: free[n].time };
    }
    return null;
  };
  const pastSlot = (offset, time) => ({ date: addDays(today, -offset), time });

  const P = users.find((u) => u.id === 'user_patient');
  const samples = users.filter((u) => u.isSample);
  const D = (n) => doctors[n - 1];

  // Demo patient appointments
  let s = futureSlot(D(1), 2, 3); if (s) mk(D(1), P, s.date, s.time, 'confirmed', { reason: 'Acne follow-up' });
  s = futureSlot(D(7), 5, 1); if (s) mk(D(7), P, s.date, s.time, 'pending', { reason: 'Routine heart checkup', type: 'video' });
  s = pastSlot(6, '10:00'); const done1 = mk(D(2), P, s.date, s.time, 'completed', { reason: 'Blood sugar review' });
  s = pastSlot(21, '11:00'); const done2 = mk(D(3), P, s.date, s.time, 'completed', { reason: 'Tooth pain' });
  s = pastSlot(12, '17:00'); mk(D(8), P, s.date, s.time, 'cancelled', { reason: 'Skin allergy' });

  // Demo doctor (doc_1) schedule
  [0, 0, 1, 1, 2, 3, 4, 6].forEach((off, i) => {
    const sl = futureSlot(D(1), off, i % 3);
    if (sl) mk(D(1), samples[i % samples.length], sl.date, sl.time, i % 3 === 0 ? 'pending' : 'confirmed', { reason: ['Acne', 'Pigmentation', 'Hair fall', 'Eczema', 'Skin allergy'][i % 5], type: i % 4 === 0 ? 'video' : 'clinic' });
  });
  [2, 3, 5, 8, 9, 14, 16, 22, 25, 30].forEach((off, i) => {
    const st = i === 3 ? 'no_show' : i === 6 ? 'cancelled' : 'completed';
    mk(D(1), samples[(i + 3) % samples.length], addDays(today, -off), ['09:30', '10:15', '11:00', '16:30', '17:45'][i % 5], st, { reason: ['Acne', 'Dandruff', 'Psoriasis', 'Fungal infection'][i % 4] });
  });
  // Spread bookings across other doctors so availability looks realistic
  doctors.slice(1, 30).forEach((doc, i) => {
    const sl = futureSlot(doc, i % 3, 0);
    if (sl) mk(doc, samples[i % samples.length], sl.date, sl.time, 'confirmed');
  });

  // Sample reviews – clearly flagged as development sample data.
  const reviews = [];
  const addReview = (doc, appt, patientName, rating, text, status = 'approved') => {
    const r = { id: uid('rev'), doctorId: doc.id, appointmentId: appt ? appt.id : null, patientId: appt ? appt.patientId : null, patientName, rating, text, aspects: { knowledge: rating, communication: rating, clinic: Math.max(3, rating - 1), waiting: Math.max(3, rating - 1) }, status, createdAt: now, isSample: true };
    reviews.push(r);
    if (appt) appt.reviewId = r.id;
    return r;
  };
  addReview(D(3), done2, 'Demo Patient', 5, 'Sample review: The doctor explained the root canal procedure clearly and the clinic was very clean.');
  const docAppts = appointments.filter((a) => a.doctorId === 'doc_1' && a.status === 'completed');
  addReview(D(1), docAppts[0], 'Sample Patient (R.)', 5, 'Sample review: Very patient and explained my treatment options in detail. Booking was effortless.');
  addReview(D(1), docAppts[1], 'Sample Patient (S.)', 4, 'Sample review: Good consultation. Waiting time was around 15 minutes.');
  addReview(D(7), null, 'Sample Patient (A.)', 5, 'Sample review: Thorough heart checkup and a clear explanation of my reports.');
  addReview(D(2), null, 'Sample Patient (F.)', 5, 'Sample review: Helped me understand my blood sugar numbers without any jargon.');
  addReview(D(10), null, 'Sample Patient (N.)', 4, 'Sample review: Caring and attentive throughout my pregnancy visits.');
  addReview(D(14), null, 'Sample Patient (M.)', 5, 'Sample review: Felt genuinely heard. The video consultation worked smoothly.');
  addReview(D(1), docAppts[2], 'Sample Patient (K.)', 3, 'Sample review awaiting moderation.', 'pending');

  const notifications = [
    { id: uid('ntf'), userId: 'user_patient', type: 'appointment_completed', title: 'How was your visit?', body: `Share your experience with ${D(2).name}.`, read: false, createdAt: now, link: '/dashboard/past' },
    { id: uid('ntf'), userId: 'user_doctor', type: 'review_received', title: 'New review awaiting moderation', body: 'A patient left a 3★ review. It will appear after admin approval.', read: false, createdAt: now },
  ];

  return {
    meta: { version: 3, seededAt: now, isDemo: true },
    countries: SEED_COUNTRIES, states: SEED_STATES, cities: SEED_CITIES,
    categories, doctors, clinics, users, appointments, reviews,
    savedDoctors: [{ userId: 'user_patient', doctorId: 'doc_7', createdAt: now }, { userId: 'user_patient', doctorId: 'doc_14', createdAt: now }],
    notifications, outbox: [], jobs: [], locks: [],
    posts: SEED_POSTS, faqs: SEED_FAQS, content: SEED_CONTENT,
    otps: [],
  };
}

export function getDb() {
  if (!state) {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try { state = JSON.parse(raw); } catch { state = null; }
    }
    if (!state) { state = seed(); localStorage.setItem(KEY, JSON.stringify(state)); }
  }
  return state;
}

function reloadFromStorage() {
  const raw = localStorage.getItem(KEY);
  if (raw) { try { state = JSON.parse(raw); } catch { /* keep memory copy */ } }
}

function emit() { version++; listeners.forEach((l) => l()); }

/** Run a write transaction: re-read latest state (other tabs), apply fn, persist. */
export function mutate(fn) {
  reloadFromStorage();
  getDb();
  const result = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  emit();
  return result;
}

export function resetDb() {
  state = seed();
  localStorage.setItem(KEY, JSON.stringify(state));
  emit();
}

export function subscribe(l) { listeners.add(l); return () => listeners.delete(l); }
export function getVersion() { return version; }

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { reloadFromStorage(); emit(); }
  });
}
