import React, { useState } from 'react';
import { Search, ArrowRight, Star, Sparkles, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export function Hero({ onSearchSubmit, onSelectCategory, onExploreConcerns, onStartBooking }) {
  const [searchTerm, setSearchTerm] = useState('');

  const quickProblems = [
    { label: 'Joint Pain', categoryId: 'bone-joint' },
    { label: 'Tinnitus & Ear Ringing', categoryId: 'tinnitus-ear' },
    { label: 'Sexual Health', categoryId: 'sexual-health' },
    { label: 'Migraine & Nerves', categoryId: 'brain-nerve' },
    { label: 'Dental & Teeth', categoryId: 'dental' },
    { label: 'Weight Loss & Metabolism', categoryId: 'weight-management' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(searchTerm.trim());
  };

  return (
    <div className="bookdoc-hero-wrapper">
      {/* Exact BookDoc Rounded Hero Card with Mint-to-Cyan Gradient */}
      <section className="bookdoc-hero-card">
        <div className="bookdoc-hero-grid">
          {/* Left Text & CTA Column */}
          <div className="bookdoc-hero-left">
            <h1 className="bookdoc-hero-title">
              Book a Doctor <br />
              Anytime Anywhere
            </h1>

            <p className="bookdoc-hero-subtitle">
              Skip the waiting lines. Discover qualified doctors, pick your schedule, and get the care you deserve — anytime, anywhere.
            </p>

            {/* Free Consultations Highlight */}
            <div className="bookdoc-free-consult-badge">
              <span className="free-tag">100% FREE</span>
              <span>Online consultations with certified medical specialists</span>
            </div>

            {/* Search Input Bar */}
            <form className="bookdoc-quick-search-form" onSubmit={handleSubmit}>
              <div className="quick-search-input-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Enter any health problem or symptom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  id="bookdoc-hero-input"
                  aria-label="Search health concern or symptom"
                />
              </div>

              <div className="bookdoc-hero-btn-group">
                <button
                  type="submit"
                  className="bookdoc-pill-btn bookdoc-pill-primary"
                  id="btn-hero-find-doctor"
                >
                  <Search size={16} />
                  <span>Find a Doctor</span>
                </button>

                <button
                  type="button"
                  className="bookdoc-pill-btn bookdoc-pill-ghost"
                  onClick={onExploreConcerns}
                >
                  How it Works
                </button>
              </div>
            </form>

            {/* Quick Problem Pills */}
            <div className="bookdoc-quick-chips">
              <span className="chips-label">Common concerns:</span>
              {quickProblems.map((p) => (
                <button
                  key={p.categoryId}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => onSelectCategory(p.categoryId)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Doctor Visual Column with Overlapping Social Proof */}
          <div className="bookdoc-hero-right">
            <div className="doctor-image-container">
              {/* Doctor Cutout Image matching screenshot */}
              <img
                src="/hero-doctor.jpg"
                alt="BookDoc certified medical specialist"
                className="bookdoc-hero-doctor-img"
              />

              {/* Floating Social Proof Pill Badge */}
              <div className="bookdoc-floating-social-proof">
                <div className="avatar-cluster">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Patient 1" className="cluster-avatar" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Patient 2" className="cluster-avatar" />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" alt="Patient 3" className="cluster-avatar" />
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="Patient 4" className="cluster-avatar" />
                  <div className="cluster-more-badge">1M+</div>
                </div>
                <div className="social-proof-text">
                  <span className="proof-title">Trusted by millions of users.</span>
                  <div className="proof-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
                    ))}
                    <span className="proof-rating">4.9 / 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overlapping Floating Stats Bar matching exact screenshot */}
      <div className="bookdoc-floating-stats-card">
        <div className="stat-column">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Booking</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-column">
          <div className="stat-number">500+</div>
          <div className="stat-label">Doctors</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-column">
          <div className="stat-number">10+</div>
          <div className="stat-label">Experience</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-column">
          <div className="stat-number">120+</div>
          <div className="stat-label">Hospitals</div>
        </div>
      </div>
    </div>
  );
}
