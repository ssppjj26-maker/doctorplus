/**
 * MetabolicMD™ USA - Interactive Core Logic & Lead Collection System
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Initial State & Leads
  initLeadsStorage();
  initNavbar();
  initQuickBooking();
  initModalWizard();
  initBmiCalculator();
  initDoctorFilters();
  initFaqAccordion();
  initLeadMagnet();
  initSocialProofToast();
  initAdminPortal();
});

/* ==========================================================================
   1. Local Storage & Lead Management (For Email Marketing)
   ========================================================================== */

const STORAGE_KEY = 'metabolic_md_leads_us';

const DEFAULT_SAMPLE_LEADS = [
  {
    id: 'US-MET-9421',
    timestamp: '2026-10-06 14:22',
    name: 'Rebecca Miller',
    email: 'rebecca.miller91@gmail.com',
    phone: '(512) 883-9120',
    state: 'Texas (TX)',
    age: '38',
    currentWeight: '215 lbs',
    goalWeight: '145 lbs',
    struggle: 'Hormonal Plateau & Slow Metabolism',
    doctor: 'Dr. Sarah Jenkins, MD',
    hospital: 'Cleveland Clinic',
    type: 'Telehealth (Video)',
    slot: 'Tomorrow - 10:30 AM EST'
  },
  {
    id: 'US-MET-9388',
    timestamp: '2026-10-06 11:45',
    name: 'David Sanderson',
    email: 'dsanderson.biz@outlook.com',
    phone: '(312) 404-5821',
    state: 'Illinois (IL)',
    age: '46',
    currentWeight: '265 lbs',
    goalWeight: '190 lbs',
    struggle: 'Insulin Resistance & Pre-Diabetes',
    doctor: 'Dr. Marcus Vance, MD, PhD',
    hospital: 'Johns Hopkins Medicine',
    type: 'In-Person Consultation',
    slot: 'Thursday - 2:00 PM CST'
  },
  {
    id: 'US-MET-9240',
    timestamp: '2026-10-05 16:10',
    name: 'Melissa Thorne',
    email: 'm.thorne.wellness@yahoo.com',
    phone: '(415) 779-3321',
    state: 'California (CA)',
    age: '34',
    currentWeight: '185 lbs',
    goalWeight: '135 lbs',
    struggle: 'PCOS & Chronic Weight Cycling',
    doctor: 'Dr. Elena Rostova, MD',
    hospital: 'Mayo Clinic',
    type: 'Telehealth (Video)',
    slot: 'Friday - 11:00 AM PST'
  },
  {
    id: 'US-MET-9104',
    timestamp: '2026-10-05 09:30',
    name: 'Christopher Walsh',
    email: 'cwalsh.ny@gmail.com',
    phone: '(212) 640-1928',
    state: 'New York (NY)',
    age: '52',
    currentWeight: '240 lbs',
    goalWeight: '175 lbs',
    struggle: 'Cardiometabolic Risk & Stubborn Belly Fat',
    doctor: 'Dr. David Chen, MD (Cedars-Sinai)',
    hospital: 'Cedars-Sinai Medical Center',
    type: 'Telehealth (Video)',
    slot: 'Next Monday - 3:30 PM EST'
  }
];

function initLeadsStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_LEADS));
  }
  updateLeadBadgeCount();
}

function getStoredLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SAMPLE_LEADS;
  } catch (e) {
    return DEFAULT_SAMPLE_LEADS;
  }
}

function saveNewLead(leadData) {
  const leads = getStoredLeads();
  leads.unshift(leadData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  updateLeadBadgeCount();
}

function updateLeadBadgeCount() {
  const count = getStoredLeads().length;
  const badge = document.getElementById('adminLeadsCount');
  if (badge) {
    badge.textContent = count;
  }
}

/* ==========================================================================
   2. Navbar Scroll & Interactions
   ========================================================================== */

function initNavbar() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#ffffff';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      }
    });
  }
}

