import React from 'react';
import { Check, ArrowRight, Clock, MapPin, Globe, Star } from 'lucide-react';
import { convertSlotToPatientTime } from '../lib/storage';

export function FeaturedDoctorsSection({
  doctors,
  onViewDoctorProfile,
  onBookDoctor,
  patientTimezone,
  onExploreAll
}) {
  // Show first 4 verified doctors as featured
  const featured = doctors.slice(0, 4);

  return (
    <section className="section-padding" id="featured-doctors">
      <div className="container">
        <div className="section-header">
          <h2>Healthcare Professionals, Clearly Presented</h2>
          <p>
            Review qualifications, experience, languages, and transparent consultation details before booking.
          </p>
        </div>

        <div className="doctors-grid">
          {featured.map((doc) => {
            const qualificationsStr = doc.qualifications?.map((q) => q.degree).join(', ') || doc.degree || 'MBBS';
            const nextSlotFormatted = doc.baseSlotTimesUTC?.[0]
              ? convertSlotToPatientTime(doc.baseSlotTimesUTC[0], patientTimezone)
              : 'Tomorrow, 10:00 AM';

            return (
              <div key={doc.id} className="doctor-card">
                <div>
                  <div className="doctor-card-top">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="doctor-photo"
                      loading="lazy"
                    />

                    <div className="doctor-info-col">
                      <div className="doctor-name-row">
                        <h3 className="doctor-name">{doc.name}</h3>
                      </div>
                      <div className="doctor-specialty">{doc.specialty}</div>
                      <div className="doctor-qual-text">{qualificationsStr}</div>

                      <div className="doctor-meta-items">
                        <span><strong>{doc.experience} years</strong> experience</span>
                        <span>•</span>
                        <span>{doc.languages?.join(' • ')}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <MapPin size={13} />
                        <span>{doc.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating display (Strictly honest: only if real reviews exist) */}
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {doc.rating ? (
                      <>
                        <span style={{ color: '#eab308', display: 'inline-flex', alignItems: 'center' }}>
                          <Star size={14} fill="#eab308" />
                        </span>
                        <strong>{doc.rating}</strong>
                        <span>({doc.reviewCount} {doc.reviewCount === 1 ? 'verified review' : 'verified reviews'})</span>
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-subtle)' }}>No reviews yet • Be the first to review</span>
                    )}
                  </div>

                  {/* Verification Status (Only display if actually verified by admin) */}
                  <div className="doctor-verification-strip">
                    {doc.isIdentityVerified && (
                      <span className="badge-verified">
                        <Check size={14} strokeWidth={3} /> Identity verified
                      </span>
                    )}
                    {doc.isCredentialsVerified && (
                      <span className="badge-verified">
                        <Check size={14} strokeWidth={3} /> Medical credentials verified
                      </span>
                    )}
                    {!doc.isIdentityVerified && !doc.isCredentialsVerified && (
                      <span className="badge-pending">
                        Verification pending admin review
                      </span>
                    )}
                  </div>
                </div>

                <div className="doctor-card-actions">
                  <div className="doctor-availability-info">
                    <span>Next available:</span>
                    <strong>Today, {nextSlotFormatted}</strong>
                  </div>

                  <div className="doctor-btn-group">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onViewDoctorProfile(doc)}
                      id={`btn-view-profile-${doc.id}`}
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onBookDoctor(doc)}
                      id={`btn-book-${doc.id}`}
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button className="btn btn-secondary" onClick={onExploreAll}>
            Browse All Healthcare Professionals <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
