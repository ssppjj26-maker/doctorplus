/**
 * MediQ Connect Global Healthcare
 * Client-Side Static Application Engine
 * Pure Vanilla JavaScript (No database required, 100% offline-ready)
 */

// =========================================================================
// GLOBAL CURRENCY RATES (Base: INR)
// =========================================================================
const CURRENCY_RATES = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0095, label: 'GBP (£)' },
  AED: { symbol: 'AED ', rate: 0.044, label: 'AED' },
  SGD: { symbol: 'S$', rate: 0.016, label: 'SGD (S$)' }
};

let currentCurrency = 'USD'; // Default for global clients
let currentHubFilter = 'ALL';
let currentSpecFilter = 'ALL';

// Format price with active currency
function formatPrice(inrAmount) {
  if (inrAmount === null || inrAmount === undefined || inrAmount === '') return 'Complimentary';
  if (typeof inrAmount === 'string' && inrAmount.toLowerCase().includes('soon')) return inrAmount;
  const num = typeof inrAmount === 'string' ? parseFloat(inrAmount.replace(/[^\d.]/g, '')) : inrAmount;
  if (isNaN(num)) return inrAmount;
  
  const curr = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.USD;
  const converted = Math.round(num * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
}

// =========================================================================
// STATIC DOCTORS DATABASE (Stored in Memory / Zero External DB)
// =========================================================================
const DOCTORS = [
  // 1. Dr. Bahul Vekaria
  {
    id: 'dr-bahul-vekaria',
    name: 'Dr. Bahul Vekaria',
    degree: 'MS, MCh - Cardiothoracic',
    experience: '4 Years Exp',
    specialty: 'Cardiologist',
    category: 'cardio',
    hospital: 'Shree Giriraj Hospital',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    flag: '🇮🇳',
    photo: 'assets/doctors/dr-bahul-vekaria.webp',
    feeVisitINR: 1100,
    feeVideoINR: 1100,
    rating: 4.9,
    reviews: 142,
    bio: 'Specialist in complex cardiothoracic surgeries, coronary artery disease management, and minimally invasive cardiac procedures.'
  },
  // 2. Dr. Sarah Jenkins (Global - New York)
  {
    id: 'dr-sarah-jenkins',
    name: 'Dr. Sarah Jenkins',
    degree: 'MD, FACC - Harvard Medical',
    experience: '14 Years Exp',
    specialty: 'Cardiologist',
    category: 'cardio',
    hospital: 'Mount Sinai Heart Center',
    city: 'New York',
    country: 'USA',
    hub: 'USA',
    flag: '🇺🇸',
    photo: 'assets/doctors/dr-sarah-jenkins.webp',
    feeVisitINR: 8500,
    feeVideoINR: 6200,
    rating: 5.0,
    reviews: 298,
    bio: 'Board-certified American cardiologist specializing in preventative cardiology, hypertension, valvular heart disease and tele-cardiology.'
  },
  // 3. Dr. Kopal Patel
  {
    id: 'dr-kopal-patel',
    name: 'Dr. Kopal Patel',
    degree: 'MBBS, DGO - Gynecology',
    experience: '15 Years Exp',
    specialty: 'Gynecologist',
    category: 'gynec',
    hospital: 'Apex Gastro Clinic & Hospital',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    flag: '🇮🇳',
    photo: 'assets/doctors/dr-kopal-patel.webp',
    feeVisitINR: 800,
    feeVideoINR: 1000,
    rating: 4.8,
    reviews: 310,
    bio: 'Expert in high-risk obstetrics, laparoscopic gynecological surgeries, hormonal imbalances, and adolescent women health.'
  },
  // 4. Dr. Alexander Wright (Global - London)
  {
    id: 'dr-alexander-wright',
    name: 'Dr. Alexander Wright',
    degree: 'MBBS, FRCS - Oxford',
    experience: '18 Years Exp',
    specialty: 'Neurosurgeon',
    category: 'neuro',
    hospital: "King's College Hospital",
    city: 'London',
    country: 'United Kingdom',
    hub: 'UK',
    flag: '🇬🇧',
    photo: 'assets/doctors/dr-alexander-wright.webp',
    feeVisitINR: 12000,
    feeVideoINR: 7500,
    rating: 4.9,
    reviews: 215,
    bio: 'Senior Consultant Neurosurgeon in London focusing on cranial microsurgery, spine disorders, and second-opinion neurological evaluations.'
  },
  // 5. Dr. Krupen Tailor
  {
    id: 'dr-krupen-tailor',
    name: 'Dr. Krupen Tailor',
    degree: 'MS - Orthopedic',
    experience: '6 Years Exp',
    specialty: 'Orthopedic',
    category: 'ortho',
    hospital: 'Shree Giriraj Hospital',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    flag: '🇮🇳',
    photo: 'assets/doctors/dr-krupen-tailor.webp',
    feeVisitINR: 700,
    feeVideoINR: 700,
    rating: 4.7,
    reviews: 184,
    bio: 'Specialist in joint replacement, sports injury reconstruction, arthroscopy, and complex bone trauma management.'
  },
  // 6. Dr. Marcus Chen (Global - Singapore)
  {
    id: 'dr-marcus-chen',
    name: 'Dr. Marcus Chen',
    degree: 'MBBS, FRACP - Singapore',
    experience: '16 Years Exp',
    specialty: 'Gastroenterologist',
    category: 'gastro',
    hospital: 'Mount Elizabeth Hospital',
    city: 'Singapore',
    country: 'Singapore',
    hub: 'SINGAPORE',
    flag: '🇸🇬',
    photo: 'assets/doctors/dr-marcus-chen.webp',
    feeVisitINR: 9500,
    feeVideoINR: 6800,
    rating: 4.9,
    reviews: 340,
    bio: 'Fellow of the Royal Australasian College of Physicians, specializing in advanced therapeutic endoscopy and liver health.'
  },
  // 7. Dr. Shitanshu Shekhar
  {
    id: 'dr-shitanshu-shekhar',
    name: 'Dr. Shitanshu Shekhar',
    degree: 'MS, DrNB Surgical Oncology',
    experience: '12 Years Exp',
    specialty: 'Oncosurgeon',
    category: 'critical',
    hospital: 'Premier Cancer Institute',
    city: 'Ahmedabad',
    country: 'India',
    hub: 'INDIA',
    flag: '🇮🇳',
    photo: 'assets/doctors/dr-shitanshu-shekhar.webp',
    feeVisitINR: 1500,
    feeVideoINR: 1500,
    rating: 4.9,
    reviews: 220,
    bio: 'Renowned cancer surgeon with special interest in head and neck, gastrointestinal, and breast oncological resections.'
  },
  // 8. Dr. Elena Rostova (Global - Zurich)
  {
    id: 'dr-elena-rostova',
    name: 'Dr. Elena Rostova',
    degree: 'MD, FMH - Univ of Zurich',
    experience: '13 Years Exp',
    specialty: 'Reproductive Medicine & IVF',
    category: 'gynec',
    hospital: 'Hirslanden Medical Centre',
    city: 'Zurich',
    country: 'Switzerland',
    hub: 'SWITZERLAND',
    flag: '🇨🇭',
    photo: 'assets/doctors/dr-elena-rostova.webp',
    feeVisitINR: 11000,
    feeVideoINR: 7200,
    rating: 5.0,
    reviews: 195,
    bio: 'Swiss board-certified reproductive endocrinologist guiding international couples through fertility optimization and IVF protocols.'
  },
  // 9. Dr. Shraddha Jivani
  {
    id: 'dr-shraddha-jivani',
    name: 'Dr. Shraddha Jivani',
    degree: 'MB (DCH) - Pediatrics',
    experience: '5 Years Exp',
    specialty: 'Child Specialist',
    category: 'pediatric',
    hospital: 'Orange Children Hospital',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    flag: '🇮🇳',
    photo: 'assets/doctors/dr-shraddha-jivani.webp',
    feeVisitINR: 300,
    feeVideoINR: 300,
    rating: 4.8,
    reviews: 165,
    bio: 'Compassionate pediatric care specialist experienced in neonatal care, infant nutrition, developmental milestones and vaccinations.'
  },
  // 10. Dr. Tariq Al-Mansoor (Global - Dubai/Abu Dhabi)
  {
    id: 'dr-tariq-almansoor',
    name: 'Dr. Tariq Al-Mansoor',
    degree: 'MD, FAAP - Johns Hopkins Fellow',
    experience: '15 Years Exp',
    specialty: 'Pediatric Specialist',
    category: 'pediatric',
    hospital: 'Cleveland Clinic Abu Dhabi',
    city: 'Dubai & Abu Dhabi',
    country: 'UAE',
    hub: 'UAE',
    flag: '🇦🇪',
    photo: 'assets/doctors/dr-tariq-almansoor.webp',
    feeVisitINR: 8800,
    feeVideoINR: 5800,
    rating: 4.9,
    reviews: 260,
    bio: 'American Board of Pediatrics certified consultant, recognized leader in pediatric allergy, asthma, and remote child telehealth.'
  },
  // 11. Dr. Bhumi Patel
  {
    id: 'dr-bhumi-patel',
    name: 'Dr. Bhumi Patel',
    degree: 'MS, DNB (Ophthal)',
    experience: '6 Years Exp',
    specialty: 'EYE Specialist',
    category: 'eye',
    hospital: 'Aksha Eye Hospital',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    flag: '🇮🇳',
    photo: 'assets/doctors/dr-bhumi-patel.webp',
    feeVisitINR: 400,
    feeVideoINR: 400,
    rating: 4.9,
    reviews: 240,
    bio: 'Ophthalmologist specializing in cataract phacoemulsification, computer vision syndrome, glaucoma, and refractive vision correction.'
  },
  // 12. Dr. Swati Braroo
  {
    id: 'dr-swati-braroo',
    name: 'Dr. Swati Braroo',
    degree: 'DPM, DNB, FIPS - Psychiatry',
    experience: '15 Years Exp',
    specialty: 'Psychiatrist',
    category: 'mental',
    hospital: 'Asha Neuro Psychiatry Clinic',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    flag: '🇮🇳',
    photo: 'assets/doctors/dr-swati-braroo.webp',
    feeVisitINR: 800,
    feeVideoINR: 1000,
    rating: 4.9,
    reviews: 410,
    bio: 'Consultant psychiatrist addressing mental wellness, anxiety, mood disorders, adult ADHD, and stress management via private telehealth.'
  }
];

// =========================================================================
// STATIC HOSPITALS DATABASE
// =========================================================================
const HOSPITALS = [
  {
    id: 'kings-college-hospital',
    name: "King's College Hospital",
    city: 'London',
    country: 'United Kingdom',
    hub: 'UK',
    address: 'Denmark Hill, London SE5 9RS, United Kingdom',
    photo: 'assets/hospitals/kings-college-hospital.webp',
    specialties: ['Cardiology', 'Neurosurgery', 'Liver Centre', 'Critical Care'],
    phone: '+44 20 3299 9000',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kings+College+Hospital+London'
  },
  {
    id: 'mount-elizabeth',
    name: 'Mount Elizabeth Hospital',
    city: 'Singapore',
    country: 'Singapore',
    hub: 'SINGAPORE',
    address: '3 Mount Elizabeth, Orchard, Singapore 228510',
    photo: 'assets/hospitals/mount-elizabeth.webp',
    specialties: ['Gastroenterology', 'Oncology', 'Cardiovascular', 'Orthopedics'],
    phone: '+65 6737 2666',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mount+Elizabeth+Hospital+Singapore'
  },
  {
    id: 'cleveland-clinic-ad',
    name: 'Cleveland Clinic Abu Dhabi',
    city: 'Abu Dhabi & Dubai',
    country: 'UAE',
    hub: 'UAE',
    address: 'Al Maryah Island, Abu Dhabi, United Arab Emirates',
    photo: 'assets/hospitals/cleveland-clinic-ad.webp',
    specialties: ['Pediatrics', 'Heart & Vascular', 'Neurological', 'Eye Care'],
    phone: '+971 800 82223',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cleveland+Clinic+Abu+Dhabi'
  },
  {
    id: 'shree-giriraj-hospital',
    name: 'Shree Giriraj Hospital & ICU',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    address: '150 Feet Ring Road, Rajkot, Gujarat, India',
    photo: 'assets/hospitals/omega-hospital.webp',
    specialties: ['Cardiothoracic', 'Orthopedic', 'Critical Care', 'Emergency'],
    phone: '+91 81411 24181',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shree+Giriraj+Hospital+Rajkot'
  },
  {
    id: 'pragna-homeopathy-clinic',
    name: 'Pragna Clinic & Healthcare',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    address: 'Amin Marg, Beside Patel Boarding, Rajkot, Gujarat',
    photo: 'assets/hospitals/pragna-clinic.webp',
    specialties: ['Holistic Medicine', 'Chronic Care', 'Wellness', 'Physiotherapy'],
    phone: '+91 81411 24181',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pragna+Clinic+Rajkot'
  },
  {
    id: 'asha-neuro-psychiatry',
    name: 'Asha Neuro Psychiatry Clinic',
    city: 'Rajkot',
    country: 'India',
    hub: 'INDIA',
    address: 'Tagore Road, Near Galaxy Tower, Rajkot, Gujarat',
    photo: 'assets/hospitals/asha-clinic.webp',
    specialties: ['Psychiatry', 'Neuro-Counseling', 'Sleep Clinic', 'Addiction Care'],
    phone: '+91 81411 24181',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Asha+Neuro+Psychiatry+Clinic+Rajkot'
  }
];

// =========================================================================
// LOCALSTORAGE APPOINTMENT REPOSITORY
// =========================================================================
const STORAGE_KEYS = {
  APPOINTMENTS: 'mediq_global_appointments',
  USER_SESSION: 'mediq_global_user_session',
  CURRENCY: 'mediq_global_currency'
};

function getStoredAppointments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveAppointment(appt) {
  const list = getStoredAppointments();
  list.unshift(appt);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
  updateAppointmentsCount();
}

function cancelStoredAppointment(id) {
  let list = getStoredAppointments();
  list = list.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
  renderAppointmentsDrawer();
  updateAppointmentsCount();
}

function updateAppointmentsCount() {
  const count = getStoredAppointments().length;
  const badges = document.querySelectorAll('.appointments-count-badge');
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'inline-block' : 'none';
  });
}