/* ==========================================================================
   Validation & Formatting Engine (Strict Healthcare Lead Verification)
   ========================================================================== */

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // RFC 5322 compliant regex ensuring proper user, domain, and 2+ character TLD
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;
  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;
  const domainParts = parts[1].split('.');
  if (domainParts.length < 2) return false;
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;
  return true;
}

function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  // Must be between 10 and 15 digits
  if (digits.length < 10 || digits.length > 15) return false;
  // Reject identical repetition (e.g. 0000000000, 1111111111)
  if (/^(\d)\1{9,}$/.test(digits)) return false;
  // Reject sequential fake numbers
  if (digits === '1234567890' || digits === '0123456789') return false;
  return true;
}

function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  // Must contain alphabetic characters
  if (!/[a-zA-Z]/.test(trimmed)) return false;
  return true;
}

function formatPhoneValue(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function attachPhoneFormatter(inputEl) {
  if (!inputEl) return;
  inputEl.addEventListener('input', () => {
    inputEl.value = formatPhoneValue(inputEl.value);
  });
}

function setFieldError(inputEl, errorEl, message) {
  if (inputEl) {
    inputEl.classList.add('is-invalid');
    inputEl.classList.remove('is-valid');
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearFieldError(inputEl, errorEl) {
  if (inputEl) {
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
  }
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

/* ==========================================================================
   3. Quick Booking Card (Hero Section)
   ========================================================================== */

function initQuickBooking() {
  const quickForm = document.getElementById('quickBookingForm');
  if (!quickForm) return;

  const nameInput = document.getElementById('quickName');
  const emailInput = document.getElementById('quickEmail');
  const phoneInput = document.getElementById('quickPhone');
  const stateSelect = document.getElementById('quickState');
  const errorBanner = document.getElementById('quickFormErrorBanner');

  const nameError = document.getElementById('quickNameError');
  const emailError = document.getElementById('quickEmailError');
  const phoneError = document.getElementById('quickPhoneError');
  const stateError = document.getElementById('quickStateError');

  attachPhoneFormatter(phoneInput);

  // Live real-time validation clearance
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (isValidName(nameInput.value)) clearFieldError(nameInput, nameError);
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value)) clearFieldError(emailInput, emailError);
    });
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (isValidPhone(phoneInput.value)) clearFieldError(phoneInput, phoneError);
    });
  }
  if (stateSelect) {
    stateSelect.addEventListener('change', () => {
      if (stateSelect.value) clearFieldError(stateSelect, stateError);
    });
  }

  quickForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;
    let firstInvalidInput = null;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const state = stateSelect.value;
    const struggle = document.getElementById('quickStruggle').value;

    // Validate Name
    if (!isValidName(name)) {
      setFieldError(nameInput, nameError, 'Please enter your full name (minimum 2 letters).');
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = nameInput;
    } else {
      clearFieldError(nameInput, nameError);
    }

    // Validate Email
    if (!isValidEmail(email)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address (e.g. name@example.com).');
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else {
      clearFieldError(emailInput, emailError);
    }

    // Validate Phone
    if (!isValidPhone(phone)) {
      setFieldError(phoneInput, phoneError, 'Please enter a valid 10-digit phone number (e.g. (555) 123-4567).');
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
    } else {
      clearFieldError(phoneInput, phoneError);
    }

    // Validate State
    if (!state) {
      setFieldError(stateSelect, stateError, 'Please select your US state.');
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = stateSelect;
    } else {
      clearFieldError(stateSelect, stateError);
    }

    // Strictly prevent submission if not proper
    if (hasErrors) {
      if (errorBanner) {
        errorBanner.classList.add('visible');
      }
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    if (errorBanner) {
      errorBanner.classList.remove('visible');
    }

    const newLead = {
      id: 'US-MET-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      name: name,
      email: email,
      phone: phone,
      state: state,
      age: 'Not specified',
      currentWeight: 'To be assessed during free consult',
      goalWeight: 'Personalized Clinical Target',
      struggle: struggle || 'General Weight Struggle',
      doctor: 'Assigned Top US Obesity Specialist',
      hospital: 'Mayo Clinic / Cleveland Clinic Network',
      type: 'Telehealth (Video)',
      slot: 'Priority Window: Next 24-48 Hours'
    };

    saveNewLead(newLead);
    showBookingSuccessModal(newLead);
    quickForm.reset();

    // Clear validity states
    [nameInput, emailInput, phoneInput, stateSelect].forEach(el => {
      if (el) el.classList.remove('is-valid', 'is-invalid');
    });
  });
}

