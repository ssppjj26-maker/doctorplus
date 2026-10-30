import React from 'react';
import {
  ArrowLeft, ArrowRight, ShieldAlert, Check, MapPin,
  Calendar, Star, Stethoscope, AlertTriangle
} from 'lucide-react';
import { CATEGORIES } from '../data/healthcareData';
import { convertSlotToPatientTime } from '../lib/storage';

export function HealthConcernPage({
  categorySlug,
  doctors,
  onBack,
  onBookDoctor,
  onViewDoctorProfile,
  patientTimezone
}) {
  const category = CATEGORIES.find((c) => c.slug === categorySlug || c.id === categorySlug) || CATEGORIES[0];
  const matchingDoctors = doctors.filter((d) => d.categoryId === category.id);

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Back Link */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} /> Back to Health Concerns
        </button>

        {/* 1. Hero Section (PRD Section 27) */}
        <div style={{
          background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          marginBottom: '36px'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            Health Concern Area
          </span>
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>
            {category.name}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '680px', marginBottom: '24px' }}>
            {category.shortDescription}
          </p>

          <a href="#relevant-doctors" className="btn btn-primary btn-lg">
            Find a Doctor <ArrowRight size={16} />
          </a>
        </div>

        {/* 2. What this area covers (PRD Section 27) */}
        <div style={{
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '22px', marginBottom: '12px' }}>What this area covers</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.6 }}>
            {category.fullDescription}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {category.covers?.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: 'var(--bg-alt)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  color: 'var(--text-main)'
                }}
              >
                <Check size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
            * This educational information is for reference and does not constitute an automated medical diagnosis.
          </div>
        </div>

        {/* 3. When to seek urgent care (PRD Section 27) */}
        {category.urgentCareSymptoms && category.urgentCareSymptoms.length > 0 && (
          <div style={{
            background: 'var(--error-bg)',
            border: '1px solid var(--error-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
            marginBottom: '36px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', marginBottom: '8px' }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--error)' }}>
                When to seek urgent care
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '14px' }}>
              Online consultations are for elective health guidance. Seek immediate emergency care if you experience:
            </p>

            <ul style={{ paddingLeft: '20px', color: '#991b1b', fontSize: '14px', lineHeight: 1.6 }}>
              {category.urgentCareSymptoms.map((sym, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>{sym}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. Find a Doctor (Relevant Professionals) */}
        <div id="relevant-doctors">
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Participating Doctors in {category.name}
          </h2>

          {matchingDoctors.length > 0 ? (
            <div className="doctors-grid">
              {matchingDoctors.map((doc) => {
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
                        />
                        <div className="doctor-info-col">
                          <h3 className="doctor-name">{doc.name}</h3>
                          <div className="doctor-specialty">{doc.specialty}</div>
                          <div className="doctor-meta-items">
                            <span><strong>{doc.experience} years</strong> exp</span>
                            <span>•</span>
                            <span>{doc.languages?.join(' • ')}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <MapPin size={13} /> {doc.location}
                          </div>
                        </div>
                      </div>

                      <div className="doctor-verification-strip">
                        {doc.isCredentialsVerified ? (
                          <span className="badge-verified">✓ Medical credentials verified</span>
                        ) : (
                          <span className="badge-pending">Verification pending admin review</span>
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
                        >
                          View Profile
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onBookDoctor(doc)}
                        >
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No doctors listed in this specific category yet</h3>
              <p>You can browse all healthcare professionals across other specialties.</p>
              <button className="btn btn-primary" onClick={onBack}>
                Browse All Doctors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
