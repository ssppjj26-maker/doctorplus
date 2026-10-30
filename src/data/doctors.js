// DEVELOPMENT / SAMPLE DATA ONLY.
// All doctors, clinics, phone numbers and registration numbers below are fictional
// and generated for demo purposes. They do not represent real people or practices.

import { SEED_CITIES } from './locations';

// [name, gender, primaryCategory, specialtyTitle, city, areaIdx, years, secondaryCategory, status, featured]
const ROSTER = [
  ['Dr. Aarav Mehta', 'male', 'dermatologist', 'Dermatologist', 'ahmedabad', 0, 12, 'hair-loss', 'verified', true],
  ['Dr. Kavya Desai', 'female', 'diabetes', 'Diabetologist', 'ahmedabad', 1, 15, 'endocrinologist', 'verified', true],
  ['Dr. Rohan Patel', 'male', 'dentist', 'Dentist', 'ahmedabad', 2, 9, null, 'verified', false],
  ['Dr. Ishita Shah', 'female', 'weight-loss', 'Obesity Medicine Specialist', 'ahmedabad', 4, 11, 'nutritionist', 'verified', true],
  ['Dr. Vihaan Trivedi', 'male', 'prostate', 'Urologist', 'ahmedabad', 3, 18, 'urologist', 'verified', false],
  ['Dr. Meera Joshi', 'female', 'general-physician', 'General Physician', 'ahmedabad', 5, 7, 'diabetes', 'verified', false],
  ['Dr. Arjun Nair', 'male', 'cardiology', 'Cardiologist', 'mumbai', 0, 20, null, 'verified', true],
  ['Dr. Sanya Kapoor', 'female', 'dermatologist', 'Cosmetic Dermatologist', 'mumbai', 1, 10, null, 'verified', false],
  ['Dr. Kabir Malhotra', 'male', 'orthopedic', 'Orthopedic Surgeon', 'mumbai', 2, 14, 'pain-management', 'verified', false],
  ['Dr. Ananya Kulkarni', 'female', 'gynecologist', 'Gynecologist', 'mumbai', 3, 16, 'fertility', 'verified', true],
  ['Dr. Dev Bhatia', 'male', 'diabetes', 'Endocrinologist', 'delhi', 0, 13, 'endocrinologist', 'verified', false],
  ['Dr. Riya Sethi', 'female', 'pediatrician', 'Pediatrician', 'delhi', 1, 8, null, 'verified', false],
  ['Dr. Nikhil Arora', 'male', 'gastroenterologist', 'Gastroenterologist', 'delhi', 2, 12, null, 'verified', false],
  ['Dr. Tara Menon', 'female', 'psychiatrist', 'Psychiatrist', 'bengaluru', 0, 9, null, 'verified', true],
  ['Dr. Aditya Rao', 'male', 'neurologist', 'Neurologist', 'bengaluru', 1, 17, null, 'verified', false],
  ['Dr. Pooja Hegde', 'female', 'dentist', 'Orthodontist', 'bengaluru', 2, 6, null, 'verified', false],
  ['Dr. Sameer Reddy', 'male', 'ent', 'ENT Specialist', 'hyderabad', 0, 11, null, 'verified', false],
  ['Dr. Lakshmi Iyer', 'female', 'eye-specialist', 'Ophthalmologist', 'hyderabad', 1, 19, null, 'verified', false],
  ['Dr. Varun Deshpande', 'male', 'hair-loss', 'Trichologist', 'pune', 0, 8, 'dermatologist', 'verified', true],
  ['Dr. Neha Gokhale', 'female', 'nutritionist', 'Clinical Nutritionist', 'pune', 1, 6, 'weight-loss', 'verified', false],
  ['Dr. Karthik Subramanian', 'male', 'pulmonologist', 'Pulmonologist', 'chennai', 0, 14, null, 'verified', false],
  ['Dr. Divya Krishnan', 'female', 'endocrinologist', 'Endocrinologist', 'chennai', 1, 10, 'diabetes', 'verified', false],
  ['Dr. Arnab Banerjee', 'male', 'nephrologist', 'Nephrologist', 'kolkata', 0, 16, null, 'verified', false],
  ['Dr. Shreya Ghosh', 'female', 'physiotherapist', 'Physiotherapist', 'kolkata', 1, 7, 'orthopedic', 'verified', false],
  ['Dr. Manish Agarwal', 'male', 'urologist', 'Urologist', 'jaipur', 0, 13, 'prostate', 'verified', false],
  ['Dr. Priya Rathore', 'female', 'dermatologist', 'Dermatologist', 'jaipur', 1, 9, null, 'verified', false],
  ['Dr. Hardik Vyas', 'male', 'dentist', 'Oral Surgeon', 'surat', 0, 10, null, 'verified', false],
  ['Dr. Krupa Parekh', 'female', 'weight-loss', 'Bariatric Specialist', 'surat', 1, 15, null, 'verified', false],
  ['Dr. Jay Raval', 'male', 'general-physician', 'Family Medicine', 'rajkot', 0, 22, 'diabetes', 'verified', false],
  ['Dr. Nidhi Pandya', 'female', 'allergy', 'Allergist', 'vadodara', 0, 8, null, 'verified', false],
  ['Dr. Emily Carter', 'female', 'cardiology', 'Cardiologist', 'new-york', 0, 18, null, 'verified', true],
  ['Dr. Daniel Brooks', 'male', 'sexual-health', 'Andrologist', 'new-york', 1, 12, 'urologist', 'verified', false],
  ['Dr. Harsh Solanki', 'male', 'rheumatologist', 'Rheumatologist', 'vadodara', 1, 5, null, 'pending', false],
  ['Dr. Rhea Thakkar', 'female', 'oncologist', 'Medical Oncologist', 'ahmedabad', 6, 11, null, 'pending', false],
];

