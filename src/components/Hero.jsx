import React from 'react';
import { ArrowRight, Star, Sparkles, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export function Hero({ onSelectCategory, onExploreConcerns, onStartBooking }) {
  const quickProblems = [
    { id: 'diabetes', label: 'Diabetes', categoryId: 'diabetes' },
    { id: 'joint-pain', label: 'Joint Pain', categoryId: 'bone-joint' },
    { id: 'stress', label: 'Stress', categoryId: 'mental-health' },
    { id: 'back-pain', label: 'Back Pain', categoryId: 'bone-joint' },
    { id: 'obesity', label: 'Obesity', categoryId: 'weight-management' },
    { id: 'cavities', label: 'Cavities', categoryId: 'dental' },
    { id: 'sexual-health', label: 'Sexual Health', categoryId: 'sexual-health' },
    { id: 'hair-fall', label: 'Hair Fall', categoryId: 'skin-hair' },
    { id: 'prostate', label: 'Prostate Issues', categoryId: 'prostate' },
    { id: 'gum-disease', label: 'Gum Disease', categoryId: 'dental' },
    { id: 'ear-ringing', label: 'Ear Ringing', categoryId: 'tinnitus-ear' },
    { id: 'slow-metabolism', label: 'Slow Metabolism', categoryId: 'weight-management' },
    { id: 'teeth-bleeding', label: 'Teeth Bleeding', categoryId: 'dental' },
    { id: 'skin-acne', label: 'Skin Acne', categoryId: 'skin-hair' },
    { id: 'yellow-teeth', label: 'Yellow Teeth', categoryId: 'dental' }
  ];

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

            {/* Quick Problem Pills */}
            <div className="bookdoc-quick-chips">
              <span className="chips-label">Common concerns:</span>
              {quickProblems.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => onSelectCategory(p.id)}
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
                alt="DoctorPlus certified medical specialist"
                className="bookdoc-hero-doctor-img"
                fetchPriority="high"
                decoding="async"
                width="460"
                height="390"
              />

              {/* Floating Social Proof Pill Badge */}
              <div className="bookdoc-floating-social-proof">
                <div className="avatar-cluster">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Patient 1" className="cluster-avatar" loading="lazy" decoding="async" width="36" height="36" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Patient 2" className="cluster-avatar" loading="lazy" decoding="async" width="36" height="36" />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" alt="Patient 3" className="cluster-avatar" loading="lazy" decoding="async" width="36" height="36" />
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="Patient 4" className="cluster-avatar" loading="lazy" decoding="async" width="36" height="36" />
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
          <div className="stat-number">1.8M</div>
          <div className="stat-label">Happy Clients</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-column">
          <div className="stat-number">12+</div>
          <div className="stat-label">Years of Experience</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-column">
          <div className="stat-number">45+</div>
          <div className="stat-label">Certified Doctors</div>
        </div>

        <div className="stat-divider" />

        <div className="stat-column">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Booking</div>
        </div>
      </div>
    </div>
  );
}
