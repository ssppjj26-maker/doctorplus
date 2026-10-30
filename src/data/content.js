// SAMPLE editorial content for development. General information only – not medical advice.

export const BLOG_CATEGORIES = ['Weight Loss', 'Diabetes', 'Dental', 'Skin', 'Hair', 'Prostate', 'Heart', "Women's Health", "Men's Health", 'General Health'];

export const SEED_POSTS = [
  {
    slug: 'how-to-choose-the-right-specialist',
    title: 'How to Choose the Right Specialist for Your Health Concern',
    category: 'General Health', categorySlugs: ['general-physician'], icon: 'Stethoscope',
    excerpt: 'Not sure whether you need a general physician or a specialist? Here is a simple framework to help you decide where to start.',
    author: 'CareFind Editorial Team', date: '2026-09-28', readMins: 5,
    body: [
      ['p', 'Finding the right doctor starts with understanding what kind of care you need. For many everyday concerns, a general physician is a great first stop — they can assess your symptoms and refer you to a specialist if needed.'],
      ['h2', 'When to start with a general physician'],
      ['p', 'If your symptoms are new, broad (like fatigue or fever) or you are unsure what is causing them, a general physician can help evaluate the situation and coordinate further care.'],
      ['h2', 'When to go directly to a specialist'],
      ['p', 'If you already have a diagnosed condition — such as diabetes, a skin condition or a dental problem — booking directly with the relevant specialist can save time.'],
      ['h2', 'What to compare between doctors'],
      ['ul', ['Qualifications and specialization', 'Years of experience', 'Verified status', 'Location and consultation type', 'Availability that fits your schedule', 'Patient reviews from completed appointments']],
      ['p', 'Whatever you decide, a qualified doctor is the right person to advise you on diagnosis and treatment.'],
    ],
  },
  {
    slug: 'understanding-prediabetes',
    title: 'Understanding Prediabetes: What the Numbers Mean',
    category: 'Diabetes', categorySlugs: ['diabetes', 'endocrinologist'], icon: 'Droplet',
    excerpt: 'Prediabetes is common and often has no symptoms. Learn what it means and why a conversation with a doctor matters.',
    author: 'CareFind Editorial Team', date: '2026-09-20', readMins: 6,
    body: [
      ['p', 'Prediabetes means blood sugar levels are higher than normal but not yet in the diabetes range. Many people have it without knowing.'],
      ['h2', 'Why it matters'],
      ['p', 'Identifying prediabetes early gives you and your doctor an opportunity to discuss lifestyle and monitoring options.'],
      ['h2', 'Questions to ask your doctor'],
      ['ul', ['Which tests do I need and how often?', 'What do my results mean for me?', 'What lifestyle changes are appropriate for my situation?']],
      ['p', 'A diabetologist, endocrinologist or general physician can interpret your results in context.'],
    ],
  },
  {
    slug: 'dental-checkups-how-often',
    title: 'How Often Should You Get a Dental Checkup?',
    category: 'Dental', categorySlugs: ['dentist'], icon: 'Smile',
    excerpt: 'Regular dental visits help catch problems early. Here is what typically happens at a checkup and how to prepare.',
    author: 'CareFind Editorial Team', date: '2026-09-12', readMins: 4,
    body: [
      ['p', 'Routine dental checkups typically include an examination of your teeth and gums and, often, a professional cleaning.'],
      ['h2', 'What to expect'],
      ['ul', ['Discussion of any pain or sensitivity', 'Examination of teeth and gums', 'Cleaning and polishing', 'X-rays if your dentist recommends them']],
      ['p', 'Your dentist will recommend a checkup frequency based on your individual oral health.'],
    ],
  },
  {
    slug: 'acne-when-to-see-a-dermatologist',
    title: 'Acne: When Is It Time to See a Dermatologist?',
    category: 'Skin', categorySlugs: ['dermatologist'], icon: 'Sparkles',
    excerpt: 'Over-the-counter products are not always enough. Learn the signs that it may be time to consult a skin specialist.',
    author: 'CareFind Editorial Team', date: '2026-09-05', readMins: 5,
    body: [
      ['p', 'Acne is one of the most common skin concerns. While mild acne may respond to basic skincare, persistent or painful acne deserves professional attention.'],
      ['h2', 'Signs to book a consultation'],
      ['ul', ['Acne that leaves marks or scars', 'Painful, deep breakouts', 'No improvement after several weeks of basic care', 'Acne affecting your confidence or daily life']],
      ['p', 'A dermatologist can assess your skin type and discuss suitable options.'],
    ],
  },
  {
    slug: 'hair-fall-common-causes',
    title: 'Hair Fall: Common Causes and When to Get Help',
    category: 'Hair', categorySlugs: ['hair-loss', 'dermatologist'], icon: 'Scissors',
    excerpt: 'Some hair shedding is normal. Here is how to tell when it might be worth speaking with a trichologist or dermatologist.',
    author: 'CareFind Editorial Team', date: '2026-08-29', readMins: 5,
    body: [
      ['p', 'It is normal to shed some hair every day. Sudden or patchy hair loss, however, can have many causes that a specialist can help identify.'],
      ['h2', 'Possible contributing factors'],
      ['ul', ['Stress and lifestyle changes', 'Nutritional factors', 'Hormonal changes', 'Scalp conditions', 'Genetics']],
      ['p', 'A trichologist or dermatologist can evaluate your scalp and recommend appropriate next steps.'],
    ],
  },
  {
    slug: 'prostate-health-basics',
    title: "Prostate Health Basics Every Man Should Know",
    category: 'Prostate', categorySlugs: ['prostate', 'urologist'], icon: 'ShieldPlus',
    excerpt: 'Urinary changes are common with age, but they should not be ignored. Here is when to consider seeing a urologist.',
    author: 'CareFind Editorial Team', date: '2026-08-21', readMins: 4,
    body: [
      ['p', 'The prostate can change with age, and urinary symptoms are a common reason men see a urologist.'],
      ['h2', 'Symptoms worth discussing'],
      ['ul', ['Frequent urination, especially at night', 'Weak urine flow', 'Difficulty starting urination', 'Any blood in urine']],
      ['p', 'Only a qualified doctor can evaluate your symptoms. Booking a consultation is a simple first step.'],
    ],
  },
  {
    slug: 'heart-health-checkup-guide',
    title: 'A Simple Guide to Heart Health Checkups',
    category: 'Heart', categorySlugs: ['cardiology'], icon: 'HeartPulse',
    excerpt: 'Blood pressure, cholesterol and family history all play a role. Learn what a cardiology consultation usually covers.',
    author: 'CareFind Editorial Team', date: '2026-08-14', readMins: 5,
    body: [
      ['p', 'A heart health checkup typically starts with a conversation about your history, lifestyle and any symptoms.'],
      ['h2', 'Common parts of a cardiology visit'],
      ['ul', ['Blood pressure measurement', 'Review of cholesterol and blood tests', 'ECG if recommended', 'Discussion of family history']],
      ['p', 'If you ever experience severe chest pain or breathlessness, contact emergency services immediately.'],
    ],
  },
  {
    slug: 'medical-weight-management-explained',
    title: 'Medical Weight Management, Explained',
    category: 'Weight Loss', categorySlugs: ['weight-loss', 'nutritionist'], icon: 'Scale',
    excerpt: 'Medical weight management combines clinical evaluation with nutrition and lifestyle support. Here is how it works.',
    author: 'CareFind Editorial Team', date: '2026-08-07', readMins: 6,
    body: [
      ['p', 'Medical weight management is a doctor-guided approach that considers your overall health, not just the number on the scale.'],
      ['h2', 'Who you might see'],
      ['ul', ['Obesity medicine specialists', 'Endocrinologists', 'Nutritionists and dietitians', 'Bariatric specialists']],
      ['p', 'Your doctor will help determine which approach is appropriate for you.'],
    ],
  },
].map((p, i) => ({ ...p, id: `post_${i + 1}`, isSample: true, published: true }));