// =========================================================================
// RENDER DOCTORS SHOWCASE
// =========================================================================
function renderDoctors(filterCategory = 'ALL', hub = 'ALL', searchQuery = '') {
  const grid = document.getElementById('doctorsGrid');
  if (!grid) return;

  let filtered = DOCTORS.filter(doc => {
    // Category filter
    const matchCat = filterCategory === 'ALL' || doc.category === filterCategory;
    // Hub filter
    const matchHub = hub === 'ALL' || doc.hub === hub || doc.country.toLowerCase().includes(hub.toLowerCase());
    // Search query
    const matchSearch = !searchQuery || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchHub && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #fff; border-radius: 20px; border: 1px dashed #cbd5e1;">
        <h3 style="font-family: var(--font-heading); color: #1e293b; margin-bottom: 8px;">No Doctors Found in this Selection</h3>
        <p style="color: #64748b; font-size: 14px;">Try changing the medical hub, specialty filter, or search keywords.</p>
        <button onclick="resetFilters()" style="margin-top: 14px; padding: 8px 18px; background: var(--primary); color: #fff; border: none; border-radius: 12px; cursor: pointer; font-weight: 600;">Show All Doctors</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(doc => `
    <div class="doctor-card" data-doc-id="${doc.id}">
      <div class="doctor-header">
        <div class="avatar-box">
          <img src="${doc.photo}" alt="${doc.name}" loading="lazy" onerror="this.src='assets/doctors/dr-bahul-vekaria.webp'">
          <div class="verified-check" title="Verified Board Certified Specialist">✓</div>
        </div>
        <div class="doc-info">
          <h3 class="doc-name" title="${doc.name}">${doc.name}</h3>
          <div class="doc-degree">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            <span>${doc.degree}</span>
          </div>
          <div class="doc-exp">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            <span>${doc.experience}</span>
          </div>
          <div class="doc-spec-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            <span>${doc.specialty}</span>
          </div>
        </div>
      </div>

      <div class="hospital-affiliation" title="${doc.hospital}, ${doc.city}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${doc.hospital}</span>
      </div>

      <div class="global-hub-tag">
        <span>${doc.flag}</span>
        <span>${doc.city}, ${doc.country}</span>
      </div>

      <div class="divider-line"></div>

      <div class="booking-buttons-row">
        <button class="btn-free-consult" onclick="openBookingModal('${doc.id}', 'free')">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>Free Consultation</span>
        </button>
      </div>
    </div>
  `).join('');
}

// Reset filters
function resetFilters() {
  currentHubFilter = 'ALL';
  currentSpecFilter = 'ALL';
  const hubSelect = document.getElementById('locationSelect');
  if (hubSelect) hubSelect.value = 'ALL';
  const searchInput = document.getElementById('autocomplete_search');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));
  const allTab = document.querySelector('.doc-tab[data-spec="ALL"]');
  if (allTab) allTab.classList.add('active');
  renderDoctors('ALL', 'ALL', '');
}