/* ==========================================================================
   4. Multi-Step Modal Consultation Booking Wizard
   ========================================================================== */

let currentWizardStep = 1;

function initModalWizard() {
  const modal = document.getElementById('bookingModal');
  const openButtons = document.querySelectorAll('.open-booking-modal');
  const closeBtn = document.getElementById('closeModalBtn');

  const wizardName = document.getElementById('wizardName');
  const wizardEmail = document.getElementById('wizardEmail');
  const wizardPhone = document.getElementById('wizardPhone');
  const wizardState = document.getElementById('wizardState');
  const wizardCurrentWeight = document.getElementById('wizardCurrentWeight');
  const wizardGoalWeight = document.getElementById('wizardGoalWeight');
  const wizardErrorBanner = document.getElementById('wizardErrorBanner');
  const wizardErrorText = document.getElementById('wizardErrorText');

  const nameError = document.getElementById('wizardNameError');
  const emailError = document.getElementById('wizardEmailError');
  const phoneError = document.getElementById('wizardPhoneError');
  const stateError = document.getElementById('wizardStateError');
  const currentWeightError = document.getElementById('wizardCurrentWeightError');
  const goalWeightError = document.getElementById('wizardGoalWeightError');
  const strugglesError = document.getElementById('wizardStrugglesError');

  attachPhoneFormatter(wizardPhone);

  // Live validation listeners on modal inputs
  if (wizardName) {
    wizardName.addEventListener('input', () => {
      if (isValidName(wizardName.value)) clearFieldError(wizardName, nameError);
    });
  }
  if (wizardEmail) {
    wizardEmail.addEventListener('input', () => {
      if (isValidEmail(wizardEmail.value)) clearFieldError(wizardEmail, emailError);
    });
  }
  if (wizardPhone) {
    wizardPhone.addEventListener('input', () => {
      if (isValidPhone(wizardPhone.value)) clearFieldError(wizardPhone, phoneError);
    });
  }
  if (wizardState) {
    wizardState.addEventListener('change', () => {
      if (wizardState.value) clearFieldError(wizardState, stateError);
    });
  }
  if (wizardCurrentWeight) {
    wizardCurrentWeight.addEventListener('input', () => {
      const val = parseFloat(wizardCurrentWeight.value);
      if (val >= 70 && val <= 700) clearFieldError(wizardCurrentWeight, currentWeightError);
    });
  }
  if (wizardGoalWeight) {
    wizardGoalWeight.addEventListener('input', () => {
      const val = parseFloat(wizardGoalWeight.value);
      if (val >= 60 && val <= 600) clearFieldError(wizardGoalWeight, goalWeightError);
    });
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docName = btn.getAttribute('data-doctor');
      if (docName) {
        const docSelect = document.getElementById('wizardDoctor');
        if (docSelect) {
          for (let option of docSelect.options) {
            if (option.text.includes(docName)) {
              option.selected = true;
              break;
            }
          }
        }
      }
      openBookingModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeBookingModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeBookingModal();
      }
    });
  }

  // Step 1 -> Step 2 with strict validation
  const nextToStep2 = document.getElementById('nextToStep2');
  if (nextToStep2) {
    nextToStep2.addEventListener('click', (e) => {
      e.preventDefault();

      let hasErrors = false;
      let firstInvalidInput = null;

      const name = wizardName.value.trim();
      const email = wizardEmail.value.trim();
      const phone = wizardPhone.value.trim();
      const state = wizardState.value;

      // Validate Name
      if (!isValidName(name)) {
        setFieldError(wizardName, nameError, 'Please enter your full name (minimum 2 letters).');
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = wizardName;
      } else {
        clearFieldError(wizardName, nameError);
      }

      // Validate Email
      if (!isValidEmail(email)) {
        setFieldError(wizardEmail, emailError, 'Please enter a valid email address (e.g. sarah@example.com).');
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = wizardEmail;
      } else {
        clearFieldError(wizardEmail, emailError);
      }

      // Validate Phone
      if (!isValidPhone(phone)) {
        setFieldError(wizardPhone, phoneError, 'Please enter a valid 10-digit phone number (e.g. (555) 123-4567).');
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = wizardPhone;
      } else {
        clearFieldError(wizardPhone, phoneError);
      }

      // Validate State
      if (!state) {
        setFieldError(wizardState, stateError, 'Please select your US state.');
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = wizardState;
      } else {
        clearFieldError(wizardState, stateError);
      }

      // Strict block: form cannot submit or proceed until all fields are proper
      if (hasErrors) {
        if (wizardErrorBanner) {
          wizardErrorText.textContent = 'Please provide a valid name, email, phone number, and state to proceed.';
          wizardErrorBanner.classList.add('visible');
        }
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      if (wizardErrorBanner) wizardErrorBanner.classList.remove('visible');
      goToStep(2);
    });
  }

  // Step 2 -> Back / Next
  const backToStep1 = document.getElementById('backToStep1');
  if (backToStep1) backToStep1.addEventListener('click', () => {
    if (wizardErrorBanner) wizardErrorBanner.classList.remove('visible');
    goToStep(1);
  });

  const nextToStep3 = document.getElementById('nextToStep3');
  if (nextToStep3) {
    nextToStep3.addEventListener('click', (e) => {
      e.preventDefault();

      let hasErrors = false;
      let firstInvalidInput = null;

      const currentWeight = parseFloat(wizardCurrentWeight.value);
      const goalWeight = parseFloat(wizardGoalWeight.value);

      if (isNaN(currentWeight) || currentWeight < 70 || currentWeight > 700) {
        setFieldError(wizardCurrentWeight, currentWeightError, 'Please enter a realistic current weight (70 to 700 lbs).');
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = wizardCurrentWeight;
      } else {
        clearFieldError(wizardCurrentWeight, currentWeightError);
      }

      if (isNaN(goalWeight) || goalWeight < 60 || goalWeight > 600) {
        setFieldError(wizardGoalWeight, goalWeightError, 'Please enter a realistic target weight (60 to 600 lbs).');
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = wizardGoalWeight;
      } else {
        clearFieldError(wizardGoalWeight, goalWeightError);
      }

      const checkedStruggles = document.querySelectorAll('input[name="struggles"]:checked');
      if (checkedStruggles.length === 0) {
        if (strugglesError) {
          strugglesError.textContent = 'Please select at least one factor affecting your weight.';
          strugglesError.classList.add('visible');
        }
        hasErrors = true;
      } else {
        if (strugglesError) {
          strugglesError.textContent = '';
          strugglesError.classList.remove('visible');
        }
      }

      if (hasErrors) {
        if (wizardErrorBanner) {
          wizardErrorText.textContent = 'Please fill in your current weight, goal weight, and check at least one struggle.';
          wizardErrorBanner.classList.add('visible');
        }
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      if (wizardErrorBanner) wizardErrorBanner.classList.remove('visible');
      goToStep(3);
    });
  }

  // Step 3 -> Back / Submit
  const backToStep2 = document.getElementById('backToStep2');
  if (backToStep2) backToStep2.addEventListener('click', () => {
    if (wizardErrorBanner) wizardErrorBanner.classList.remove('visible');
    goToStep(2);
  });

  const submitModalBooking = document.getElementById('submitModalBooking');
  if (submitModalBooking) {
    submitModalBooking.addEventListener('click', handleWizardSubmit);
  }
}

function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const banner = document.getElementById('wizardErrorBanner');
    if (banner) banner.classList.remove('visible');
    goToStep(1);
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

function goToStep(step) {
  currentWizardStep = step;
  
  // Hide all step contents
  document.querySelectorAll('.wizard-step-content').forEach(el => el.classList.remove('active'));
  const targetContent = document.getElementById(`wizardStep${step}`);
  if (targetContent) targetContent.classList.add('active');

  // Update step indicators
  document.querySelectorAll('.wizard-step-node').forEach(node => {
    const nodeStep = parseInt(node.getAttribute('data-step'));
    node.classList.remove('active', 'completed');
    if (nodeStep === step) {
      node.classList.add('active');
    } else if (nodeStep < step) {
      node.classList.add('completed');
    }
  });
}

function handleWizardSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('wizardName').value.trim();
  const email = document.getElementById('wizardEmail').value.trim();
  const phone = document.getElementById('wizardPhone').value.trim();
  const state = document.getElementById('wizardState').value;
  const currentWeightVal = document.getElementById('wizardCurrentWeight').value.trim();
  const goalWeightVal = document.getElementById('wizardGoalWeight').value.trim();
  const age = document.getElementById('wizardAge').value;

  // Final sanity check before submission
  if (!isValidName(name) || !isValidEmail(email) || !isValidPhone(phone) || !state) {
    goToStep(1);
    const wizardErrorBanner = document.getElementById('wizardErrorBanner');
    const wizardErrorText = document.getElementById('wizardErrorText');
    if (wizardErrorBanner) {
      wizardErrorText.textContent = 'Please enter a valid name, email, phone number, and select your state.';
      wizardErrorBanner.classList.add('visible');
    }
    return;
  }

  // Collect struggles checked
  const strugglesChecked = [];
  document.querySelectorAll('input[name="struggles"]:checked').forEach(cb => {
    strugglesChecked.push(cb.value);
  });
  const struggleText = strugglesChecked.length ? strugglesChecked.join(', ') : 'Metabolic Resistance';

  const doctorSelect = document.getElementById('wizardDoctor');
  const doctor = doctorSelect ? doctorSelect.options[doctorSelect.selectedIndex].text : 'Top Available US Specialist';
  const hospital = doctor.includes('Mayo') ? 'Mayo Clinic' : 
                   doctor.includes('Cleveland') ? 'Cleveland Clinic' : 
                   doctor.includes('Johns Hopkins') ? 'Johns Hopkins Medicine' : 'Top US Hospital Affiliate';

  const consultType = document.querySelector('input[name="consultType"]:checked')?.value || 'Telehealth (Video Call)';
  const slot = document.getElementById('wizardSlot').value || 'Earliest Available (Next 48h)';

  const newLead = {
    id: 'US-MET-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    name: name,
    email: email,
    phone: phone,
    state: state,
    age: age,
    currentWeight: currentWeightVal + ' lbs',
    goalWeight: goalWeightVal + ' lbs',
    struggle: struggleText,
    doctor: doctor,
    hospital: hospital,
    type: consultType,
    slot: slot
  };

  saveNewLead(newLead);
  closeBookingModal();
  showBookingSuccessModal(newLead);
}

