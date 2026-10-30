import React, { useState } from 'react';
import { MAJOR_PROBLEMS_MAP, INITIAL_DOCTORS } from '../data/healthcareData';
import { Search, Sparkles, UserCheck, ShieldCheck, CheckCircle2, Clock, Globe, ArrowRight, Stethoscope } from 'lucide-react';

export function ProblemDoctorMatcher({ onStartBooking, onViewDoctorProfile }) {
  const [selectedProblemId, setSelectedProblemId] = useState('back-joint-pain');
  const [customInput, setCustomInput] = useState('');
  const [assignedDoctorState, setAssignedDoctorState] = useState(null);

  // Active matched problem
  const currentProblem = MAJOR_PROBLEMS_MAP.find((p) => p.problemId === selectedProblemId) || MAJOR_PROBLEMS_MAP[0];
  const matchedDoctor = assignedDoctorState || INITIAL_DOCTORS.find((d) => d.id === currentProblem.doctorId) || INITIAL_DOCTORS[0];

  const handleSelectProblem = (problem) => {
    setSelectedProblemId(problem.problemId);
    setCustomInput('');
    const doc = INITIAL_DOCTORS.find((d) => d.id === problem.doctorId) || INITIAL_DOCTORS[0];
    setAssignedDoctorState(doc);
  };

  const handleCustomProblemSearch = (e) => {
    e.preventDefault();
    const query = customInput.trim().toLowerCase();
    if (!query) return;

    // Search against symptom keywords or problem names
    const found = MAJOR_PROBLEMS_MAP.find((p) =>
      p.problemName.toLowerCase().includes(query) ||
      p.symptoms.some((s) => s.toLowerCase().includes(query)) ||
      p.departmentName.toLowerCase().includes(query)
    );

    if (found) {
      setSelectedProblemId(found.problemId);
      const doc = INITIAL_DOCTORS.find((d) => d.id === found.doctorId) || INITIAL_DOCTORS[0];
      setAssignedDoctorState(doc);
    } else {
      // Pick a top-tier specialist based on hash or random from international roster
      const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const randomDoc = INITIAL_DOCTORS[hash % INITIAL_DOCTORS.length];
      setAssignedDoctorState(randomDoc);
    }
  };

  return (
    <section className="problem-matcher-section" id="problem-matcher">
      <div className="container">
        {/* Section Header */}
        <div className="matcher-header">
          <div className="matcher-pill-tag">
            <UserCheck size={14} />
            <span>Dedicated Doctor Matcher</span>
          </div>
          <h2 className="matcher-title">One Major Problem — One Dedicated Doctor</h2>
          <p className="matcher-subtitle">
            Skip the runaround between general practitioners. For any health problem, BookDoc pairs you directly with one dedicated, board-certified specialist for a 100% Free Online Consultation.
          </p>
        </div>

        {/* Custom Problem Input Box */}
        <form className="matcher-search-bar" onSubmit={handleCustomProblemSearch}>
          <div className="matcher-input-wrap">
            <Search size={18} className="matcher-search-icon" />
            <input
              type="text"
              placeholder="Type any health problem (e.g., knee arthritis, acid reflux, hair loss, migraine, sleep apnea)..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              aria-label="Enter specific health concern for doctor pairing"
            />
          </div>
          <button type="submit" className="matcher-match-btn">
            Match My Doctor
          </button>
        </form>

        {/* Quick Problem Selector Chips */}
        <div className="matcher-chips-row">
          {MAJOR_PROBLEMS_MAP.map((p) => {
            const isSelected = selectedProblemId === p.problemId && !customInput;
            return (
              <button
                key={p.problemId}
                type="button"
                className={`matcher-chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectProblem(p)}
              >
                <span>{p.problemName}</span>
              </button>
            );
          })}
        </div>

        {/* Result Card: Matched Dedicated Doctor for this problem */}
        <div className="matcher-doctor-card">
          <div className="matcher-card-header">
            <div className="matcher-header-left">
              <span className="problem-assigned-label">Current Health Problem:</span>
              <strong className="problem-assigned-name">
                {customInput ? `"${customInput}"` : currentProblem.problemName}
              </strong>
            </div>
            <div className="matcher-header-right">
              <span className="free-consultation-banner">
                100% Free Video Consultation ($0.00)
              </span>
            </div>
          </div>

          <div className="matcher-card-body">
            {/* Doctor Photo & Badges */}
            <div className="matcher-doc-avatar-wrap">
              <img
                src={matchedDoctor.photo}
                alt={matchedDoctor.name}
                className="matcher-doc-avatar"
              />
              <div className="verified-badge-pill">
                <ShieldCheck size={13} />
                <span>Verified Specialist</span>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="matcher-doc-info">
              <div className="doc-headline-row">
                <h3 className="doc-name-heading">{matchedDoctor.name}</h3>
                <span className="country-location-badge">
                  Verified Specialist • {matchedDoctor.specialty}
                </span>
              </div>

              <p className="doc-title-text">{matchedDoctor.title}</p>

              {/* Qualifications & Medical Council */}
              <div className="doc-qualifications-list">
                {matchedDoctor.qualifications.map((q, idx) => (
                  <span key={idx} className="qualification-chip">
                    🎓 {q.degree} — {q.institution}
                  </span>
                ))}
              </div>

              {/* Bio summary */}
              <p className="doc-bio-excerpt">{matchedDoctor.bio}</p>

              {/* Areas of care tags */}
              <div className="doc-care-tags">
                <span className="tags-label">Covers:</span>
                {matchedDoctor.areasOfCare.slice(0, 4).map((area, i) => (
                  <span key={i} className="care-tag">✓ {area}</span>
                ))}
              </div>
            </div>

            {/* Booking & Action Side Card */}
            <div className="matcher-doc-actions-box">
              <div className="booking-urgency-note">
                <Clock size={15} />
                <span>Available Today for Online Video Consultation</span>
              </div>

              <div className="price-tag-row">
                <div className="price-text">
                  <span className="price-old">$180.00</span>
                  <span className="price-free">FREE</span>
                </div>
                <span className="price-sub">Sponsored Healthcare Consultation</span>
              </div>

              <button
                type="button"
                className="book-free-btn"
                onClick={() => onStartBooking(matchedDoctor.categoryId, matchedDoctor)}
                id="btn-matcher-book-free"
              >
                <span>Book Free Consultation</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="view-profile-btn"
                onClick={() => onViewDoctorProfile(matchedDoctor)}
              >
                View Credentials & Full Bio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
