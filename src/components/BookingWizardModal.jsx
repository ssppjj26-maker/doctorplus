import React, { useState, useEffect } from 'react';
import {
  X, Check, ArrowRight, ArrowLeft, Calendar, Clock,
  Globe, User, ShieldAlert, CheckCircle2, Stethoscope, AlertTriangle
} from 'lucide-react';
import { CATEGORIES, QUESTIONNAIRES, TIMEZONES, TARGET_COUNTRIES } from '../data/healthcareData';
import {
  getUpcomingDates, convertSlotToPatientTime, detectBrowserTimezone,
  createAppointment
} from '../lib/storage';

export function BookingWizardModal({
  initialCategory,
  initialDoctor,
  doctors,
  onClose,
  onBookingSuccess,
  onTriggerEmergency
}) {
  // 5 PRD Steps:
  // Step 1: Health Concern
  // Step 2: Doctor
  // Step 3: Appointment (Date, Time, Timezone)
  // Step 4: Patient Information
  // Step 5: Health Questions + Safety & Privacy Notice
  const [currentStep, setCurrentStep] = useState(
    initialDoctor ? 3 : (initialCategory ? 2 : 1)
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialDoctor?.categoryId || initialCategory || 'weight-management'
  );

  const [selectedDoctor, setSelectedDoctor] = useState(
    initialDoctor || doctors.find((d) => d.categoryId === (initialCategory || 'weight-management')) || doctors[0]
  );

  // Timezone & Slots
  const [patientTz, setPatientTz] = useState(detectBrowserTimezone());
  const upcomingDates = getUpcomingDates(0, 7);
  const [selectedDate, setSelectedDate] = useState(upcomingDates[0].iso);
  const [selectedSlotUTC, setSelectedSlotUTC] = useState(
    selectedDoctor?.baseSlotTimesUTC?.[0] || '09:00'
  );

  // Patient Info Fields (PRD Section 18)
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'India',
    age: '',
    gender: 'Prefer not to say'
  });

  // Health Intake Answers (PRD Section 19)
  const [healthAnswers, setHealthAnswers] = useState({});

  // Safety & Privacy Agreements (PRD Sections 20 & 21)
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  // Update selected doctor when category changes if doctor not set or mismatch
  useEffect(() => {
    if (selectedCategoryId) {
      const match = doctors.find((d) => d.categoryId === selectedCategoryId);
      if (match) {
        setSelectedDoctor(match);
        if (match.baseSlotTimesUTC?.[0]) setSelectedSlotUTC(match.baseSlotTimesUTC[0]);
      }
    }
  }, [selectedCategoryId, doctors]);

  // Current category questionnaire
  const questionnaireConfig = QUESTIONNAIRES[selectedCategoryId] || QUESTIONNAIRES['general-default'];

  const handleInfoChange = (field, val) => {
    setPatientInfo((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAnswerChange = (qId, val) => {
    setHealthAnswers((prev) => ({ ...prev, [qId]: val }));
    if (errors[qId]) {
      setErrors((prev) => ({ ...prev, [qId]: null }));
    }
  };

  // Step Validation
  const validateStep = (step) => {
    const errs = {};

    if (step === 1) {
      if (!selectedCategoryId) errs.category = 'Please choose a health concern.';
    }

    if (step === 2) {
      if (!selectedDoctor) errs.doctor = 'Please select a doctor for your consultation.';
    }

    if (step === 3) {
      if (!selectedDate) errs.date = 'Please select an appointment date.';
      if (!selectedSlotUTC) errs.slot = 'Please select an available time slot.';
    }

    if (step === 4) {
      if (!patientInfo.firstName.trim()) errs.firstName = 'First name is required.';
      if (!patientInfo.lastName.trim()) errs.lastName = 'Last name is required.';
      if (!patientInfo.email.trim() || !patientInfo.email.includes('@')) {
        errs.email = 'A valid email address is required.';
      }
      if (!patientInfo.phone.trim()) errs.phone = 'Phone number is required.';
      if (!patientInfo.age.trim()) errs.age = 'Age or year of birth is required.';
    }

    if (step === 5) {
      questionnaireConfig.questions.forEach((q) => {
        if (q.required && (!healthAnswers[q.id] || healthAnswers[q.id].trim() === '')) {
          errs[q.id] = 'This question is required for clinical context.';
        }
      });
      if (!privacyAgreed) {
        errs.privacy = 'You must agree to the Privacy Policy and Terms of Service.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    const formattedTime = convertSlotToPatientTime(selectedSlotUTC, patientTz, selectedDate);
    const selectedCat = CATEGORIES.find((c) => c.id === selectedCategoryId);

    const apptData = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      categoryId: selectedCategoryId,
      categoryName: selectedCat ? selectedCat.name : selectedDoctor.specialty,
      date: selectedDate,
      timeUTC: selectedSlotUTC,
      timeFormatted: formattedTime,
      patientTimezone: patientTz,
      patientFirstName: patientInfo.firstName,
      patientLastName: patientInfo.lastName,
      patientName: `${patientInfo.firstName} ${patientInfo.lastName}`,
      patientEmail: patientInfo.email,
      patientPhone: patientInfo.phone,
      patientCountry: patientInfo.country,
      patientAge: patientInfo.age,
      patientGender: patientInfo.gender,
      healthAnswers,
      consultationFee: selectedDoctor.consultationFee || 'Free'
    };

    const newAppt = createAppointment(apptData);
    onBookingSuccess(newAppt);
  };

  // Doctors matching current category
  const suitableDoctors = doctors.filter((d) => d.categoryId === selectedCategoryId);
  const displayDoctors = suitableDoctors.length > 0 ? suitableDoctors : doctors.slice(0, 3);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Book an Online Consultation</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Step {currentStep} of 5 — {
                currentStep === 1 ? 'Health Concern' :
                currentStep === 2 ? 'Select Doctor' :
                currentStep === 3 ? 'Choose Appointment Time' :
                currentStep === 4 ? 'Patient Information' : 'Health Questions & Confirmation'
              }
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close booking modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* STEP 1: Health Concern */}
          {currentStep === 1 && (
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                What would you like help with?
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Select the category that best matches your primary health concern.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {CATEGORIES.filter((c) => c.id !== 'more').map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      style={{
                        padding: '12px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--primary-light)' : 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '14px', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        {cat.name}
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '2px', lineHeight: 1.3 }}>
                        {cat.shortDescription}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.category && <p className="form-error">{errors.category}</p>}
            </div>
          )}

          {/* STEP 2: Doctor */}
          {currentStep === 2 && (
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                Choose a Doctor
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Review suitable professionals for your selected concern and choose who to consult with.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {displayDoctors.map((doc) => {
                  const isSelected = selectedDoctor?.id === doc.id;
                  const qualificationsStr = doc.qualifications?.map((q) => q.degree).join(', ') || doc.degree || 'MBBS';

                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      style={{
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        background: isSelected ? 'var(--primary-light)' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover'
                          }}
                         loading="lazy" decoding="async" />
                        <div>
                          <strong style={{ fontSize: '16px', color: 'var(--text-main)', display: 'block' }}>
                            {doc.name}
                          </strong>
                          <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                            {doc.specialty}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>
                            {qualificationsStr} • {doc.experience} years exp • {doc.location}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        {doc.isCredentialsVerified && (
                          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                            ✓ Verified
                          </span>
                        )}
                        <span style={{
                          display: 'inline-block',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid var(--primary)' : '2px solid var(--border-color)',
                          background: 'white'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.doctor && <p className="form-error">{errors.doctor}</p>}
            </div>
          )}

          {/* STEP 3: Appointment Date, Time & Timezone */}
          {currentStep === 3 && (
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                Select Appointment Date & Time
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Consulting with <strong>{selectedDoctor?.name}</strong> ({selectedDoctor?.specialty}).
              </p>

              {/* Timezone Selector (PRD Section 17) */}
              <div className="form-group">
                <label className="form-label">
                  <Globe size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Your Timezone:
                </label>
                <select
                  value={patientTz}
                  onChange={(e) => setPatientTz(e.target.value)}
                  className="form-select"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.id} value={tz.id}>
                      {tz.label} ({tz.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection Grid */}
              <div className="form-group">
                <label className="form-label">Available Dates:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
                  {upcomingDates.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDate(d.iso)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'var(--primary-light)' : 'white',
                          textAlign: 'center'
                        }}
                      >
                        <span style={{ fontSize: '11px', color: 'var(--text-subtle)', display: 'block' }}>{d.dayName}</span>
                        <strong style={{ fontSize: '13px', display: 'block', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                          {d.short}
                        </strong>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="form-group">
                <label className="form-label">Available Times:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                  {(selectedDoctor?.baseSlotTimesUTC || ['09:00', '11:00', '14:00', '16:00']).map((utcSlot) => {
                    const localTimeStr = convertSlotToPatientTime(utcSlot, patientTz, selectedDate);
                    const isSelected = selectedSlotUTC === utcSlot;

                    return (
                      <button
                        key={utcSlot}
                        type="button"
                        onClick={() => setSelectedSlotUTC(utcSlot)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'var(--primary)' : 'white',
                          color: isSelected ? 'white' : 'var(--text-main)',
                          fontWeight: 600,
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Clock size={13} />
                        <span>{localTimeStr}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.slot && <p className="form-error">{errors.slot}</p>}
              </div>

              <div style={{
                background: 'var(--bg-alt)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '13px',
                color: 'var(--text-muted)'
              }}>
                Consultation: <strong>Online video (30 mins)</strong> • Fee: <strong style={{ color: 'var(--success)' }}>{selectedDoctor?.consultationFee || 'Free'}</strong>
              </div>
            </div>
          )}

          {/* STEP 4: Patient Information (PRD Section 18) */}
          {currentStep === 4 && (
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                Patient Information
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Please provide the required contact details for your consultation.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    value={patientInfo.firstName}
                    onChange={(e) => handleInfoChange('firstName', e.target.value)}
                    className="form-input"
                    placeholder="e.g. Rahul"
                  />
                  {errors.firstName && <p className="form-error">{errors.firstName}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    value={patientInfo.lastName}
                    onChange={(e) => handleInfoChange('lastName', e.target.value)}
                    className="form-input"
                    placeholder="e.g. Sharma"
                  />
                  {errors.lastName && <p className="form-error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  value={patientInfo.email}
                  onChange={(e) => handleInfoChange('email', e.target.value)}
                  className="form-input"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    value={patientInfo.phone}
                    onChange={(e) => handleInfoChange('phone', e.target.value)}
                    className="form-input"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select
                    value={patientInfo.country}
                    onChange={(e) => handleInfoChange('country', e.target.value)}
                    className="form-select"
                  >
                    {TARGET_COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Age or Date of Birth *</label>
                  <input
                    type="text"
                    value={patientInfo.age}
                    onChange={(e) => handleInfoChange('age', e.target.value)}
                    className="form-input"
                    placeholder="e.g. 34 (or 1990-05-14)"
                  />
                  {errors.age && <p className="form-error">{errors.age}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Gender (Clinical/Operational)</label>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => handleInfoChange('gender', e.target.value)}
                    className="form-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Health Questions + Safety & Privacy (PRD Sections 19, 20 & 21) */}
          {currentStep === 5 && (
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                Health Information ({questionnaireConfig.title})
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                These questions help the healthcare professional prepare for your consultation. No automatic diagnosis is made.
              </p>

              {/* Dynamic Questions tailored per health concern */}
              {questionnaireConfig.questions.map((q) => (
                <div key={q.id} className="form-group">
                  <label className="form-label">
                    {q.label} {q.required && '*'}
                  </label>
                  {q.type === 'select' ? (
                    <select
                      value={healthAnswers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Please select an option --</option>
                      {q.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : q.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={healthAnswers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="form-textarea"
                      placeholder={q.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      value={healthAnswers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="form-input"
                      placeholder={q.placeholder}
                    />
                  )}
                  {errors[q.id] && <p className="form-error">{errors[q.id]}</p>}
                </div>
              ))}

              {/* PRD Section 20: Medical Safety Notice */}
              <div className="notice-box-emergency">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>Important Medical Safety Notice:</strong>
                    DoctorPlus is not an emergency medical service. If you are experiencing a medical emergency, severe symptoms or an immediate danger to your health, contact your local emergency service or seek urgent in-person medical care immediately. Do not submit emergency symptoms through this appointment form.
                  </div>
                </div>
              </div>

              {/* PRD Section 21: Privacy Notice & Agreement */}
              <div className="notice-box-privacy">
                <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>
                  Your information matters
                </strong>
                <p style={{ fontSize: '13px', marginBottom: '10px' }}>
                  We collect the information needed to arrange your consultation and provide the service. Please review our Privacy Policy before submitting sensitive health information.
                </p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    id="privacy-consent-checkbox"
                  />
                  <span>I agree to the Privacy Policy and Terms of Service.</span>
                </label>
                {errors.privacy && <p className="form-error">{errors.privacy}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {currentStep > 1 && (
            <button className="btn btn-secondary" onClick={handleBack}>
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {currentStep < 5 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleFinalSubmit} id="btn-confirm-appointment">
              Confirm Appointment <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