const QUALS = {
  dermatologist: ['MBBS', 'MD Dermatology', 'Fellowship in Cosmetic Dermatology'],
  'hair-loss': ['MBBS', 'MD Dermatology', 'Fellowship in Trichology'],
  diabetes: ['MBBS', 'MD General Medicine', 'Fellowship in Diabetology'],
  endocrinologist: ['MBBS', 'MD Medicine', 'DM Endocrinology'],
  dentist: ['BDS', 'MDS'],
  'weight-loss': ['MBBS', 'MD Internal Medicine', 'Certificate in Obesity Medicine'],
  prostate: ['MBBS', 'MS General Surgery', 'MCh Urology'],
  urologist: ['MBBS', 'MS Surgery', 'MCh Urology'],
  'general-physician': ['MBBS', 'MD General Medicine'],
  cardiology: ['MBBS', 'MD Medicine', 'DM Cardiology'],
  orthopedic: ['MBBS', 'MS Orthopaedics'],
  gynecologist: ['MBBS', 'MS Obstetrics & Gynaecology'],
  pediatrician: ['MBBS', 'MD Pediatrics'],
  gastroenterologist: ['MBBS', 'MD Medicine', 'DM Gastroenterology'],
  psychiatrist: ['MBBS', 'MD Psychiatry'],
  neurologist: ['MBBS', 'MD Medicine', 'DM Neurology'],
  ent: ['MBBS', 'MS ENT'],
  'eye-specialist': ['MBBS', 'MS Ophthalmology'],
  nutritionist: ['BSc Nutrition', 'MSc Clinical Nutrition', 'Registered Dietitian'],
  pulmonologist: ['MBBS', 'MD Pulmonary Medicine'],
  nephrologist: ['MBBS', 'MD Medicine', 'DM Nephrology'],
  physiotherapist: ['BPT', 'MPT Orthopaedics'],
  allergy: ['MBBS', 'MD Medicine', 'Fellowship in Allergy & Immunology'],
  'sexual-health': ['MD', 'Fellowship in Andrology'],
  rheumatologist: ['MBBS', 'MD Medicine', 'DM Rheumatology'],
  oncologist: ['MBBS', 'MD Medicine', 'DM Medical Oncology'],
};

