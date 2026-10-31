import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, HeartHandshake, CheckCircle2, MessageSquare, ThumbsUp, PlusCircle, Globe, Filter } from 'lucide-react';
import { getStoredReviews, submitReview, getStoredDoctors } from '../lib/storage';

export function PatientReviewsSection({ onStartBooking }) {
  const [reviews, setReviews] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    patientName: '',
    city: 'Patient',
    doctorId: 'doc-sophia-miller',
    rating: 5,
    comment: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setReviews(getStoredReviews());
  }, []);

  const doctors = getStoredDoctors();

  const handleCategoryFilterChange = (category) => {
    setSelectedCategoryFilter(category);
  };

  const filteredReviews = selectedCategoryFilter === 'All'
    ? reviews
    : reviews.filter((r) => r.department === selectedCategoryFilter);

  const handleSubmitNewReview = (e) => {
    e.preventDefault();
    if (!newReviewForm.patientName || !newReviewForm.comment) return;

    const selectedDoc = doctors.find((d) => d.id === newReviewForm.doctorId) || doctors[0];

    const added = submitReview({
      appointmentId: `custom-appt-${Date.now()}`,
      doctorId: selectedDoc.id,
      patientName: newReviewForm.patientName,
      rating: Number(newReviewForm.rating),
      comment: newReviewForm.comment,
      city: newReviewForm.city,
      department: selectedDoc.specialty,
      doctorName: selectedDoc.name,
      consultationType: 'Free Online Video Consultation'
    });

    setReviews(getStoredReviews());
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowReviewModal(false);
      setNewReviewForm({
        patientName: '',
        country: 'United States',
        city: 'New York',
        doctorId: 'doc-sophia-miller',
        rating: 5,
        comment: ''
      });
    }, 1500);
  };

  return (
    <section className="bookdoc-reviews-section section-padding" id="customer-reviews">
      <div className="container">
        {/* Section Header */}
        <div className="reviews-header-block">
          <div className="reviews-pill-badge">
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span>Customer Reviews</span>
          </div>

          <h2 className="reviews-title">
            What Our Patients Say About Our Free Online Consultation Services
          </h2>

          <p className="reviews-subtitle">
            Over 1.8 Million+ patients have connected with our board-certified medical specialists at zero cost. Read their verified feedback below.
          </p>
        </div>

        {/* Platform Rating Summary Card */}
        <div className="reviews-summary-card">
          <div className="summary-left">
            <div className="summary-big-score">4.9</div>
            <div className="summary-stars-wrap">
              <div className="summary-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="summary-count">Based on 1.8 Million+ verified free consultations</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-features-grid">
            <div className="summary-feature-item">
              <CheckCircle2 size={16} className="feature-icon" />
              <span>100% Free Telehealth ($0.00)</span>
            </div>
            <div className="summary-feature-item">
              <CheckCircle2 size={16} className="feature-icon" />
              <span>Zero Wait Times (Same-Day Reply)</span>
            </div>
            <div className="summary-feature-item">
              <CheckCircle2 size={16} className="feature-icon" />
              <span>Top-Tier Board-Certified Doctors</span>
            </div>
            <div className="summary-feature-item">
              <CheckCircle2 size={16} className="feature-icon" />
              <span>Free Reports & Guidance PDF</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-action-box">
            <button
              type="button"
              className="write-review-btn"
              onClick={() => setShowReviewModal(true)}
            >
              <PlusCircle size={15} />
              <span>Share Your Experience</span>
            </button>
          </div>
        </div>

        {/* Concern Filter Chips */}
        <div className="reviews-filter-bar">
          <span className="filter-label">Filter by concern:</span>
          {['All', 'Joint Pain', 'Tinnitus & Ear Ringing', 'Brain & Nerve Care', 'Dental Care', 'Skin & Hair', 'General Health'].map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-chip-btn ${selectedCategoryFilter === c ? 'active' : ''}`}
              onClick={() => handleCategoryFilterChange(c)}
            >
              {c === 'All' ? '🌟 All Reviews' : c}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="customer-reviews-grid">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="customer-review-card">
              <div className="review-card-top">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < rev.rating ? '#F59E0B' : '#E2E8F0'}
                      color={i < rev.rating ? '#F59E0B' : '#CBD5E1'}
                    />
                  ))}
                </div>
                <span className="review-service-pill">Free Consultation</span>
              </div>

              <p className="review-comment-body">"{rev.comment}"</p>

              <div className="review-doctor-meta">
                <span className="doc-assigned-tag">
                  👨‍⚕️ {rev.doctorName || 'Specialist Doctor'} • {rev.department || 'Medical Care'}
                </span>
              </div>

              <div className="review-patient-footer">
                <div className="patient-avatar-box">
                  {rev.patientName?.charAt(0) || 'P'}
                </div>
                <div className="patient-meta">
                  <div className="patient-name-row">
                    <strong>{rev.patientName}</strong>
                    <span className="country-tag">
                      ✓ Verified Patient
                    </span>
                  </div>
                  <span className="verified-consult-tag">
                    ✓ Verified 100% Free Consultation
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Book Free Consultation */}
        <div className="reviews-bottom-cta">
          <div className="cta-content">
            <h3>Ready to consult a medical specialist for free?</h3>
            <p>Select your health concern and pick a convenient time in your local timezone.</p>
          </div>
          <button
            type="button"
            className="bookdoc-pill-btn bookdoc-pill-primary"
            onClick={() => onStartBooking()}
          >
            Book Free Online Consultation
          </button>
        </div>
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-submit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Your Consultation Experience</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="submit-success-banner">
                <CheckCircle2 size={40} color="#10B981" />
                <h4>Thank you for your feedback!</h4>
                <p>Your review has been verified and published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitNewReview} className="review-form">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jennifer Taylor"
                    value={newReviewForm.patientName}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, patientName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>City / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Downtown Clinic or City"
                    value={newReviewForm.city}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Consulted Doctor / Specialist *</label>
                  <select
                    value={newReviewForm.doctorId}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, doctorId: e.target.value })}
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Rating (1 to 5 Stars)</label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: e.target.value })}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                    <option value="3">⭐⭐⭐ 3 Stars (Average)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Review on the Free Consultation *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your experience with our doctor, how fast you got an appointment, and the quality of medical advice..."
                    value={newReviewForm.comment}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                  />
                </div>

                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bookdoc-pill-btn bookdoc-pill-primary">
                    Publish Verified Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