// =========================================================================
// RENDER HOSPITALS SHOWCASE
// =========================================================================
function renderHospitals(hub = 'ALL') {
  const grid = document.getElementById('hospitalsGrid');
  if (!grid) return;

  const filtered = HOSPITALS.filter(h => hub === 'ALL' || h.hub === hub);

  grid.innerHTML = filtered.map(h => `
    <div class="hospital-card">
      <div class="hospital-img-wrap">
        <img src="${h.photo}" alt="${h.name}" loading="lazy" onerror="this.src='assets/hospitals/omega-hospital.webp'">
        <div class="hospital-badge">Verified Center • ${h.city}</div>
      </div>
      <div class="hospital-body">
        <div class="hospital-title-row">
          <h3 class="hospital-name"><span class="first-letter">${h.name.charAt(0)}</span>${h.name.slice(1)}</h3>
          <a href="tel:${h.phone}" class="call-circle-btn" title="Call Hospital Concierge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </a>
        </div>
        <div class="hospital-address">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${h.address}</span>
        </div>
        <div class="hospital-tags">
          ${h.specialties.map(s => `<span class="tag-capsule">${s}</span>`).join('')}
        </div>
        <div class="hospital-footer-actions">
          <a href="${h.mapsUrl}" target="_blank" rel="noopener noreferrer" class="direction-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            <span>Get Directions</span>
          </a>
          <button class="view-doctors-btn" onclick="filterDoctorsByHospital('${h.name}')">View Doctors</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterDoctorsByHospital(hospitalName) {
  const searchInput = document.getElementById('autocomplete_search');
  if (searchInput) searchInput.value = hospitalName;
  renderDoctors('ALL', 'ALL', hospitalName);
  document.getElementById('verified-doctors-section')?.scrollIntoView({ behavior: 'smooth' });
}

// =========================================================================
// INTERACTIVE APPOINTMENT BOOKING MODAL
// =========================================================================
let currentBookingDoctor = null;
let currentConsultType = 'hospital'; // 'hospital' or 'video'
let selectedSlot = '10:30 AM';

function openBookingModal(doctorId, type = 'hospital') {
  const doc = DOCTORS.find(d => d.id === doctorId);
  if (!doc) return;

  currentBookingDoctor = doc;
  currentConsultType = type;

  // Set modal details
  document.getElementById('modalDocName').textContent = doc.name;
  document.getElementById('modalDocSpec').textContent = `${doc.specialty} • ${doc.hospital}`;
  document.getElementById('modalDocAvatar').src = doc.photo;
  
  // Set consult type radio
  updateConsultTypeDisplay(type);

  // Set default date to tomorrow
  const dateInput = document.getElementById('bookingDateInput');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Pre-fill user details if logged in
  const user = getStoredUserSession();
  if (user) {
    document.getElementById('patientNameInput').value = user.name || '';
    document.getElementById('patientPhoneInput').value = user.phone || '';
    document.getElementById('patientEmailInput').value = user.email || '';
  }

  // Open modal
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.add('active');
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('active');
}

function updateConsultTypeDisplay(type) {
  currentConsultType = (type === 'hospital') ? 'hospital' : 'video';
  const visitOpt = document.getElementById('optVisitType');
  const videoOpt = document.getElementById('optVideoType');
  const feeDisplay = document.getElementById('modalFeeAmount');

  if (visitOpt && videoOpt) {
    if (type === 'hospital') {
      visitOpt.classList.add('active');
      videoOpt.classList.remove('active');
    } else {
      videoOpt.classList.add('active');
      visitOpt.classList.remove('active');
    }
  }
  if (feeDisplay) {
    feeDisplay.textContent = '100% FREE';
  }
}

function selectTimeSlot(slotBtn) {
  document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('selected'));
  slotBtn.classList.add('selected');
  selectedSlot = slotBtn.textContent.trim();
}

// Handle Booking Form Submit
function handleBookingSubmit(e) {
  e.preventDefault();
  if (!currentBookingDoctor) return;

  const patientName = document.getElementById('patientNameInput').value.trim();
  const patientPhone = document.getElementById('patientPhoneInput').value.trim();
  const patientEmail = document.getElementById('patientEmailInput').value.trim();
  const bookingDate = document.getElementById('bookingDateInput').value;
  const reason = document.getElementById('patientReasonInput')?.value.trim() || 'General Medical Consultation';

  if (!patientName || !patientPhone) {
    alert('Please enter your Name and Mobile/WhatsApp number.');
    return;
  }

  const bookingId = 'MQ-' + Math.floor(100000 + Math.random() * 900000);

  const appointment = {
    id: bookingId,
    doctorId: currentBookingDoctor.id,
    doctorName: currentBookingDoctor.name,
    doctorSpecialty: currentBookingDoctor.specialty,
    doctorPhoto: currentBookingDoctor.photo,
    hospital: currentBookingDoctor.hospital,
    city: currentBookingDoctor.city,
    country: currentBookingDoctor.country,
    type: currentConsultType === 'hospital' ? 'In-Person Hospital Visit (Free)' : '4K Video Consult (Free)',
    date: bookingDate,
    time: selectedSlot,
    patientName: patientName,
    patientPhone: patientPhone,
    patientEmail: patientEmail,
    reason: reason,
    feeINR: 0,
    feeFormatted: '100% FREE',
    status: 'Confirmed',
    bookedAt: new Date().toLocaleString()
  };

  // Save to localStorage
  saveAppointment(appointment);
  closeBookingModal();

  // Show confirmation modal / toast
  showBookingSuccessModal(appointment);
}

function showBookingSuccessModal(appt) {
  const modal = document.getElementById('successModal');
  if (!modal) {
    alert(`Appointment Confirmed!\nBooking ID: ${appt.id}\nDoctor: ${appt.doctorName}\nDate: ${appt.date} at ${appt.time}`);
    return;
  }

  document.getElementById('successBookingId').textContent = appt.id;
  document.getElementById('successDocName').textContent = appt.doctorName;
  document.getElementById('successDateTime').textContent = `${appt.date} • ${appt.time}`;
  document.getElementById('successType').textContent = appt.type;
  document.getElementById('successFee').textContent = appt.feeFormatted;

  modal.classList.add('active');
}

function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('active');
}

// =========================================================================
// MY APPOINTMENTS DRAWER
// =========================================================================
function toggleAppointmentsDrawer(open = true) {
  const drawer = document.getElementById('appointmentsDrawer');
  if (!drawer) return;
  if (open) {
    renderAppointmentsDrawer();
    drawer.classList.add('active');
  } else {
    drawer.classList.remove('active');
  }
}

function renderAppointmentsDrawer() {
  const container = document.getElementById('appointmentsListContainer');
  if (!container) return;

  const appts = getStoredAppointments();
  if (appts.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #64748b;">
        <svg style="width: 54px; height: 54px; margin-bottom: 12px; color: #cbd5e1;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <h4 style="font-family: var(--font-heading); color: #1e293b; font-size: 17px; margin-bottom: 6px;">No Bookings Found</h4>
        <p style="font-size: 13.5px;">You have not booked any consultations yet. Your future bookings will be saved here offline without needing a database.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = appts.map(a => `
    <div class="appointment-ticket-card">
      <div class="ticket-header">
        <span style="font-size: 12px; font-weight: 700; color: #0284c7;">PASS #${a.id}</span>
        <span class="ticket-status-badge">● ${a.status}</span>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <img src="${a.doctorPhoto}" alt="" style="width: 44px; height: 44px; border-radius: 12px; object-fit: cover; border: 1.5px solid var(--primary);">
        <div>
          <div style="font-family: var(--font-heading); font-weight: 700; color: #181818; font-size: 15px;">${a.doctorName}</div>
          <div style="font-size: 12px; color: #64748b;">${a.doctorSpecialty} • ${a.hospital}</div>
        </div>
      </div>
      <div style="background: #ffffff; padding: 10px 12px; border-radius: 10px; font-size: 12.5px; display: flex; justify-content: space-between;">
        <div>
          <div style="color: #94a3b8; font-size: 11px;">DATE & TIME</div>
          <div style="font-weight: 600; color: #181818;">${a.date} at ${a.time}</div>
        </div>
        <div style="text-align: right;">
          <div style="color: #94a3b8; font-size: 11px;">CONSULTATION FEE</div>
          <div style="font-weight: 700; color: #16a34a;">${a.feeFormatted || '100% FREE'}</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px;">
        <span style="font-size: 11.5px; color: #64748b;">Type: <strong>${a.type}</strong></span>
        <button class="ticket-cancel-btn" onclick="cancelStoredAppointment('${a.id}')">Cancel Booking</button>
      </div>
    </div>
  `).join('');
}

// =========================================================================
// INTERACTIVE AUTH & OTP SIMULATION (No Database Required)
// =========================================================================
let generatedOtp = '2489';
let userPhoneNumber = '';

function openSignInModal() {
  const modal = document.getElementById('signInModal');
  if (modal) {
    document.getElementById('phoneStep').style.display = 'block';
    document.getElementById('otpStep').style.display = 'none';
    modal.classList.add('active');
  }
}

function closeSignInModal() {
  const modal = document.getElementById('signInModal');
  if (modal) modal.classList.remove('active');
}

function handleSendOtp(e) {
  e.preventDefault();
  const phone = document.getElementById('loginPhoneInput').value.trim();
  if (phone.length < 6) {
    alert('Please enter a valid mobile number.');
    return;
  }

  userPhoneNumber = phone;
  // Generate random 4 digit code
  generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

  document.getElementById('phoneStep').style.display = 'none';
  document.getElementById('otpStep').style.display = 'block';
  document.getElementById('otpSentToText').textContent = phone;

  // Clear inputs
  document.querySelectorAll('.otp-box-input').forEach(i => i.value = '');
  document.getElementById('otp1')?.focus();

  // Show friendly notification toast with OTP
  showToast(`WhatsApp OTP sent to ${phone}: ${generatedOtp}`);
}

function handleVerifyOtp(e) {
  e.preventDefault();
  const inputs = document.querySelectorAll('.otp-box-input');
  let entered = '';
  inputs.forEach(i => entered += i.value);

  if (entered === generatedOtp || entered === '1234') {
    // Store user session
    const session = {
      phone: userPhoneNumber,
      name: 'Global Patient',
      email: 'patient@global-client.com',
      token: 'client_session_' + Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
    closeSignInModal();
    updateUserAuthUI();
    showToast('Successfully signed in! Welcome to MediQ Connect Global.');
  } else {
    alert(`Invalid OTP code. Please enter the demo code: ${generatedOtp}`);
  }
}

function getStoredUserSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function updateUserAuthUI() {
  const session = getStoredUserSession();
  const btn = document.getElementById('navSignInBtn');
  if (!btn) return;

  if (session) {
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span>My Account</span>
    `;
    btn.onclick = () => {
      if (confirm('You are logged in. Do you want to sign out?')) {
        localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
        updateUserAuthUI();
        showToast('Signed out successfully.');
      }
    };
  } else {
    btn.innerHTML = `
      <img src="assets/icons/lock-icon.svg" width="18" height="18" alt="" onerror="this.style.display='none'">
      <span>Sign In</span>
    `;
    btn.onclick = openSignInModal;
  }
}