const CLINIC_WORDS = {
  dermatologist: 'Skin Care Clinic', 'hair-loss': 'Hair & Scalp Centre', diabetes: 'Diabetes & Metabolic Centre',
  dentist: 'Dental Studio', 'weight-loss': 'Weight Wellness Clinic', prostate: 'Urology & Prostate Centre',
  urologist: 'Uro Care Hospital', 'general-physician': 'Family Health Clinic', cardiology: 'Heart Care Centre',
  orthopedic: 'Bone & Joint Clinic', gynecologist: "Women's Health Clinic", pediatrician: 'Kids Care Clinic',
  gastroenterologist: 'Digestive Health Centre', psychiatrist: 'Mind Wellness Clinic', neurologist: 'Neuro Care Centre',
  ent: 'ENT Care Clinic', 'eye-specialist': 'Eye & Vision Centre', nutritionist: 'Nutrition Studio',
  pulmonologist: 'Chest & Lung Clinic', endocrinologist: 'Hormone & Thyroid Clinic', nephrologist: 'Kidney Care Centre',
  physiotherapist: 'Physio & Rehab Centre', allergy: 'Allergy Care Clinic', 'sexual-health': "Men's Health Clinic",
  rheumatologist: 'Arthritis Care Clinic', oncologist: 'Cancer Care Centre',
};

const STATE_LANG = { GJ: 'Gujarati', MH: 'Marathi', DL: 'Punjabi', KA: 'Kannada', TG: 'Telugu', TN: 'Tamil', WB: 'Bengali', RJ: 'Rajasthani', NY: 'Spanish' };
const UNIS = ['B.J. Medical College', 'Grant Medical College', 'AIIMS New Delhi', 'Maulana Azad Medical College', 'Seth G.S. Medical College', 'Madras Medical College', 'KEM Hospital', 'Kasturba Medical College', 'Christian Medical College'];
const HOSPITALS = ['City General Hospital', 'Sunrise Multispeciality Hospital', 'Lifeline Hospital', 'Apex Medical Institute', 'Greenleaf Hospital', 'Unity Care Hospital'];