/* ==========================================================================
   5. Success Confirmation Modal
   ========================================================================== */

function showBookingSuccessModal(lead) {
  const successModal = document.getElementById('successModal');
  if (!successModal) return;

  document.getElementById('confLeadId').textContent = lead.id;
  document.getElementById('confName').textContent = lead.name;
  document.getElementById('confEmail').textContent = lead.email;
  document.getElementById('confDoctor').textContent = lead.doctor;
  document.getElementById('confSlot').textContent = lead.slot;

  successModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const closeSuccess = document.getElementById('closeSuccessBtn');
  if (closeSuccess) {
    closeSuccess.onclick = () => {
      successModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    };
  }
}

/* ==========================================================================
   6. BMI & Metabolic Resistance Assessment (Interactive Funnel)
   ========================================================================== */

function initBmiCalculator() {
  const calcForm = document.getElementById('bmiCalcForm');
  if (!calcForm) return;

  const unitBtns = document.querySelectorAll('.unit-btn');
  let currentUnit = 'us'; // 'us' (lbs/inches) or 'metric' (kg/cm)

  unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      unitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentUnit = btn.getAttribute('data-unit');
      updateCalcLabels(currentUnit);
    });
  });

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById('calcHeight').value);
    const weight = parseFloat(document.getElementById('calcWeight').value);

    if (!height || !weight) {
      alert('Please enter your height and weight.');
      return;
    }

    let bmi = 0;
    if (currentUnit === 'us') {
      bmi = (weight / (height * height)) * 703;
    } else {
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    }

    bmi = Math.round(bmi * 10) / 10;

    let category = '';
    let advice = '';

    if (bmi < 25) {
      category = 'Normal Range (Metabolic Optimization)';
      advice = 'Our physicians focus on preserving lean mass, cellular longevity, and hormone stabilization.';
    } else if (bmi < 30) {
      category = 'Overweight (Stage 1 Metabolic Load)';
      advice = 'Clinical studies show early metabolic intervention prevents insulin resistance and permanent set-point resets.';
    } else if (bmi < 35) {
      category = 'Class 1 Obesity (High Set-Point Resistance)';
      advice = 'Standard calorie deprivation triggers metabolic slowdown. Board-certified US physicians can review GLP-1 and metabolic biology.';
    } else {
      category = 'Class 2+ Obesity (Severe Metabolic Adaptation)';
      advice = 'You qualify for comprehensive medical obesity management covered under clinical guidelines. You are paired with top US hospital specialists.';
    }

    const resultBox = document.getElementById('calcResultBox');
    document.getElementById('calcBmiVal').textContent = bmi;
    document.getElementById('calcBmiCat').textContent = category;
    document.getElementById('calcBmiNote').textContent = advice;
    resultBox.style.display = 'block';

    // Auto populate modal with these values if they open it
    const wizardWeight = document.getElementById('wizardCurrentWeight');
    if (wizardWeight) {
      wizardWeight.value = currentUnit === 'us' ? Math.round(weight) : Math.round(weight * 2.20462);
    }
  });

  // Claim Doctor Review button in calculator
  const claimDoctorBtn = document.getElementById('claimAssessmentDoctor');
  if (claimDoctorBtn) {
    claimDoctorBtn.addEventListener('click', () => {
      openBookingModal();
    });
  }
}