// Toast Notification
function showToast(msg) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#0f172a';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'var(--font-heading)';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.transition = 'all 0.3s ease';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.visibility = 'visible';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.visibility = 'hidden';
  }, 4500);
}

// =========================================================================
// LIVE SEARCH & AUTOCOMPLETE
// =========================================================================
function setupLiveSearch() {
  const searchInput = document.getElementById('autocomplete_search');
  const suggestionBox = document.getElementById('searchSuggestions');
  const hubSelect = document.getElementById('locationSelect');

  if (!searchInput || !suggestionBox) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length < 1) {
      suggestionBox.classList.remove('active');
      suggestionBox.innerHTML = '';
      return;
    }

    const matchedDocs = DOCTORS.filter(d => 
      d.name.toLowerCase().includes(val) || 
      d.specialty.toLowerCase().includes(val) || 
      d.hospital.toLowerCase().includes(val)
    ).slice(0, 5);

    const matchedHospitals = HOSPITALS.filter(h => 
      h.name.toLowerCase().includes(val) || 
      h.city.toLowerCase().includes(val)
    ).slice(0, 3);

    if (matchedDocs.length === 0 && matchedHospitals.length === 0) {
      suggestionBox.innerHTML = `
        <div style="padding: 16px; color: #64748b; font-size: 13.5px; text-align: center;">
          No matching doctors or hospitals found for "<strong>${val}</strong>"
        </div>
      `;
      suggestionBox.classList.add('active');
      return;
    }

    let html = '';
    if (matchedDocs.length > 0) {
      html += `<div class="suggestion-category-title">Verified Doctors</div>`;
      matchedDocs.forEach(d => {
        html += `
          <div class="suggestion-item" onclick="selectSearchDoctor('${d.id}')">
            <div class="item-info">
              <img src="${d.photo}" class="item-avatar" alt="">
              <div>
                <div class="item-name">${d.name}</div>
                <div class="item-meta">${d.specialty} • ${d.hospital}</div>
              </div>
            </div>
            <span class="badge-type">${d.city}</span>
          </div>
        `;
      });
    }

    if (matchedHospitals.length > 0) {
      html += `<div class="suggestion-category-title">Hospitals & Centers</div>`;
      matchedHospitals.forEach(h => {
        html += `
          <div class="suggestion-item" onclick="selectSearchHospital('${h.name}')">
            <div class="item-info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <div class="item-name">${h.name}</div>
                <div class="item-meta">${h.city}, ${h.country}</div>
              </div>
            </div>
            <span class="badge-type">Hospital</span>
          </div>
        `;
      });
    }

    suggestionBox.innerHTML = html;
    suggestionBox.classList.add('active');
  });

  // Hide suggestions on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
      suggestionBox.classList.remove('active');
    }
  });

  // Handle Location hub select
  if (hubSelect) {
    hubSelect.addEventListener('change', (e) => {
      currentHubFilter = e.target.value;
      renderDoctors(currentSpecFilter, currentHubFilter, searchInput.value.trim());
      renderHospitals(currentHubFilter);
    });
  }

  // Handle search form submit
  const searchForm = document.getElementById('doctorSearchForm2');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      suggestionBox.classList.remove('active');
      renderDoctors(currentSpecFilter, currentHubFilter, searchInput.value.trim());
      document.getElementById('verified-doctors-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function selectSearchDoctor(doctorId) {
  const doc = DOCTORS.find(d => d.id === doctorId);
  if (!doc) return;
  const input = document.getElementById('autocomplete_search');
  if (input) input.value = doc.name;
  document.getElementById('searchSuggestions')?.classList.remove('active');
  renderDoctors('ALL', 'ALL', doc.name);
  document.getElementById('verified-doctors-section')?.scrollIntoView({ behavior: 'smooth' });
}

