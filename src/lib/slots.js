// Slot engine: turns a doctor's weekly availability template into concrete bookable slots,
// removing blocked periods, existing appointments, active locks held by other sessions, and past times.

import { dayKeyOf, toMinutes, fromMinutes, todayISO, nowMinutes, addDays } from './dates';

export const ACTIVE_STATUSES = ['pending', 'confirmed']; // statuses that occupy a slot
export const LOCK_TTL_MS = 5 * 60 * 1000; // temporary reservation while the patient fills the form

function overlaps(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }

export function generateSlots(doctor, dateISO, { appointments = [], locks = [], sessionId = null, ignoreAppointmentId = null } = {}) {
  const { weekly, duration, buffer } = doctor.availability;
  const windows = weekly[dayKeyOf(dateISO)] || [];
  if (!windows.length) return [];

  const blocked = (doctor.blocked || []).filter((b) => b.date === dateISO);
  if (blocked.some((b) => !b.start)) return []; // full day off / holiday

  const isToday = dateISO === todayISO();
  if (dateISO < todayISO()) return [];
  const nowMin = nowMinutes();

  const booked = appointments
    .filter((a) => a.doctorId === doctor.id && a.date === dateISO && ACTIVE_STATUSES.includes(a.status) && a.id !== ignoreAppointmentId)
    .map((a) => [toMinutes(a.time), toMinutes(a.time) + (a.duration || duration)]);

  const now = Date.now();
  const lockedTimes = locks
    .filter((l) => l.doctorId === doctor.id && l.date === dateISO && l.expiresAt > now && l.sessionId !== sessionId)
    .map((l) => toMinutes(l.time));

  const slots = [];
  const step = duration + buffer;
  windows.forEach((w) => {
    for (let t = toMinutes(w.start); t + duration <= toMinutes(w.end); t += step) {
      let reason = null;
      if (isToday && t <= nowMin + 15) reason = 'past';
      else if (blocked.some((b) => overlaps(t, t + duration, toMinutes(b.start), toMinutes(b.end)))) reason = 'blocked';
      else if (booked.some(([s, e]) => overlaps(t, t + duration, s, e))) reason = 'booked';
      else if (lockedTimes.includes(t)) reason = 'reserved';
      slots.push({ time: fromMinutes(t), available: !reason, reason });
    }
  });
  return slots;
}

export function nextAvailableSlot(doctor, ctx, days = 14) {
  const start = todayISO();
  for (let i = 0; i < days; i++) {
    const date = addDays(start, i);
    const slot = generateSlots(doctor, date, ctx).find((s) => s.available);
    if (slot) return { date, time: slot.time };
  }
  return null;
}

export function availableDates(doctor, ctx, days = 14) {
  const start = todayISO();
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(start, i);
    const slots = generateSlots(doctor, date, ctx);
    return { date, total: slots.length, free: slots.filter((s) => s.available).length };
  });
}
