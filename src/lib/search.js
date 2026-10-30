// Natural-language search → { category, city, area } mapping.
// This is purely a keyword → specialty navigator. It never diagnoses.

const STOPWORDS = new Set(['doctor', 'doctors', 'dr', 'for', 'in', 'near', 'me', 'nearby', 'a', 'an', 'the', 'best', 'top', 'good',
  'specialist', 'specialists', 'clinic', 'problem', 'problems', 'issue', 'issues', 'treatment', 'consultation', 'my', 'i', 'have',
  'need', 'want', 'find', 'with', 'of', 'and', 'to', 'at', 'around', 'book', 'appointment']);

const norm = (s) => ` ${s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;
const has = (text, phrase) => text.includes(` ${phrase.toLowerCase()} `);

export function parseQuery(query, { categories, cities }) {
  const result = { category: null, city: null, area: null, nearMe: false, text: '', original: query || '' };
  if (!query || !query.trim()) return result;
  let text = norm(query);

  if (has(text, 'near me') || has(text, 'nearby')) result.nearMe = true;

  // PIN / ZIP code.
  const pin = text.match(/\s(\d{5,6})\s/);
  if (pin) {
    for (const c of cities) {
      const a = c.areas.find((x) => x.pincode === pin[1]);
      if (a) { result.city = c; result.area = a; break; }
    }
    text = text.replace(pin[0], ' ');
  }

  // Area names first (more specific), then city names.
  if (!result.area) {
    outer: for (const c of cities) {
      for (const a of c.areas) {
        if (has(text, norm(a.name).trim())) { result.city = c; result.area = a; text = text.replace(norm(a.name), ' '); break outer; }
      }
    }
  }
  for (const c of cities) {
    const n = norm(c.name).trim();
    if (has(text, n) || (c.slug === 'bengaluru' && has(text, 'bangalore')) || (c.slug === 'new-york' && has(text, 'nyc'))) {
      result.city = result.city || c;
      text = text.replace(` ${n} `, ' ').replace(' bangalore ', ' ').replace(' nyc ', ' ');
    }
  }

  // Category scoring.
  let best = null; let bestScore = 0;
  for (const cat of categories) {
    let score = 0;
    const name = norm(cat.name.split(' / ')[0]).trim();
    if (has(text, name)) score += 6;
    for (const k of cat.keywords || []) if (has(text, k)) score += 2 * k.split(' ').length;
    for (const s of cat.specialties || []) if (has(text, norm(s).trim())) score += 3;
    for (const p of cat.problems || []) if (has(text, norm(p).trim())) score += 1;
    if (score > bestScore) { bestScore = score; best = cat; }
  }
  if (best) result.category = best;

  result.text = text.split(' ').filter((w) => w && !STOPWORDS.has(w)).join(' ');
  return result;
}

/** Autocomplete suggestions: categories, specialties, problems and doctors. */
export function suggest(query, { categories, doctors = [] }, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out = [];
  for (const c of categories) {
    if (c.name.toLowerCase().includes(q) || c.keywords.some((k) => k.startsWith(q))) out.push({ type: 'category', label: c.name, value: c.name, cat: c });
  }
  const seen = new Set(out.map((o) => o.label.toLowerCase()));
  for (const c of categories) {
    for (const p of [...c.specialties, ...c.problems]) {
      if (p.toLowerCase().includes(q) && !seen.has(p.toLowerCase())) { seen.add(p.toLowerCase()); out.push({ type: 'problem', label: p, value: p, cat: c }); }
    }
  }
  for (const d of doctors) {
    if (d.name.toLowerCase().includes(q)) out.push({ type: 'doctor', label: d.name, sub: d.specialty, doctor: d });
  }
  return out.slice(0, limit);
}

export function nearestCity(lat, lng, cities) {
  let best = null; let bd = Infinity;
  for (const c of cities) {
    const d = (c.lat - lat) ** 2 + (c.lng - lng) ** 2;
    if (d < bd) { bd = d; best = c; }
  }
  return best;
}