function selectSearchHospital(hospitalName) {
  const input = document.getElementById('autocomplete_search');
  if (input) input.value = hospitalName;
  document.getElementById('searchSuggestions')?.classList.remove('active');
  filterDoctorsByHospital(hospitalName);
}

// =========================================================================
// CURRENCY SWITCHER HANDLER
// =========================================================================
function setCurrency(currCode) {
  if (!CURRENCY_RATES[currCode]) return;
  currentCurrency = currCode;
  localStorage.setItem(STORAGE_KEYS.CURRENCY, currCode);

  // Update top selector
  const topSelect = document.getElementById('globalCurrencySelect');
  if (topSelect) topSelect.value = currCode;

  // Update navbar currency badge
  const navBadge = document.getElementById('navCurrencyText');
  if (navBadge) navBadge.textContent = currCode;

  // Update all hero cards prices
  updateHeroCardPrices();

  // Re-render doctors to update fees
  renderDoctors(currentSpecFilter, currentHubFilter, document.getElementById('autocomplete_search')?.value.trim() || '');

  // Update active booking modal fee if open
  if (currentBookingDoctor) {
    updateConsultTypeDisplay(currentConsultType);
  }
}

function updateHeroCardPrices() {
  const p1 = document.getElementById('heroCard1Price');
  const p1Old = document.getElementById('heroCard1Old');
  if (p1) p1.textContent = '100% Free';
  if (p1Old) p1Old.textContent = '';

  const p2 = document.getElementById('heroCard2Price');
  const p2Old = document.getElementById('heroCard2Old');
  if (p2) p2.textContent = 'Free';
  if (p2Old) p2Old.textContent = '';
}

