// Multi-channel notification dispatcher.
// MVP: in-app + email (written to a mock outbox, visible at /admin/emails).
// SMS / WhatsApp / Push adapters are stubbed so providers (Twilio, Gupshup, FCM…) can be plugged in later.

import { uid } from './db';
import { fmtDate, fmtTime, apptTimestamp } from './dates';

const TYPE_LABEL = { clinic: 'In-clinic visit', video: 'Video consultation', phone: 'Phone consultation' };
export const typeLabel = (t) => TYPE_LABEL[t] || t;

const ADAPTERS = {
  email: (db, msg) => {
    db.outbox.unshift({ id: uid('mail'), to: msg.to, subject: msg.subject, lines: msg.lines, status: 'sent (mock)', sentAt: new Date().toISOString() });
    db.outbox = db.outbox.slice(0, 200);
  },
  sms: () => { /* future: SMS provider */ },
  whatsapp: () => { /* future: WhatsApp Business API */ },
  push: () => { /* future: web push / FCM */ },
};

export const ENABLED_CHANNELS = ['in_app', 'email'];

/** Send a notification inside an open db transaction. */
export function notify(db, { userId, type, title, body, link, email }) {
  const user = db.users.find((u) => u.id === userId);
  if (!user) return;
  db.notifications.unshift({ id: uid('ntf'), userId, type, title, body, link: link || null, read: false, createdAt: new Date().toISOString() });
  if (email && user.email && ENABLED_CHANNELS.includes('email')) ADAPTERS.email(db, { to: user.email, ...email });
}

export function appointmentEmailLines(db, appt) {
  const doc = db.doctors.find((d) => d.id === appt.doctorId);
  const clinic = db.clinics.find((c) => c.id === appt.clinicId);
  const city = clinic && db.cities.find((c) => c.id === clinic.cityId);
  return [
    `Doctor: ${doc?.name} (${doc?.specialty})`,
    `Clinic: ${clinic?.name}`,
    `Date: ${fmtDate(appt.date)}`,
    `Time: ${fmtTime(appt.time)}`,
    `Appointment ID: ${appt.id}`,
    `Location: ${clinic?.address}${city ? `, ${city.name}` : ''}`,
    `Appointment type: ${typeLabel(appt.type)}`,
    'Booking fee: FREE',
  ];
}

const REMINDERS = [
  { kind: 'reminder_24h', offsetMs: 24 * 3600e3, label: 'tomorrow' },
  { kind: 'reminder_2h', offsetMs: 2 * 3600e3, label: 'in 2 hours' },
];

/** Queue 24h / 2h reminder jobs for a confirmed appointment. */
export function scheduleReminders(db, appt) {
  cancelReminders(db, appt.id);
  const ts = apptTimestamp(appt.date, appt.time);
  REMINDERS.forEach((r) => {
    const sendAt = ts - r.offsetMs;
    if (sendAt > Date.now()) db.jobs.push({ id: uid('job'), kind: r.kind, appointmentId: appt.id, sendAt, status: 'queued' });
  });
}

export function cancelReminders(db, appointmentId) {
  db.jobs.forEach((j) => { if (j.appointmentId === appointmentId && j.status === 'queued') j.status = 'cancelled'; });
}

/** Process due reminder jobs. Only confirmed appointments receive reminders. */
export function processDueJobs(db) {
  let changed = false;
  const now = Date.now();
  db.jobs.forEach((j) => {
    if (j.status !== 'queued' || j.sendAt > now) return;
    changed = true;
    const appt = db.appointments.find((a) => a.id === j.appointmentId);
    if (!appt || appt.status !== 'confirmed') { j.status = 'skipped'; return; }
    const r = REMINDERS.find((x) => x.kind === j.kind);
    const doc = db.doctors.find((d) => d.id === appt.doctorId);
    notify(db, {
      userId: appt.patientId, type: 'appointment_reminder', title: `Reminder: appointment ${r.label}`,
      body: `${doc?.name} · ${fmtDate(appt.date)} at ${fmtTime(appt.time)}`, link: '/dashboard/upcoming',
      email: { subject: `Reminder: Your appointment is ${r.label}`, lines: appointmentEmailLines(db, appt) },
    });
    j.status = 'sent';
  });
  return changed;
}
