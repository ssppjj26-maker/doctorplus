// Date/time helpers. All appointment dates are stored as local 'YYYY-MM-DD' and times as 'HH:MM' (24h).

export const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const DAY_NAMES = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
export const WEEK_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const pad = (n) => String(n).padStart(2, '0');

export function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function todayISO() { return toISODate(new Date()); }
export function addDays(iso, n) {
  const d = parseISODate(iso); d.setDate(d.getDate() + n); return toISODate(d);
}
export function dayKeyOf(iso) { return DAY_KEYS[parseISODate(iso).getDay()]; }

export function toMinutes(hhmm) { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; }
export function fromMinutes(min) { return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`; }
export function nowMinutes() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }

export function fmtTime(hhmm) {
  if (!hhmm) return '';
  let [h, m] = hhmm.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)}:${pad(m)} ${ap}`;
}

export function fmtDate(iso, opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) {
  return parseISODate(iso).toLocaleDateString('en-IN', opts);
}

export function relativeDay(iso) {
  const t = todayISO();
  if (iso === t) return 'Today';
  if (iso === addDays(t, 1)) return 'Tomorrow';
  return fmtDate(iso, { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Absolute timestamp (ms) for an appointment date + time in local tz. */
export function apptTimestamp(dateISO, hhmm) {
  const d = parseISODate(dateISO);
  const [h, m] = hhmm.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

export function timeAgo(isoTs) {
  const diff = (Date.now() - new Date(isoTs).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