// =========================================================================
// FAQ ACCORDION LOGIC
// =========================================================================
function setupFaqAccordion() {
  document.querySelectorAll('.faq-question-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// =========================================================================
// MOBILE DRAWER & NAV
// =========================================================================
function toggleMobileMenu() {
  const navMenu = document.getElementById('mobileNavDrawer');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

// OTP digit auto-advance
function setupOtpInputs() {
  const inputs = document.querySelectorAll('.otp-box-input');
  inputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '');
      if (input.value && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });
  });
}

// =========================================================================
// INITIALIZATION
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Load saved currency preference
  const savedCurr = localStorage.getItem(STORAGE_KEYS.CURRENCY);
  if (savedCurr && CURRENCY_RATES[savedCurr]) {
    currentCurrency = savedCurr;
  }
  const topSelect = document.getElementById('globalCurrencySelect');
  if (topSelect) topSelect.value = currentCurrency;
  const navBadge = document.getElementById('navCurrencyText');
  if (navBadge) navBadge.textContent = currentCurrency;

  // Initialize UI & data renders
  updateHeroCardPrices();
  renderDoctors('ALL', 'ALL', '');
  renderHospitals('ALL');
  updateAppointmentsCount();
  updateUserAuthUI();
  setupLiveSearch();
  setupFaqAccordion();
  setupOtpInputs();

  // Specialty category pill clicks
  document.querySelectorAll('.doc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSpecFilter = tab.getAttribute('data-spec') || 'ALL';
      renderDoctors(currentSpecFilter, currentHubFilter, document.getElementById('autocomplete_search')?.value.trim() || '');
    });
  });

  // Hub quick filter pills
  document.querySelectorAll('.hub-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.hub-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentHubFilter = pill.getAttribute('data-hub') || 'ALL';
      const hubSelect = document.getElementById('locationSelect');
      if (hubSelect) hubSelect.value = currentHubFilter;
      renderDoctors(currentSpecFilter, currentHubFilter, '');
      renderHospitals(currentHubFilter);
    });
  });
});