function updateCalcLabels(unit) {
  const heightLabel = document.getElementById('calcHeightLabel');
  const weightLabel = document.getElementById('calcWeightLabel');
  const heightInput = document.getElementById('calcHeight');
  const weightInput = document.getElementById('calcWeight');

  if (unit === 'us') {
    heightLabel.textContent = 'Height (Inches, e.g. 68 for 5\'8")';
    weightLabel.textContent = 'Current Weight (lbs)';
    heightInput.placeholder = 'e.g. 68';
    weightInput.placeholder = 'e.g. 210';
  } else {
    heightLabel.textContent = 'Height (Centimeters)';
    weightLabel.textContent = 'Current Weight (kg)';
    heightInput.placeholder = 'e.g. 173';
    weightInput.placeholder = 'e.g. 95';
  }
}

/* ==========================================================================
   7. Featured Doctor Directory Filtering
   ========================================================================== */

function initDoctorFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      doctorCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */

function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isActive = parent.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. Secondary Lead Magnet (Download Free Clinical Protocol)
   ========================================================================== */

function initLeadMagnet() {
  const magnetForm = document.getElementById('leadMagnetForm');
  if (!magnetForm) return;

  const magnetNameInput = document.getElementById('magnetName');
  const magnetEmailInput = document.getElementById('magnetEmail');
  const magnetNameError = document.getElementById('magnetNameError');
  const magnetEmailError = document.getElementById('magnetEmailError');

  if (magnetNameInput) {
    magnetNameInput.addEventListener('input', () => {
      if (isValidName(magnetNameInput.value)) clearFieldError(magnetNameInput, magnetNameError);
    });
  }
  if (magnetEmailInput) {
    magnetEmailInput.addEventListener('input', () => {
      if (isValidEmail(magnetEmailInput.value)) clearFieldError(magnetEmailInput, magnetEmailError);
    });
  }

  magnetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;
    let firstInvalid = null;

    const name = magnetNameInput.value.trim();
    const email = magnetEmailInput.value.trim();

    if (!isValidName(name)) {
      setFieldError(magnetNameInput, magnetNameError, 'Please enter your name (minimum 2 letters).');
      hasErrors = true;
      if (!firstInvalid) firstInvalid = magnetNameInput;
    } else {
      clearFieldError(magnetNameInput, magnetNameError);
    }

    if (!isValidEmail(email)) {
      setFieldError(magnetEmailInput, magnetEmailError, 'Please enter a valid email address (e.g. name@example.com).');
      hasErrors = true;
      if (!firstInvalid) firstInvalid = magnetEmailInput;
    } else {
      clearFieldError(magnetEmailInput, magnetEmailError);
    }

    if (hasErrors) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const newLead = {
      id: 'US-MET-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      name: name,
      email: email,
      phone: 'Guide Request (Follow up via email)',
      state: 'Guide Download',
      age: '-',
      currentWeight: '-',
      goalWeight: '-',
      struggle: 'Requested 2026 Clinical Metabolic Guide',
      doctor: 'Education Resource Team',
      hospital: 'MetabolicMD US Faculty',
      type: 'Guide Download Lead',
      slot: 'Email Sent'
    };

    saveNewLead(newLead);
    alert(`Thank you, ${name}! Your copy of the "2026 Physician's Protocol: Resetting Leptin & Metabolic Setpoint" has been dispatched to ${email}. You also qualify for a 100% Free Consultation!`);
    magnetForm.reset();
    [magnetNameInput, magnetEmailInput].forEach(el => {
      if (el) el.classList.remove('is-valid', 'is-invalid');
    });
  });
}