export const SEED_FAQS = [
  { q: 'Is booking an appointment really free?', a: 'Yes. Booking through CareFind is free for patients. Any consultation charges, if applicable, are settled directly with the clinic.' },
  { q: 'How do I know a doctor is verified?', a: 'Doctors with a ✓ Verified badge have had their medical registration, qualifications and clinic details reviewed by our team.' },
  { q: 'Can I cancel or reschedule?', a: 'Yes. You can cancel or reschedule from your patient dashboard at any time before the appointment.' },
  { q: 'Does CareFind provide medical advice?', a: 'No. CareFind helps you discover doctors and request appointments. It does not diagnose or provide medical advice.' },
  { q: 'What happens in an emergency?', a: 'CareFind is not for emergencies. Please contact your local emergency services immediately.' },
];

export const SEED_CONTENT = {
  heroTitle: 'Find the Right Doctor for Your Health',
  heroSubtitle: 'Search trusted doctors by specialty, health concern, location, and availability. Book your appointment for free.',
  about: 'CareFind is a doctor discovery and appointment-booking platform. Our mission is simple: help every patient find the right doctor and book an appointment in under a minute — for free.\n\nWe verify doctors, show transparent profiles with qualifications and experience, and make availability visible in real time so you never have to call around.',
  terms: 'These are sample Terms of Service for development purposes.\n\n1. CareFind is a discovery and booking service and does not provide medical care.\n2. Users must provide accurate information when booking.\n3. Doctors are responsible for the care they provide.\n4. Appointments may be cancelled or rescheduled by either party.\n\nReplace this content with your legal team\'s approved terms before launch.',
  privacy: 'This is a sample Privacy Policy for development purposes.\n\nWe collect only the information needed to book appointments: name, contact details, age, gender and reason for visit. Patient information is shared only with the doctor you book. We never sell personal data.\n\nReplace this content with your approved privacy policy before launch.',
  contact: 'Email: support@carefind.example\nPhone: +91 00000 00000 (sample)\nHours: Mon–Sat, 9 AM – 7 PM',
  careers: 'We are building the simplest way to find and book healthcare. Open roles will be listed here.',
  disclaimer: 'This platform helps users discover healthcare professionals and request appointments. Information provided on the platform is for general informational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. In an emergency, contact your local emergency services.',
};