// Small deterministic PRNG so demo data is identical on every reset.
function rng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function slugify(str) {
  return str.toLowerCase().replace(/^dr\.?\s*/, 'dr-').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function buildSeedDoctors(categories) {
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const doctors = [];
  const clinics = [];

  ROSTER.forEach((row, i) => {
    const [name, gender, catSlug, title, citySlug, areaIdx, years, secondary, status, featured] = row;
    const r = rng(1000 + i * 97);
    const city = SEED_CITIES.find((c) => c.slug === citySlug);
    const area = city.areas[areaIdx % city.areas.length];
    const cat = catBySlug[catSlug];
    const cat2 = secondary ? catBySlug[secondary] : null;
    const id = `doc_${i + 1}`;
    const last = name.split(' ').slice(-1)[0];

    const quals = (QUALS[catSlug] || ['MBBS', 'MD']).map((degree, qi, arr) => ({
      degree,
      institute: UNIS[Math.floor(r() * UNIS.length)],
      year: 2026 - years - (arr.length - qi) * 2 - 2,
    }));

    const languages = city.stateId === 'NY' ? ['English', 'Spanish'] : ['English', 'Hindi', STATE_LANG[city.stateId]].filter((v, k, a) => v && a.indexOf(v) === k);

    const services = [...cat.problems.slice(0, 6), ...(cat2 ? cat2.problems.slice(0, 2) : [])];
    const specialties = [title, ...cat.specialties.filter((s) => s !== title).slice(0, 1), ...(cat2 ? [cat2.specialties[0]] : [])]
      .filter((v, k, a) => a.indexOf(v) === k);

    // Clinics: every doctor has a primary clinic; some consult at a second hospital.
    const clinicId = `clinic_${i + 1}`;
    clinics.push({
      id: clinicId, doctorIds: [id], name: `${last} ${CLINIC_WORDS[catSlug] || 'Clinic'}`,
      address: `${100 + Math.floor(r() * 800)}, ${['Shivalik Plaza', 'Sapphire Complex', 'Galaxy Towers', 'Orchid Arcade', 'Lotus Business Park'][Math.floor(r() * 5)]}, ${area.name}`,
      area: area.name, cityId: city.id, pincode: area.pincode,
      phone: city.stateId === 'NY' ? `+1 (212) 555-01${String(10 + i).slice(-2)}` : `+91 79000 0${String(1000 + i * 37).slice(-4)}`,
      hours: 'Mon–Sat: 09:00 AM – 01:00 PM, 04:00 PM – 08:00 PM',
      lat: city.lat + (r() - 0.5) * 0.08, lng: city.lng + (r() - 0.5) * 0.08,
    });
    const clinicIds = [clinicId];
    if (i % 4 === 0) {
      const cid2 = `clinic_${i + 1}_b`;
      const area2 = city.areas[(areaIdx + 1) % city.areas.length];
      clinics.push({
        id: cid2, doctorIds: [id], name: HOSPITALS[i % HOSPITALS.length],
        address: `Main Road, ${area2.name}`, area: area2.name, cityId: city.id, pincode: area2.pincode,
        phone: city.stateId === 'NY' ? '+1 (212) 555-0199' : '+91 79000 09999',
        hours: 'Sat: 10:00 AM – 02:00 PM', lat: city.lat + 0.02, lng: city.lng - 0.02,
      });
      clinicIds.push(cid2);
    }

    // Weekly availability template.
    const sundayOpen = r() > 0.7;
    const weekly = {};
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((d) => {
      if (d === 'sun' && !sundayOpen) { weekly[d] = []; return; }
      if (d === 'sat') { weekly[d] = [{ start: '09:00', end: '13:00' }]; return; }
      if (d === 'sun') { weekly[d] = [{ start: '10:00', end: '12:00' }]; return; }
      if (d === ['mon', 'tue', 'wed', 'thu', 'fri'][i % 5] && r() > 0.5) { weekly[d] = [{ start: '16:00', end: '20:00' }]; return; }
      weekly[d] = [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }];
    });

    const consultTypes = ['clinic'];
    if (r() > 0.35 || catSlug === 'psychiatrist') consultTypes.push('video');
    if (r() > 0.5) consultTypes.push('phone');

    const timeline = [
      { role: `Senior Consultant – ${title}`, place: clinics.find((c) => c.id === clinicId).name, from: 2026 - Math.min(years, 6), to: 'Present' },
      { role: `Consultant – ${title}`, place: HOSPITALS[(i + 2) % HOSPITALS.length], from: 2026 - Math.min(years, 12), to: 2026 - Math.min(years, 6) },
      { role: 'Resident Doctor', place: quals[quals.length - 1].institute, from: 2026 - years - 3, to: 2026 - Math.min(years, 12) },
    ].filter((t) => t.from < (t.to === 'Present' ? 2027 : t.to));

    doctors.push({
      id, slug: slugify(name), name, gender,
      specialty: title, specialties, categoryIds: [cat.id, ...(cat2 ? [cat2.id] : [])],
      qualifications: quals, experienceYears: years, experience: timeline,
      bio: `${name} is a ${title.toLowerCase()} with over ${years} years of clinical experience in ${city.name}. ${gender === 'female' ? 'She' : 'He'} focuses on ${cat.problems.slice(0, 3).join(', ').toLowerCase()} and believes in clear communication, evidence-based care and treatment plans tailored to each patient's lifestyle. Patients appreciate ${gender === 'female' ? 'her' : 'his'} calm approach and the time taken to explain every option.`,
      services, languages, clinicIds, cityId: city.id, area: area.name, pincode: area.pincode,
      consultTypes,
      availability: { weekly, duration: [15, 20, 30][i % 3], buffer: [0, 5, 10][i % 3] },
      blocked: [], // [{ id, date: 'YYYY-MM-DD', start?: 'HH:MM', end?: 'HH:MM', reason }]
      verificationStatus: status, // pending | verified | rejected | suspended
      registrationNumber: `DEMO-REG-${String(10000 + i * 731).slice(-5)}`, // fictional – never shown publicly
      verificationDocs: ['degree_certificate.pdf', 'registration_certificate.pdf'], // private
      featured: !!featured,
      // Demo aggregate stats (sample data). Real reviews are added on top of these.
      baseRating: Math.round((4.3 + r() * 0.65) * 10) / 10,
      baseReviewCount: 40 + Math.floor(r() * 380),
      // Payment-ready pricing model: MVP books everything for free.
      pricing: { isFree: true, fee: 0, currency: city.stateId === 'NY' ? 'USD' : 'INR' },
      hue: Math.floor(r() * 360),
      isSample: true,
      createdAt: new Date(2025, i % 12, 1 + i).toISOString(),
    });
  });

  return { doctors, clinics };
}