/* ==========================================================================
   10. Live Booking Social Proof Toaster
   ========================================================================== */

function initSocialProofToast() {
  const toast = document.getElementById('liveToast');
  if (!toast) return;

  const sampleNotifications = [
    { name: 'Sarah T.', city: 'Austin, TX', doctor: 'Dr. Sarah Jenkins', image: 'images/doctor-jenkins.jpg' },
    { name: 'Michael K.', city: 'Chicago, IL', doctor: 'Dr. Marcus Vance', image: 'images/doctor-vance.jpg' },
    { name: 'Jennifer R.', city: 'Miami, FL', doctor: 'Dr. Elena Rostova', image: 'images/doctor-rostova.jpg' },
    { name: 'Robert B.', city: 'Phoenix, AZ', doctor: 'Dr. David Chen', image: 'images/doctor-chen.jpg' },
    { name: 'Ashley D.', city: 'Atlanta, GA', doctor: 'Dr. Sarah Jenkins', image: 'images/doctor-jenkins.jpg' }
  ];

  let currentIndex = 0;

  function showToast() {
    const item = sampleNotifications[currentIndex];
    const textEl = document.getElementById('toastText');
    const avatarEl = document.getElementById('toastAvatar') || toast.querySelector('.toast-avatar');

    if (textEl) {
      textEl.innerHTML = `<strong>${item.name} from ${item.city}</strong> Just Booked 100% Free Consultation with ${item.doctor}`;
    }
    if (avatarEl && item.image) {
      avatarEl.src = item.image;
    }

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);

    currentIndex = (currentIndex + 1) % sampleNotifications.length;
  }

  // First toast after 3 seconds, then every 22 seconds
  setTimeout(showToast, 3500);
  setInterval(showToast, 22000);
}

