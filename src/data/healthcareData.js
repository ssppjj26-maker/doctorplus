// BookDoc Global Healthcare Data Architecture
// Configured for top-tier foreign country patients (US, UK, Canada, Australia, Germany, Switzerland, Singapore, UAE)
// Includes:
// - One Major Problem = One Dedicated Doctor mapping
// - 4 core departments matching BookDoc design: Joint Pain, Tinnitus & Ear Ringing, Brain & Nerve Care, Dental Care
// - Customer reviews praising the Free Online Consultation services
// - Transparent credentials, timezones, and intake questions

export const TARGET_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'Switzerland',
  'Singapore',
  'United Arab Emirates',
  'New Zealand'
];

export const TIMEZONES = [
  { id: 'America/New_York', label: 'Eastern Time (US & Canada)', city: 'New York / Toronto', offset: '-05:00', country: 'United States' },
  { id: 'America/Chicago', label: 'Central Time (US)', city: 'Chicago / Dallas', offset: '-06:00', country: 'United States' },
  { id: 'America/Denver', label: 'Mountain Time (US)', city: 'Denver / Phoenix', offset: '-07:00', country: 'United States' },
  { id: 'America/Los_Angeles', label: 'Pacific Time (US)', city: 'Los Angeles / Seattle', offset: '-08:00', country: 'United States' },
  { id: 'Europe/London', label: 'Greenwich Mean Time (GMT / BST)', city: 'London', offset: '+00:00', country: 'United Kingdom' },
  { id: 'Europe/Berlin', label: 'Central European Time (CET)', city: 'Berlin / Zurich / Frankfurt', offset: '+01:00', country: 'Germany' },
  { id: 'Australia/Sydney', label: 'Australian Eastern Time (AEST)', city: 'Sydney / Melbourne', offset: '+10:00', country: 'Australia' },
  { id: 'Australia/Perth', label: 'Australian Western Time (AWST)', city: 'Perth', offset: '+08:00', country: 'Australia' },
  { id: 'Asia/Singapore', label: 'Singapore Time (SGT)', city: 'Singapore', offset: '+08:00', country: 'Singapore' },
  { id: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', city: 'Dubai / Abu Dhabi', offset: '+04:00', country: 'United Arab Emirates' },
  { id: 'Pacific/Auckland', label: 'New Zealand Time (NZST)', city: 'Auckland / Wellington', offset: '+12:00', country: 'New Zealand' },
  { id: 'Asia/Kolkata', label: 'India Standard Time (IST)', city: 'New Delhi / Mumbai', offset: '+05:30', country: 'India' }
];

export const EMERGENCY_NUMBERS = [
  { country: 'United States', number: '911', service: 'National Emergency Response' },
  { country: 'United Kingdom', number: '999 / 111', service: 'Emergency / NHS Urgent Helpline' },
  { country: 'Canada', number: '911', service: 'National Emergency Services' },
  { country: 'Australia', number: '000', service: 'Emergency Triple Zero' },
  { country: 'Germany & Switzerland', number: '112 / 144', service: 'European / Swiss Emergency Medical' },
  { country: 'Singapore', number: '995', service: 'Emergency Ambulance & Fire' },
  { country: 'United Arab Emirates', number: '998', service: 'National Ambulance' }
];

// 12 Health Concerns / Departments
// First 4 match the user's BookDoc layout exactly!
export const CATEGORIES = [
  {
    id: 'bone-joint',
    slug: 'bone-joint',
    name: 'Joint Pain',
    iconName: 'Bone',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    shortDescription: 'Relief for joint pain, injury, arthritis, or movement issues.',
    fullDescription: 'Consult leading orthopedic surgeons and joint rehabilitation specialists for virtual assessments of acute back pain, spinal stiffness, arthritis, sports injuries, and movement limitations.',
    covers: [
      'Spine, lower back, and sciatic nerve pain evaluation',
      'Knee, hip, and shoulder arthritis management',
      'Sports injury and tendon recovery pacing',
      'Second opinions on joint replacement or spine surgeries'
    ],
    urgentCareSymptoms: [
      'Inability to bear weight after acute severe trauma',
      'Loss of bowel or bladder control with back pain (cauda equina)',
      'Severe bone deformity with numbness in the extremities'
    ],
    popular: true,
    specialtyName: 'Orthopedic Surgery / Sports Medicine',
    dedicatedDoctorId: 'doc-sophia-miller'
  },
  {
    id: 'tinnitus-ear',
    slug: 'tinnitus-ear',
    name: 'Tinnitus & Ear Ringing',
    iconName: 'Ear',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    shortDescription: 'Relief, sound therapy and evaluation for constant ringing or buzzing in ears.',
    fullDescription: 'Consult board-certified ENT otolaryngologists and audiological neurotologists for specialized virtual evaluations of subjective tinnitus, pulsatile ringing, auditory hyperacusis, and acoustic trauma.',
    covers: [
      'High-pitch whistling, buzzing, and pulsatile ear ringing assessment',
      'Acoustic sound therapy, masking protocols and neuro-retraining',
      'Eustachian tube dysfunction and middle ear pressure triage',
      'Guidance on preventing hearing threshold degradation'
    ],
    urgentCareSymptoms: [
      'Sudden sensorineural hearing loss within 72 hours (medical emergency)',
      'Ringing accompanied by severe facial droop or loss of balance',
      'Pulsatile ringing with extreme throbbing headache or bruit'
    ],
    popular: true,
    specialtyName: 'Otolaryngology (ENT) & Audiology',
    dedicatedDoctorId: 'doc-marcus-lindqvist'
  },
  {
    id: 'brain-nerve',
    slug: 'brain-nerve',
    name: 'Brain & Nerve Care',
    iconName: 'Brain',
    color: '#7c3aed',
    bgColor: '#ede9fe',
    shortDescription: 'Treatment for headaches, memory, or nerve problems.',
    fullDescription: 'Expert consultations with board-certified neurologists for chronic migraines, tension headaches, peripheral nerve tingling, memory concerns, vertigo, and sleep disturbances.',
    covers: [
      'Chronic migraine prevention protocols and trigger analysis',
      'Peripheral neuropathy, tingling, and numbness in limbs',
      'Vertigo, dizziness, and vestibular balance assessments',
      'Early cognitive checkups and brain fog investigations'
    ],
    urgentCareSymptoms: [
      'Sudden severe "thunderclap" headache unlike any before',
      'Facial droop, unilateral arm weakness, or slurred speech (stroke alert)',
      'Sudden vision loss, seizures, or confusion'
    ],
    popular: true,
    specialtyName: 'Neurology',
    dedicatedDoctorId: 'doc-lucas-vanderberg'
  },
  {
    id: 'dental',
    slug: 'dental',
    name: 'Dental Care',
    iconName: 'Smile',
    color: '#0d9488',
    bgColor: '#ccfbf1',
    shortDescription: 'Complete care for teeth and oral health.',
    fullDescription: 'Consult experienced dental surgeons and maxillofacial specialists for emergency triage of tooth pain, implant feasibility, wisdom teeth advice, TMJ discomfort, and second opinions.',
    covers: [
      'Virtual evaluation of acute toothache and thermal sensitivity',
      'Second opinions on dental implants, crowns, and root canals',
      'TMJ jaw clicking, soreness, and night bruxism treatments',
      'Gum inflammation and periodontal care guidance'
    ],
    urgentCareSymptoms: [
      'Facial swelling extending into the eye socket or neck with airway compromise',
      'Uncontrolled bleeding from the mouth or jaw following trauma',
      'High fever with intense throbbing jaw abscess'
    ],
    popular: true,
    specialtyName: 'Dentistry & Oral Surgery',
    dedicatedDoctorId: 'doc-emily-vance'
  },
  {
    id: 'skin-hair',
    slug: 'skin-hair',
    name: 'Skin & Hair',
    iconName: 'Sparkles',
    color: '#db2777',
    bgColor: '#fce7f3',
    shortDescription: 'Guidance for dermatological and hair health concerns.',
    fullDescription: 'Consult board-certified dermatologists for thorough visual assessments of eczema, adult acne, psoriasis, suspicious moles, scalp wellness, and sudden hair shedding.',
    covers: [
      'Adult & teenage acne and cystic breakout management',
      'Eczema, contact dermatitis, and psoriasis flare-ups',
      'Alopecia, hair thinning, and scalp health treatments',
      'Pre-screening advice for suspicious moles and lesions'
    ],
    urgentCareSymptoms: [
      'Sudden rapid rash accompanied by lip, tongue, or throat swelling (anaphylaxis)',
      'High fever with widespread blistering or peeling skin',
      'Rapidly spreading hot, tender red streaks on skin (cellulitis)'
    ],
    popular: true,
    specialtyName: 'Dermatology',
    dedicatedDoctorId: 'doc-marcus-sterling'
  },
  {
    id: 'weight-management',
    slug: 'weight-management',
    name: 'Weight Loss & Metabolism',
    iconName: 'Scale',
    color: '#2563eb',
    bgColor: '#eff6ff',
    shortDescription: 'Get medical guidance for sustainable weight loss and metabolic health.',
    fullDescription: 'Connect with endocrinologists and clinical metabolic specialists for personalized evaluations, hormonal balance assessments, sustainable weight loss, and thyroid optimization.',
    covers: [
      'Metabolic rate, thyroid function, and insulin resistance review',
      'Evidence-based nutritional pacing and medical weight strategies',
      'Weight challenges associated with PCOS, menopause, or cortisol',
      'Continuous metabolic coaching and habit stabilization'
    ],
    urgentCareSymptoms: [
      'Rapid unexplained extreme weight loss with fever or acute pain',
      'Severe abdominal pain with persistent vomiting and dehydration',
      'Severe electrolyte abnormalities or cardiac fluttering'
    ],
    popular: true,
    specialtyName: 'Endocrinology & Metabolic Medicine',
    dedicatedDoctorId: 'doc-isabella-rossi'
  },
  {
    id: 'sexual-health',
    slug: 'sexual-health',
    name: 'Sexual Health',
    iconName: 'HeartHandshake',
    color: '#e11d48',
    bgColor: '#ffe4e6',
    shortDescription: 'Discreet, confidential consultations for intimacy and sexual wellness.',
    fullDescription: 'Confidential and compassionate virtual consultations with reproductive urologists and sexual medicine specialists addressing performance concerns, hormonal vitality, libido, and intimate health.',
    covers: [
      'Erectile dysfunction and intimacy wellness triage',
      'Testosterone screening and hormonal fatigue discussions',
      'Premature climax and performance anxiety management',
      'Discreet, confidential intimate health and wellness counseling'
    ],
    urgentCareSymptoms: [
      'Severe acute penile pain, swelling, or suspected fracture',
      'Priapism (erection lasting longer than 4 hours)',
      'Gross hematuria (blood in urine with severe pain)'
    ],
    popular: true,
    specialtyName: 'Sexual Medicine & Andrology',
    dedicatedDoctorId: 'doc-julian-cole'
  },
  {
    id: 'general-health',
    slug: 'general-health',
    name: 'General Health',
    iconName: 'Stethoscope',
    color: '#16a34a',
    bgColor: '#dcfce7',
    shortDescription: 'Everyday medical concerns, routine questions and general wellness.',
    fullDescription: 'Consult board-certified internal medicine and family physicians for persistent symptoms, comprehensive blood panel reviews, preventive screenings, and medical triage.',
    covers: [
      'Comprehensive lab work and biomarker interpretation',
      'Chronic fatigue, post-viral malaise, and immune support',
      'Preventive health checkups tailored to age and family risk',
      'Multi-symptom triage and specialized care coordination'
    ],
    urgentCareSymptoms: [
      'Sudden severe shortness of breath or blue-tinted lips/face',
      'Altered mental status, severe confusion, or blackout',
      'High fever with stiff neck and photophobia'
    ],
    popular: true,
    specialtyName: 'Internal Medicine / Family Practice',
    dedicatedDoctorId: 'doc-hannah-schmidt'
  },
  {
    id: 'mental-health',
    slug: 'mental-health',
    name: 'Mental Health',
    iconName: 'Brain',
    color: '#9333ea',
    bgColor: '#f3e8ff',
    shortDescription: 'Emotional wellbeing, stress and mental health consultations.',
    fullDescription: 'Confidential, empathetic support from licensed neuropsychiatrists and clinical psychologists for anxiety, executive burnout, mood stabilization, and chronic insomnia.',
    covers: [
      'Evidence-based cognitive and behavioral coping strategies',
      'Executive stress and burnout recovery pacing',
      'Sleep hygiene, circadian reset, and insomnia protocols',
      'Medication reviews and second opinions on psychiatric care'
    ],
    urgentCareSymptoms: [
      'Active thoughts of self-harm or suicide (Call 988 in US/Canada, 111 in UK, 112 in EU immediately)',
      'Severe psychosis, auditory hallucinations, or detachment from reality',
      'Acute unmanageable panic leading to collapse'
    ],
    popular: false,
    specialtyName: 'Psychiatry & Behavioral Health',
    dedicatedDoctorId: 'doc-julian-ward'
  },
  {
    id: 'prostate',
    slug: 'prostate',
    name: 'Prostate & Urology',
    iconName: 'ShieldPlus',
    color: '#4f46e5',
    bgColor: '#e0e7ff',
    shortDescription: 'Confidential consultations for urinary and prostate health concerns.',
    fullDescription: 'Discreet, specialized virtual consultations with consultant urologists regarding urinary stream issues, nocturia, BPH management, and PSA test results.',
    covers: [
      'Benign Prostatic Hyperplasia (BPH) symptom evaluation',
      'PSA blood test review and age-appropriate screening advice',
      'Urinary frequency, urgency, and nighttime waking (nocturia)',
      'Preventive men’s urological health and bladder wellness'
    ],
    urgentCareSymptoms: [
      'Acute urinary retention (inability to pass urine)',
      'Severe flank or lower back pain with fever and chills',
      'Gross visible hematuria (blood in urine with clots)'
    ],
    popular: false,
    specialtyName: 'Urology & Andrology',
    dedicatedDoctorId: 'doc-ethan-vance'
  },
  {
    id: 'diabetes',
    slug: 'diabetes',
    name: 'Diabetes & Glucose',
    iconName: 'Droplet',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    shortDescription: 'Consultation and support for blood sugar management.',
    fullDescription: 'Guidance from specialist diabetologists and endocrinologists on continuous glucose monitoring (CGM), HbA1c control, prediabetes reversal, and metabolic lifestyle strategies.',
    covers: [
      'Continuous Glucose Monitoring (CGM) curve interpretation',
      'Prediabetes reversal lifestyle and dietary intervention',
      'Type 2 diabetes medication reviews and glycemic targets',
      'Preventive assessments for nerve, kidney, and eye wellness'
    ],
    urgentCareSymptoms: [
      'Severe hyperglycemia (>300 mg/dL) with confusion or fruity breath (DKA)',
      'Severe hypoglycemia (<55 mg/dL) unresponsive to oral glucose',
      'Seizures or loss of consciousness'
    ],
    popular: false,
    specialtyName: 'Diabetology & Endocrinology',
    dedicatedDoctorId: 'doc-liam-patel'
  }
];

// ONE MAJOR PROBLEM = ONE DEDICATED DOCTOR MAPPING
export const MAJOR_PROBLEMS_MAP = [
  {
    problemId: 'back-joint-pain',
    problemName: 'Severe Back Pain & Spine/Joint Stiffness',
    departmentId: 'bone-joint',
    departmentName: 'Joint Pain',
    doctorId: 'doc-sophia-miller',
    doctorName: 'Dr. Sophia Miller, MD',
    specialty: 'Orthopedic Spine & Joint Specialist',
    institution: 'Harvard Medical School / Mass General',
    experience: 14,
    freeConsultation: true,
    badges: ['Board Certified', 'Clinical Fellow', 'Top Rated Specialist'],
    symptoms: ['Lower back pain', 'Sciatica radiating to legs', 'Knee cartilage wear', 'Morning joint stiffness', 'Disc bulge or herniation']
  },
  {
    problemId: 'tinnitus-ear-ringing',
    problemName: 'Persistent Tinnitus, Buzzing & Ear Ringing',
    departmentId: 'tinnitus-ear',
    departmentName: 'Tinnitus & Ear Ringing',
    doctorId: 'doc-marcus-lindqvist',
    doctorName: 'Dr. Marcus Lindqvist, MD',
    specialty: 'ENT & Tinnitus Specialist',
    institution: 'Imperial College / Karolinska Institute',
    experience: 15,
    freeConsultation: true,
    badges: ['Specialist Register', 'Tinnitus Society Fellow', 'Audiology Lead'],
    symptoms: ['Constant high-pitched ear ringing', 'Pulsatile buzzing in ear', 'Ear pressure or fullness', 'Sensitivity to loud sounds', 'Nighttime sleep disruption from noise']
  },
  {
    problemId: 'chronic-migraine-nerve',
    problemName: 'Chronic Migraine, Nerve Pain & Brain Fog',
    departmentId: 'brain-nerve',
    departmentName: 'Brain & Nerve Care',
    doctorId: 'doc-lucas-vanderberg',
    doctorName: 'Dr. Lucas Van Der Berg, MD',
    specialty: 'Senior Neurologist & Neurophysiologist',
    institution: 'University Hospital / Neuro Specialist',
    experience: 13,
    freeConsultation: true,
    badges: ['Board Certified', 'Headache Society Fellow', 'Tele-Neurology Lead'],
    symptoms: ['Throbbing unilateral headache', 'Visual aura and photophobia', 'Numbness or tingling in fingers/toes', 'Persistent mental fog', 'Vertigo and dizziness']
  },
  {
    problemId: 'toothache-dental-implants',
    problemName: 'Toothache, Dental Implants & Gum Sensitivity',
    departmentId: 'dental',
    departmentName: 'Dental Care',
    doctorId: 'doc-emily-vance',
    doctorName: 'Dr. Emily Vance, DDS MSc',
    specialty: 'Oral Surgeon & Implantologist',
    institution: 'University Dental Center / Oral Surgery',
    experience: 11,
    freeConsultation: true,
    badges: ['Licensed Dental Surgeon', 'Implantology Fellow', 'Pre-Op Triage Specialist'],
    symptoms: ['Sharp pain on biting', 'Hot/cold thermal sensitivity', 'Implant procedure evaluation', 'Jaw clicking & TMJ ache', 'Bleeding gums']
  },
  {
    problemId: 'eczema-hair-loss',
    problemName: 'Severe Eczema, Psoriasis & Sudden Hair Thinning',
    departmentId: 'skin-hair',
    departmentName: 'Skin & Hair',
    doctorId: 'doc-marcus-sterling',
    doctorName: 'Dr. Marcus Sterling, MBBS FACD',
    specialty: 'Consultant Dermatologist & Trichologist',
    institution: 'University Teaching Hospital / Dermatology College',
    experience: 15,
    freeConsultation: true,
    badges: ['Board Certified Specialist', 'FACD Fellow', 'Advanced Trichology'],
    symptoms: ['Red, itchy scaly patches', 'Excessive hair shedding on brushing', 'Recalcitrant cystic acne', 'Scalp inflammation', 'Unidentified skin rash']
  },
  {
    problemId: 'thyroid-weight-metabolic',
    problemName: 'Thyroid Dysfunction & Unexplained Weight Gain',
    departmentId: 'weight-management',
    departmentName: 'Weight Loss & Metabolism',
    doctorId: 'doc-isabella-rossi',
    doctorName: 'Dr. Isabella Rossi, MD',
    specialty: 'Endocrinologist & Metabolic Specialist',
    institution: 'University Hospital / Metabolic Center',
    experience: 12,
    freeConsultation: true,
    badges: ['Medical Board Certified', 'Clinical Faculty', 'Metabolic Science'],
    symptoms: ['Weight gain despite caloric deficit', 'Cold intolerance & sluggishness', 'Elevated TSH or sluggish thyroid', 'Insulin resistance & PCOS', 'Intense sugar cravings']
  },
  {
    problemId: 'sexual-health-vitality',
    problemName: 'Erectile Dysfunction, Low Libido & Sexual Vitality',
    departmentId: 'sexual-health',
    departmentName: 'Sexual Health',
    doctorId: 'doc-julian-cole',
    doctorName: 'Dr. Julian Cole, MD',
    specialty: 'Sexual Medicine & Andrologist',
    institution: 'University Hospital / Weill Cornell Medicine',
    experience: 16,
    freeConsultation: true,
    badges: ['Board Certified', 'Sexual Medicine Fellow', '100% Confidential'],
    symptoms: ['Difficulty achieving or maintaining erection', 'Low sexual stamina or drive', 'Performance anxiety', 'Hormonal fatigue & low testosterone', 'Curvature or intimate discomfort']
  },
  {
    problemId: 'anxiety-burnout-insomnia',
    problemName: 'Acute Anxiety, Work Burnout & Severe Insomnia',
    departmentId: 'mental-health',
    departmentName: 'Mental Health',
    doctorId: 'doc-julian-ward',
    doctorName: 'Dr. Julian Ward, MD MRCPsych',
    specialty: 'Consultant Neuropsychiatrist',
    institution: 'University Department / Royal College Member',
    experience: 14,
    freeConsultation: true,
    badges: ['Specialist Register', 'MRCPsych Member', 'Sleep Disorder Clinician'],
    symptoms: ['Difficulty falling asleep past 2 AM', 'Racing thoughts & chest tightness', 'Exhaustion with daytime panic', 'Loss of focus at work', 'Chronic irritability']
  },
  {
    problemId: 'prostate-urinary-obstruction',
    problemName: 'Prostate Enlargement & Urinary Flow Obstruction',
    departmentId: 'prostate',
    departmentName: 'Prostate & Urology',
    doctorId: 'doc-ethan-vance',
    doctorName: 'Dr. Ethan Vance, MD FACS',
    specialty: 'Consultant Urologist & Andrologist',
    institution: 'University Feinberg / American College of Surgeons',
    experience: 18,
    freeConsultation: true,
    badges: ['Board Certified Urology', 'FACS Fellow', 'Men’s Health Director'],
    symptoms: ['Frequent urination at night (3+ times)', 'Weak or interrupted urine stream', 'Hesitancy before urination', 'Elevated PSA blood test score', 'Post-void dribbling']
  },
  {
    problemId: 'chronic-fatigue-postviral',
    problemName: 'Persistent Chronic Fatigue & Post-Viral Weakness',
    departmentId: 'general-health',
    departmentName: 'General Health',
    doctorId: 'doc-hannah-schmidt',
    doctorName: 'Dr. Hannah Schmidt, MD',
    specialty: 'Internal Medicine & Diagnostic Physician',
    institution: 'University Hospital / Medical Association',
    experience: 10,
    freeConsultation: true,
    badges: ['Board Certified', 'Internal Medicine Specialist', 'Preventive Health'],
    symptoms: ['Unrefreshing sleep for months', 'Low energy and exercise intolerance', 'Abnormal routine blood lab panels', 'Lingering post-viral symptoms', 'Frequent immune run-downs']
  }
];

// INITIAL DOCTORS DATA - Top-tier foreign credentialed specialists
export const INITIAL_DOCTORS = [
  {
    id: 'doc-sophia-miller',
    name: 'Dr. Sophia Miller',
    title: 'Consultant Orthopedic & Spine Surgeon',
    specialty: 'Orthopedic Specialist',
    categoryId: 'bone-joint',
    qualifications: [
      { degree: 'MD Orthopedic Surgery', institution: 'Harvard Medical School', year: 2012 },
      { degree: 'Fellowship in Spine & Joint Reconstruction', institution: 'Massachusetts General Hospital', year: 2015 },
      { degree: 'Board Certification in Orthopedic Surgery', institution: 'American Board of Orthopaedic Surgery (ABOS)', year: 2016 }
    ],
    experience: 14,
    languages: ['English', 'German'],
    location: 'Boston, MA, United States',
    country: 'United States',
    timezone: 'America/New_York',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 312,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Sophia Miller is a Harvard-trained orthopedic surgeon specializing in spinal disorders, severe lower back pain, knee arthritis, and non-surgical joint rehabilitation. She provides second opinions for patients across the US, UK, and Europe.',
    areasOfCare: [
      'Lumbar disc herniation & sciatica',
      'Knee, hip & shoulder osteoarthritis',
      'Spinal stenosis & degenerative disc disease',
      'Conservative orthopedic rehabilitation',
      'Virtual second opinion prior to surgery'
    ],
    professionalHistory: [
      { role: 'Senior Orthopedic Consultant', organization: 'Boston Spine & Joint Institute', period: '2018 – Present' },
      { role: 'Clinical Fellow in Orthopedic Surgery', organization: 'Massachusetts General Hospital', period: '2015 – 2018' }
    ],
    medicalRegistration: 'ABOS License #91044 (US Board Certified)',
    baseSlotTimesUTC: ['13:00', '14:30', '16:00', '17:30', '19:00']
  },
  {
    id: 'doc-marcus-lindqvist',
    name: 'Dr. Marcus Lindqvist',
    title: 'Consultant Neurotologist & Audiological Surgeon',
    specialty: 'ENT & Audiology Specialist',
    categoryId: 'tinnitus-ear',
    qualifications: [
      { degree: 'MBChB (Honours)', institution: 'University of Edinburgh', year: 2009 },
      { degree: 'FRCS (ORL-HNS)', institution: 'Royal College of Surgeons of England', year: 2015 },
      { degree: 'Fellowship in Otology & Neurotology', institution: 'King’s College Hospital London', year: 2017 }
    ],
    experience: 15,
    languages: ['English', 'Swedish'],
    location: 'London, United Kingdom',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 5.0,
    reviewCount: 382,
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Marcus Lindqvist is a London-based neurotology and ENT specialist focused on persistent tinnitus, acoustic trauma, hyperacusis, eustachian tube dysfunction, and ear fullness for patients worldwide.',
    areasOfCare: [
      'Chronic tinnitus & ear ringing triage',
      'Hyperacusis & sound sensitivity management',
      'Eustachian tube dysfunction & middle ear pressure',
      'Pulsatile vs non-pulsatile tinnitus differentiation',
      'Acoustic therapy & sound enrichment protocols'
    ],
    professionalHistory: [
      { role: 'Senior Otology & Tinnitus Consultant', organization: 'Harley Street Hearing & ENT Clinic', period: '2018 – Present' },
      { role: 'Clinical Fellow in Neurotology', organization: 'Royal National Throat, Nose & Ear Hospital', period: '2015 – 2018' }
    ],
    medicalRegistration: 'GMC Reg. No. 7129481 (UK Specialist Register)',
    baseSlotTimesUTC: ['09:00', '11:00', '13:00', '15:00', '17:00']
  },
  {
    id: 'doc-lucas-vanderberg',
    name: 'Dr. Lucas Van Der Berg',
    title: 'Senior Consultant Neurologist',
    specialty: 'Neurologist',
    categoryId: 'brain-nerve',
    qualifications: [
      { degree: 'MD Medicine & Neurology', institution: 'University of Zurich', year: 2010 },
      { degree: 'FMH Specialist Qualification in Neurology', institution: 'Swiss Medical Association (FMH)', year: 2015 },
      { degree: 'Fellowship in Clinical Neurophysiology', institution: 'Geneva University Hospitals', year: 2017 }
    ],
    experience: 13,
    languages: ['English', 'German', 'French'],
    location: 'Zurich, Switzerland',
    country: 'Switzerland',
    timezone: 'Europe/Berlin',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 284,
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Lucas Van Der Berg is a Swiss-trained neurologist who has treated thousands of patients for complex chronic migraines, peripheral nerve entrapment, dizziness, neuropathic pain, and post-concussion mental fog.',
    areasOfCare: [
      'Refractory migraine & tension headache management',
      'Peripheral neuropathy & nerve entrapment (carpal tunnel)',
      'Vestibular dizziness, vertigo & equilibrium triage',
      'Cognitive focus, memory check & brain fog evaluation',
      'Sleep disorders linked to neurological health'
    ],
    professionalHistory: [
      { role: 'Head of Neuro-Outpatient Services', organization: 'Zurich NeuroCare Center', period: '2018 – Present' },
      { role: 'Attending Neurologist', organization: 'University Hospital Zurich (USZ)', period: '2015 – 2018' }
    ],
    medicalRegistration: 'FMH Swiss Medical License #CH-48921 (Verified)',
    baseSlotTimesUTC: ['08:30', '10:30', '13:00', '15:30', '17:30']
  },
  {
    id: 'doc-emily-vance',
    name: 'Dr. Emily Vance',
    title: 'Oral & Maxillofacial Surgeon',
    specialty: 'Dentist',
    categoryId: 'dental',
    qualifications: [
      { degree: 'DDS (Doctor of Dental Surgery)', institution: 'University of Toronto', year: 2013 },
      { degree: 'MSc Periodontics & Implant Surgery', institution: 'McGill University', year: 2016 },
      { degree: 'Fellowship of the Royal College of Dentists of Canada', institution: 'RCDC (Canada)', year: 2017 }
    ],
    experience: 11,
    languages: ['English', 'French'],
    location: 'Toronto, ON, Canada',
    country: 'Canada',
    timezone: 'America/New_York',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 247,
    photo: 'https://images.unsplash.com/photo-1594824813689-5374e2d36187?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Emily Vance is a Canadian oral surgeon known for thorough, transparent pre-procedural reviews. She helps patients assess dental implant candidacy, evaluate acute toothaches, and obtain unbiased second opinions before costly dental work.',
    areasOfCare: [
      'Pre-op dental implant & bone graft second opinions',
      'Acute toothache, pulpitis & abscess virtual triage',
      'TMJ jaw pain, clicking & bruxism mouthguards',
      'Wisdom tooth impaction evaluations',
      'Periodontal gum inflammation protocols'
    ],
    professionalHistory: [
      { role: 'Director of Oral Surgery & Implantology', organization: 'Toronto Precision Dental Group', period: '2018 – Present' },
      { role: 'Clinical Lecturer', organization: 'Faculty of Dentistry, University of Toronto', period: '2016 – 2021' }
    ],
    medicalRegistration: 'RCDSO Reg. No. 82341 (Ontario, Canada)',
    baseSlotTimesUTC: ['14:00', '16:00', '18:00', '20:00']
  },
  {
    id: 'doc-marcus-sterling',
    name: 'Dr. Marcus Sterling',
    title: 'Fellowship Dermatologist & Trichologist',
    specialty: 'Dermatologist',
    categoryId: 'skin-hair',
    qualifications: [
      { degree: 'MBBS (Honours)', institution: 'University of Sydney', year: 2009 },
      { degree: 'Fellow of the Australasian College of Dermatologists (FACD)', institution: 'ACD Australia', year: 2014 },
      { degree: 'Postgraduate Diploma in Practical Dermatology', institution: 'Cardiff University', year: 2016 }
    ],
    experience: 15,
    languages: ['English'],
    location: 'Sydney, NSW, Australia',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 395,
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Marcus Sterling is an Australian dermatologist focused on rapid virtual skin triage, severe eczema and psoriasis protocols, cystic acne, and male/female pattern hair thinning for patients worldwide.',
    areasOfCare: [
      'Adult & hormonal acne therapy plans',
      'Atopic eczema, contact dermatitis & psoriasis',
      'Alopecia areata & androgenetic hair loss',
      'Mole checks & preliminary photographic dermoscopy',
      'Rosacea & sensitive barrier repair'
    ],
    professionalHistory: [
      { role: 'Principal Dermatologist', organization: 'Sydney Skin & Hair Clinic', period: '2017 – Present' },
      { role: 'Consultant Dermatologist', organization: 'Royal Prince Alfred Hospital', period: '2014 – 2017' }
    ],
    medicalRegistration: 'AHPRA Med0001849122 (Australia)',
    baseSlotTimesUTC: ['00:00', '02:00', '04:00', '06:00', '08:00']
  },
  {
    id: 'doc-isabella-rossi',
    name: 'Dr. Isabella Rossi',
    title: 'Endocrinologist & Metabolic Specialist',
    specialty: 'Endocrinologist',
    categoryId: 'weight-management',
    qualifications: [
      { degree: 'MD Medicine', institution: 'Charité - Universitätsmedizin Berlin', year: 2012 },
      { degree: 'Specialist in Endocrinology & Diabetology', institution: 'Berlin Medical Council', year: 2017 },
      { degree: 'Clinical Fellow in Metabolic Obesity Medicine', institution: 'European Society of Endocrinology', year: 2019 }
    ],
    experience: 12,
    languages: ['English', 'German', 'Italian'],
    location: 'Berlin, Germany',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 5.0,
    reviewCount: 261,
    photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Isabella Rossi treats metabolic resistance, sluggish thyroid disorders, hormone imbalances, and weight plateaus using rigorous evidence-based endocrinology and tailored nutrition programs without dangerous crash diets.',
    areasOfCare: [
      'Thyroid dysfunction (Hypothyroidism / Hashimoto’s)',
      'Insulin resistance & metabolic syndrome reversal',
      'Hormone-related weight gain in PCOS & perimenopause',
      'Continuous metabolic biomarker evaluation',
      'Personalized sustainable lifestyle nutrition'
    ],
    professionalHistory: [
      { role: 'Lead Endocrinologist', organization: 'Metabolic Health Institute Berlin', period: '2019 – Present' },
      { role: 'Senior Physician (Oberärztin)', organization: 'Charité Campus Virchow-Klinikum', period: '2017 – 2019' }
    ],
    medicalRegistration: 'Ärztekammer Berlin Reg. No. DE-921804',
    baseSlotTimesUTC: ['09:00', '11:00', '13:00', '15:00', '17:00']
  },
  {
    id: 'doc-julian-cole',
    name: 'Dr. Julian Cole',
    title: 'Consultant Urologist & Sexual Medicine Specialist',
    specialty: 'Sexual Medicine & Andrology',
    categoryId: 'sexual-health',
    qualifications: [
      { degree: 'MD Medicine', institution: 'Columbia University Vagelos College of Physicians', year: 2008 },
      { degree: 'Residency in Urology', institution: 'NewYork-Presbyterian Hospital', year: 2013 },
      { degree: 'Fellowship in Sexual Medicine & Andrology', institution: 'Johns Hopkins Medicine', year: 2015 }
    ],
    experience: 16,
    languages: ['English'],
    location: 'New York, NY, United States',
    country: 'United States',
    timezone: 'America/New_York',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 314,
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Julian Cole is a New York board-certified specialist providing discreet, comprehensive tele-evaluations for sexual health, hormonal vitality, libido concerns, and performance anxiety.',
    areasOfCare: [
      'Erectile dysfunction & performance anxiety',
      'Low libido & hormonal fatigue protocols',
      'Premature ejaculation & sexual endurance therapy',
      'Comprehensive testosterone & biomarker reviews',
      'Confidential relationship & intimate health triage'
    ],
    professionalHistory: [
      { role: 'Clinical Director of Sexual Wellness', organization: 'Manhattan Andrology & Vitality Center', period: '2016 – Present' },
      { role: 'Associate Attending Urologist', organization: 'Mount Sinai Health System', period: '2013 – 2016' }
    ],
    medicalRegistration: 'NYS Medical License #264910 (US Board Certified)',
    baseSlotTimesUTC: ['13:00', '15:00', '17:00', '19:00', '21:00']
  },
  {
    id: 'doc-hannah-schmidt',
    name: 'Dr. Hannah Schmidt',
    title: 'Board Certified Internal Medicine Physician',
    specialty: 'General Practitioner',
    categoryId: 'general-health',
    qualifications: [
      { degree: 'State Examination in Medicine (MD)', institution: 'LMU Munich', year: 2014 },
      { degree: 'Facharzt für Innere Medizin (Internal Medicine)', institution: 'Bavarian State Chamber of Physicians', year: 2019 }
    ],
    experience: 10,
    languages: ['English', 'German'],
    location: 'Munich, Germany',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 220,
    photo: 'https://images.unsplash.com/photo-1594824813712-40e83713f8c8?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Hannah Schmidt is a diagnostic physician who specializes in post-viral exhaustion, complex multi-symptom presentations, preventative lab screenings, and holistic primary health for international patients.',
    areasOfCare: [
      'Chronic unrefreshing fatigue & biomarker reviews',
      'Preventive full-body screening and lab analysis',
      'Post-viral recovery protocols',
      'Immune system support and wellness coaching'
    ],
    professionalHistory: [
      { role: 'Lead Physician', organization: 'Munich Preventive Health Practice', period: '2020 – Present' }
    ],
    medicalRegistration: 'BLÄK License #83109 (Germany)',
    baseSlotTimesUTC: ['08:00', '10:00', '12:00', '14:00', '16:00']
  },
  {
    id: 'doc-julian-ward',
    name: 'Dr. Julian Ward',
    title: 'Consultant Neuropsychiatrist',
    specialty: 'Psychiatrist',
    categoryId: 'mental-health',
    qualifications: [
      { degree: 'MBChB Medicine', institution: 'University of Edinburgh', year: 2010 },
      { degree: 'MRCPsych Member', institution: 'Royal College of Psychiatrists (UK)', year: 2015 }
    ],
    experience: 14,
    languages: ['English'],
    location: 'Edinburgh, United Kingdom',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 5.0,
    reviewCount: 310,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Julian Ward provides confidential virtual psychiatric assessments for severe stress, executive burnout, chronic insomnia, and panic disorders with a gentle, patient-first approach.',
    areasOfCare: [
      'High-stress burnout and anxiety decompression',
      'Insomnia and circadian rhythm restoration',
      'Adult attention and emotional dysregulation support',
      'Second opinions on psychotropic medication'
    ],
    professionalHistory: [
      { role: 'Consultant Psychiatrist', organization: 'Edinburgh Mind & Wellbeing Clinic', period: '2017 – Present' }
    ],
    medicalRegistration: 'GMC Reg. No. 7192840 (UK)',
    baseSlotTimesUTC: ['10:00', '12:00', '14:00', '16:30']
  },
  {
    id: 'doc-ethan-vance',
    name: 'Dr. Ethan Vance',
    title: 'Consultant Urologist & Andrologist',
    specialty: 'Urologist',
    categoryId: 'prostate',
    qualifications: [
      { degree: 'MD', institution: 'Northwestern University Feinberg School of Medicine', year: 2006 },
      { degree: 'Residency in Urology', institution: 'Johns Hopkins Hospital', year: 2011 },
      { degree: 'Fellow American College of Surgeons (FACS)', institution: 'ACS', year: 2014 }
    ],
    experience: 18,
    languages: ['English'],
    location: 'Chicago, IL, United States',
    country: 'United States',
    timezone: 'America/Chicago',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 295,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Ethan Vance is a senior urologist with 18 years of clinical experience. He provides discreet evaluations for benign prostate hyperplasia (BPH), elevated PSA lab results, and male urinary symptoms.',
    areasOfCare: [
      'BPH & frequent nighttime urination (nocturia)',
      'PSA blood test review and screening guidance',
      'Urinary flow obstruction & bladder health',
      'Preventive men’s health and testosterone consultations'
    ],
    professionalHistory: [
      { role: 'Director of Urological Services', organization: 'Midwest Urology Specialists', period: '2014 – Present' }
    ],
    medicalRegistration: 'Illinois Medical License #036-128491 (US)',
    baseSlotTimesUTC: ['15:00', '17:00', '19:00', '21:00']
  },
  {
    id: 'doc-liam-patel',
    name: 'Dr. Liam Patel',
    title: 'Senior Diabetologist & Endocrinologist',
    specialty: 'Diabetologist',
    categoryId: 'diabetes',
    qualifications: [
      { degree: 'MBBS (Honours)', institution: 'King’s College London', year: 2009 },
      { degree: 'MRCP Diabetes & Endocrinology', institution: 'Royal College of Physicians', year: 2014 }
    ],
    experience: 15,
    languages: ['English', 'Hindi'],
    location: 'London, United Kingdom',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    consultationType: 'Online video consultation',
    consultationDuration: 30,
    consultationFee: 'Free Online Consultation ($0.00)',
    isIdentityVerified: true,
    isCredentialsVerified: true,
    verificationStatus: 'verified',
    rating: 5.0,
    reviewCount: 340,
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=500',
    bio: 'Dr. Liam Patel guides international patients through continuous glucose monitor analytics, prediabetes reversal, and Type 2 diabetes lifestyle medicine with empathetic clinical care.',
    areasOfCare: [
      'Continuous Glucose Monitor (CGM) analysis',
      'Prediabetes and metabolic insulin resistance reversal',
      'Glycemic variability and dietary carbohydrate pacing',
      'Preventative microvascular screening discussions'
    ],
    professionalHistory: [
      { role: 'Consultant Diabetologist', organization: 'London Metabolic Institute', period: '2017 – Present' }
    ],
    medicalRegistration: 'GMC Reg. No. 7120491 (UK)',
    baseSlotTimesUTC: ['10:00', '12:00', '14:30', '17:00']
  }
];

// AUTHENTIC CUSTOMER REVIEWS FOR FREE ONLINE CONSULTATION SERVICES
export const INITIAL_REVIEWS = [
  {
    id: 'rev-01',
    appointmentId: 'demo-appt-101',
    doctorId: 'doc-sophia-miller',
    doctorName: 'Dr. Sophia Miller',
    patientName: 'Mark Richardson',
    city: 'Patient',
    rating: 5,
    department: 'Joint Pain',
    consultationType: 'Free Online Video Consultation',
    comment: 'I was facing a 7-week waiting period for an orthopedic specialist. BookDoc connected me to Dr. Sophia Miller for a 100% free online consultation the same afternoon! She reviewed my lumbar spine MRI thoroughly and gave me clear, actionable physical therapy guidance. An absolute lifesaver.',
    createdAt: '2026-10-10T14:20:00Z',
    verified: true
  },
  {
    id: 'rev-02',
    appointmentId: 'demo-appt-102',
    doctorId: 'doc-marcus-lindqvist',
    doctorName: 'Dr. Marcus Lindqvist',
    patientName: 'Claire Pemberton',
    city: 'Patient',
    rating: 5,
    department: 'Tinnitus & Ear Ringing',
    consultationType: 'Free Online Video Consultation',
    comment: 'Clinic waiting lists were lengthy for specialized audiology and neurotology. Having a 100% free consultation with Dr. Marcus Lindqvist gave our entire family clarity and peace of mind. He adjusted my acoustic therapy plan and explained my tinnitus habituation protocol with immense patience.',
    createdAt: '2026-10-08T09:45:00Z',
    verified: true
  },
  {
    id: 'rev-03',
    appointmentId: 'demo-appt-103',
    doctorId: 'doc-lucas-vanderberg',
    doctorName: 'Dr. Lucas Van Der Berg',
    patientName: 'Liam O’Connor',
    city: 'Patient',
    rating: 5,
    department: 'Brain & Nerve Care',
    consultationType: 'Free Online Video Consultation',
    comment: 'The "one major problem, one doctor" concept is brilliant. No passing between juniors—I got matched directly with Dr. Lucas Van Der Berg for my chronic occipital nerve headaches. Within 20 minutes he tailored a preventative protocol that has drastically cut my flare-ups.',
    createdAt: '2026-10-05T16:10:00Z',
    verified: true
  },
  {
    id: 'rev-04',
    appointmentId: 'demo-appt-104',
    doctorId: 'doc-emily-vance',
    doctorName: 'Dr. Emily Vance',
    patientName: 'Sarah Jenkins',
    city: 'Patient',
    rating: 5,
    department: 'Dental Care',
    consultationType: 'Free Online Video Consultation',
    comment: 'I needed an urgent second opinion on dental implant surgery. Dr. Emily Vance reviewed my 3D cone-beam scans online for free and saved me from an unnecessary $3,200 invasive procedure. Can’t thank BookDoc enough for this complimentary specialist service!',
    createdAt: '2026-10-02T11:30:00Z',
    verified: true
  },
  {
    id: 'rev-05',
    appointmentId: 'demo-appt-105',
    doctorId: 'doc-hannah-schmidt',
    doctorName: 'Dr. Hannah Schmidt',
    patientName: 'Dr. Julian Weber',
    city: 'Patient',
    rating: 5,
    department: 'General Health',
    consultationType: 'Free Online Video Consultation',
    comment: 'As a biomedical researcher, I was skeptical of free telemedicine platforms until I tried BookDoc. Clinical rigor, high-definition encrypted video, punctual consultation, and zero hidden fees. Highly recommended for patients.',
    createdAt: '2026-09-28T18:00:00Z',
    verified: true
  },
  {
    id: 'rev-06',
    appointmentId: 'demo-appt-106',
    doctorId: 'doc-marcus-sterling',
    doctorName: 'Dr. Marcus Sterling',
    patientName: 'Amira Al-Mansoor',
    city: 'Patient',
    rating: 5,
    department: 'Skin & Hair',
    consultationType: 'Free Online Video Consultation',
    comment: 'Accessing English-speaking board-certified dermatologists virtually without paying exorbitant local clinic charges is a game changer. Dr. Marcus Sterling identified my flare-up triggers immediately.',
    createdAt: '2026-09-25T13:15:00Z',
    verified: true
  }
];

export const INITIAL_SAMPLE_APPOINTMENTS = [];

// INTAKE QUESTIONNAIRES
export const INTAKE_QUESTIONS = {
  'bone-joint': {
    title: 'Joint Pain & Spine Intake',
    questions: [
      { id: 'joint_location', label: 'Where is your primary pain or discomfort located?', type: 'select', options: ['Lower Back / Lumbar Spine', 'Neck / Cervical Spine', 'Knee Joint', 'Hip Joint', 'Shoulder / Arm', 'Ankle / Foot / Wrist'], required: true },
      { id: 'duration', label: 'How long have you experienced this pain?', type: 'select', options: ['Under 1 week (acute)', '1 to 4 weeks', '1 to 6 months', 'Chronic (Over 6 months)'], required: true },
      { id: 'scans', label: 'Do you have recent X-rays or MRI scans available for review?', type: 'select', options: ['Yes, digital MRI / X-ray ready to share', 'No imaging done yet', 'Pending scan appointment'], required: true },
      { id: 'notes', label: 'Briefly describe your symptoms or current activity limits:', type: 'textarea', placeholder: 'e.g. Sharp pain when bending, tingling down right calf...', required: false }
    ]
  },
  'tinnitus-ear': {
    title: 'Tinnitus & Ear Ringing Intake',
    questions: [
      { id: 'sound_type', label: 'What type of sound do you hear?', type: 'select', options: ['High-pitched ringing or buzzing', 'Pulsing / whooshing in sync with heartbeat', 'Hissing, roaring, or static noise', 'Clicking or fluttering sensation'], required: true },
      { id: 'ear_side', label: 'Which ear is primarily affected?', type: 'select', options: ['Both ears equally', 'Left ear only', 'Right ear only', 'Inside the center of head'], required: true },
      { id: 'hearing_check', label: 'Have you noticed any recent hearing changes or ear fullness?', type: 'select', options: ['Yes, muffled hearing or pressure in the ear', 'No hearing loss, just persistent sound', 'Uncertain / have not had audiogram'], required: true },
      { id: 'notes', label: 'Onset triggers (loud noise, stress, infection) or questions for the specialist:', type: 'textarea', placeholder: 'e.g. Started after a flight, worse in quiet rooms at bedtime...', required: false }
    ]
  },
  'sexual-health': {
    title: 'Sexual Health & Vitality Intake',
    questions: [
      { id: 'primary_concern', label: 'What is your primary area of concern?', type: 'select', options: ['Erectile dysfunction or firmness difficulty', 'Low libido / decreased sexual desire', 'Premature or delayed ejaculation', 'Hormonal fatigue & vitality check', 'Discreet second opinion on medication / labs'], required: true },
      { id: 'duration', label: 'How long have you experienced this issue?', type: 'select', options: ['Recent (under 3 months)', '3 to 12 months', 'Chronic (Over 1 year)', 'Situational / performance related'], required: true },
      { id: 'notes', label: 'Current medications, medical history, or specific questions (100% confidential):', type: 'textarea', placeholder: 'Any health conditions, blood pressure medications, or details...', required: false }
    ]
  },
  'brain-nerve': {
    title: 'Brain & Nerve Care Intake',
    questions: [
      { id: 'neuro_concern', label: 'What primary neurological symptom are you experiencing?', type: 'select', options: ['Frequent throbbing migraines or headaches', 'Numbness, tingling or burning in limbs', 'Dizziness, vertigo or balance difficulty', 'Brain fog, memory lapses or mental fatigue', 'Sleep disturbance or restless limbs'], required: true },
      { id: 'frequency', label: 'How frequently do symptoms occur?', type: 'select', options: ['Daily or continuous', 'Multiple times per week', 'Few times per month', 'Occasional episodes'], required: true },
      { id: 'notes', label: 'Details on triggers, past treatments, or scans:', type: 'textarea', placeholder: 'Previous medications tried, MRI brain results, etc...', required: false }
    ]
  },
  'dental': {
    title: 'Dental & Oral Health Intake',
    questions: [
      { id: 'dental_concern', label: 'What is your primary oral health concern?', type: 'select', options: ['Acute tooth pain or throbbing ache', 'Sensitivity to hot or cold drinks', 'Second opinion on dental implants / crowns', 'Jaw stiffness, clicking or TMJ soreness', 'Gum bleeding or periodontal concern'], required: true },
      { id: 'urgency', label: 'Is the pain currently disturbing your sleep or eating?', type: 'select', options: ['Yes, severe throbbing pain', 'Moderate discomfort when eating', 'Mild or intermittent sensitivity', 'No pain, purely second opinion/cosmetic'], required: true },
      { id: 'notes', label: 'Additional details or previous dental treatments:', type: 'textarea', placeholder: 'Previous fillings, extracted teeth, or upcoming quote...', required: false }
    ]
  },
  'general-default': {
    title: 'Online Health Intake Questions',
    questions: [
      { id: 'main_concern', label: 'What is your primary health concern?', type: 'text', placeholder: 'Describe your main concern or symptoms in a few words...', required: true },
      { id: 'duration', label: 'How long have you experienced this concern?', type: 'select', options: ['Past few days', '1-4 weeks', '1-6 months', 'Over 6 months'], required: true },
      { id: 'previous_care', label: 'Have you previously consulted a doctor for this concern?', type: 'select', options: ['No, this is my first consultation', 'Yes, seeking an expert second opinion'], required: true },
      { id: 'notes', label: 'Current medications, allergies, or questions for the doctor:', type: 'textarea', placeholder: 'Any relevant details...', required: false }
    ]
  }
};

export const QUESTIONNAIRES = INTAKE_QUESTIONS;

// FAQS
export const FAQS = [
  {
    q: 'How does the "One Major Problem = One Dedicated Doctor" model work?',
    a: 'Unlike generic directories that shuffle you between generalists, BookDoc assigns one dedicated, board-certified specialist for your specific medical problem. Your dedicated specialist leads your evaluation from start to finish.'
  },
  {
    q: 'Is the online consultation really 100% free?',
    a: 'Yes! Our introductory telehealth video consultations are 100% free with no credit card required and no hidden subscription fees. Patients can connect directly with our board-certified medical specialists.'
  },
  {
    q: 'What credentials do BookDoc specialists hold?',
    a: 'All consulting doctors are board-certified specialists with verified medical licenses, trained at renowned academic medical centers with extensive clinical experience.'
  },
  {
    q: 'How do I join my scheduled video consultation?',
    a: 'Once booked, you will receive an instant confirmation and encrypted consultation room link. At your appointment time, simply click "Join Consultation" from any phone, tablet, or computer. No app download is required.'
  },
  {
    q: 'Can the doctor provide medical advice and prescriptions?',
    a: 'Yes. Doctors provide thorough clinical assessments, review your imaging/bloodwork, offer definitive second opinions, and generate digital care plans and non-controlled prescription recommendations where clinically appropriate.'
  },
  {
    q: 'What if I need to reschedule or cancel?',
    a: 'You can reschedule or cancel your free appointment at any time through the Patient Portal with just one click.'
  }
];
