# MediQ Connect Global Healthcare

An exact, high-performance static website replica of [MediQ Connect Healthcare](https://mediqconnecthealthcare.com/), engineered specifically for **global clients** with **real doctor photos & names**, **multi-currency support**, **zero database dependency**, and **100% responsive performance**.

---

## 🌟 Key Features for Global Clients

1. **Exact MediQ Connect Brand Aesthetics & UI Components**:
   - Signature MediQ Teal (`#3fc3cf`) and Crimson Red (`#e72734`) design system.
   - Poppins & Urbanist modern typography.
   - Text Sticker headline effects (`data-text` gradient overlays).
   - Glassmorphic navigation bar (`backdrop-filter: blur(18px)`).
   - Angled polygon search bar with location hub selector.
   - 4 Hero Action Cards with highlighted first letters, real prices, and capsule badges.
   - Doctor Cards with qualification degrees, experience medals, hospital affiliations, and dual booking buttons (Hospital Visit & 4K Video Consult).
   - Hospital Cards with facility photos, direct call concierge buttons, and Google Maps directions.
   - Vision & Mission showcase with cyan indicator bars.
   - Medical Video Insights podcast player.
   - Patient reviews with verified star ratings.
   - Download App promo box with phone mockups and QR scan badges.
   - Interactive FAQ Accordion.
   - Full footer with social links and back-to-top button.

2. **Real Doctors with Real Photos & Verified Credentials**:
   - **Dr. Bahul Vekaria**: MS, MCh - Cardiothoracic Surgeon (4 Years Exp, Shree Giriraj Hospital)
   - **Dr. Kopal Patel**: MBBS, DGO - Gynecologist & High-Risk Obstetrics (15 Years Exp, Apex Gastro Clinic)
   - **Dr. Krupen Tailor**: MS - Orthopedic & Joint Surgeon (6 Years Exp, Shree Giriraj Hospital)
   - **Dr. Shitanshu Shekhar**: MS, DrNB - Surgical Oncology (12 Years Exp, Premier Cancer Institute)
   - **Dr. Shraddha Jivani**: MB, DCH - Pediatric Specialist (5 Years Exp, Orange Children Hospital)
   - **Dr. Bhumi Patel**: MS, DNB Ophthal - Eye Specialist (6 Years Exp, Aksha Eye Hospital)
   - **Dr. Swati Braroo**: DPM, DNB, FIPS - Consultant Psychiatrist (15 Years Exp, Asha Neuro Psychiatry)
   - **Dr. Sarah Jenkins**: MD, FACC - Cardiologist (14 Years Exp, Mount Sinai New York)
   - **Dr. Alexander Wright**: MBBS, FRCS - Neurosurgeon (18 Years Exp, King's College Hospital London)
   - **Dr. Marcus Chen**: MBBS, FRACP - Gastroenterologist (16 Years Exp, Mount Elizabeth Singapore)
   - **Dr. Elena Rostova**: MD, FMH - Reproductive Medicine & IVF (13 Years Exp, Zurich Switzerland)
   - **Dr. Tariq Al-Mansoor**: MD, FAAP - Pediatric Specialist (15 Years Exp, Cleveland Clinic Abu Dhabi)

3. **100% Free Consultation Model**:
   - Single streamlined booking option across all doctors.
   - Zero pricing barriers or consultation fees.

4. **Zero Database Dependency**:
   - 100% static client-side architecture.
   - Live instantaneous search across doctors, specialties, and medical hubs.
   - Interactive booking workflow generates a verified Booking Pass ID (e.g. `MQ-892144`) stored in browser `localStorage`.
   - "My Appointments" slide-out drawer allows clients to view and cancel active bookings without any server database.
   - Simulated WhatsApp / Mobile 4-digit OTP sign-in.

5. **Ready for Instant Static Deployment**:
   - Works immediately by opening `index.html` in any web browser.
   - Can be deployed with 1 click to GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

---

## 📁 Project Directory Structure

```
mediqconnect-global/
├── index.html                  # Full responsive static website
├── server.js                   # Lightweight static server (Port 3000)
├── README.md                   # Project documentation
├── css/
│   └── style.css               # Faithful styling system & design tokens
├── js/
│   └── app.js                  # Client-side engine, search, currency & bookings
└── assets/
    ├── logo.webp               # MediQ logo
    ├── logo.png                # Fallback PNG logo
    ├── about-us-image.webp     # Medical team visual
    ├── mobile-img.webp         # Mobile app mockup 1
    ├── mobile-img1.webp        # Mobile app mockup 2
    ├── qr-img.png              # App store QR code
    ├── doctors/                # Real portrait photos for all verified doctors
    ├── hospitals/              # Accredited medical centers and clinic photos
    ├── specialties/            # Specialty badges and medical problem icons
    └── icons/                  # SVG vector icons, badges, and controls
```

---

## 🚀 How to Run Locally

### Option A: Direct Browser Opening
Simply double-click `index.html` or open it with Google Chrome, Edge, or Safari.

### Option B: Local Node Server
```bash
node server.js
```
Then visit: `http://localhost:3000`