/* ==========================================================================
   11. Admin / Email Marketing Lead Management Portal
   ========================================================================== */

function initAdminPortal() {
  const adminModal = document.getElementById('adminPortalModal');
  const openAdminBtn = document.getElementById('openAdminPortal');
  const footerAdminTrigger = document.getElementById('footerAdminTrigger');
  const closeAdminBtn = document.getElementById('closeAdminBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const copyEmailsBtn = document.getElementById('copyEmailsBtn');
  const searchInput = document.getElementById('adminSearchInput');

  const openAdmin = (e) => {
    if (e) e.preventDefault();
    renderLeadsTable();
    adminModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', openAdmin);
  }
  if (footerAdminTrigger) {
    footerAdminTrigger.addEventListener('click', openAdmin);
  }

  // Keyboard shortcut: Ctrl + Shift + L
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
      e.preventDefault();
      renderLeadsTable();
      adminModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', () => {
      adminModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportLeadsToCsv);
  }

  if (copyEmailsBtn) {
    copyEmailsBtn.addEventListener('click', copyAllEmailsToClipboard);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      renderLeadsTable(query);
    });
  }
}

function renderLeadsTable(filterQuery = '') {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  const leads = getStoredLeads();
  tbody.innerHTML = '';

  const filtered = leads.filter(l => {
    if (!filterQuery) return true;
    return (
      l.name.toLowerCase().includes(filterQuery) ||
      l.email.toLowerCase().includes(filterQuery) ||
      l.phone.toLowerCase().includes(filterQuery) ||
      l.state.toLowerCase().includes(filterQuery) ||
      l.doctor.toLowerCase().includes(filterQuery) ||
      l.struggle.toLowerCase().includes(filterQuery)
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748b;">No leads found matching your search.</td></tr>`;
    return;
  }

  filtered.forEach(lead => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${lead.id}</strong><br><small style="color:#94a3b8;">${lead.timestamp}</small></td>
      <td><strong>${escapeHtml(lead.name)}</strong><br><small style="color:#0d9488;">${escapeHtml(lead.state)}</small></td>
      <td><span style="font-weight:600; color:#1d4ed8;">${escapeHtml(lead.email)}</span></td>
      <td>${escapeHtml(lead.phone)}</td>
      <td><span class="tag-pill" style="font-size:0.75rem;">${escapeHtml(lead.struggle)}</span></td>
      <td><small><strong>${escapeHtml(lead.doctor)}</strong></small><br><span style="font-size:0.75rem; color:#059669;">${escapeHtml(lead.type)}</span></td>
      <td><button class="btn-primary" style="padding:4px 10px; font-size:0.75rem;" onclick="copySingleEmail('${escapeHtml(lead.email)}')">Copy Email</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function copySingleEmail(email) {
  navigator.clipboard.writeText(email).then(() => {
    alert(`Copied "${email}" to clipboard!`);
  });
}

function copyAllEmailsToClipboard() {
  const leads = getStoredLeads();
  const emails = leads.map(l => l.email).filter(e => e && e.includes('@'));
  const uniqueEmails = [...new Set(emails)];

  if (uniqueEmails.length === 0) {
    alert('No emails to copy.');
    return;
  }

  const emailString = uniqueEmails.join(', ');
  navigator.clipboard.writeText(emailString).then(() => {
    alert(`Successfully copied ${uniqueEmails.length} client email addresses to clipboard! Ready to paste into your email marketing platform (Mailchimp, Klaviyo, etc.).`);
  });
}

function exportLeadsToCsv() {
  const leads = getStoredLeads();
  if (leads.length === 0) {
    alert('No leads to export.');
    return;
  }

  const headers = ['Lead ID', 'Timestamp', 'Full Name', 'Email Address', 'Phone Number', 'US State', 'Age', 'Current Weight', 'Target Goal', 'Primary Struggle', 'Assigned Doctor', 'Hospital', 'Consultation Mode', 'Requested Slot'];
  
  const csvRows = [];
  csvRows.push(headers.join(','));

  leads.forEach(l => {
    const row = [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${(l.state || '').replace(/"/g, '""')}"`,
      `"${(l.age || '').replace(/"/g, '""')}"`,
      `"${(l.currentWeight || '').replace(/"/g, '""')}"`,
      `"${(l.goalWeight || '').replace(/"/g, '""')}"`,
      `"${(l.struggle || '').replace(/"/g, '""')}"`,
      `"${(l.doctor || '').replace(/"/g, '""')}"`,
      `"${(l.hospital || '').replace(/"/g, '""')}"`,
      `"${(l.type || '').replace(/"/g, '""')}"`,
      `"${(l.slot || '').replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `metabolicmd_weightloss_leads_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
