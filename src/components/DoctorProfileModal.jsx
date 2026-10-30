import React from 'react';
import {
  X, Check, MapPin, Globe, Clock, Calendar, Star,
  GraduationCap, Briefcase, FileCheck, Stethoscope, Video
} from 'lucide-react';
import { convertSlotToPatientTime, getUpcomingDates } from '../lib/storage';

export function DoctorProfileModal({ doctor, onClose, onBookDoctor, patientTimezone }) {
  if (!doctor) return null;

  const upcomingDates = getUpcomingDates(0, 5);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope size={20} color="var(--primary)" />
            <h3 className="modal-title">Doctor Profile</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close profile modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Top Profile Summary */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '24px' }}>
            <img
              src={doctor.photo}
              alt={doctor.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                border: '1px solid var(--border-color)',
                flexShrink: 0
              }}
            />

            <div style={{ flex: 1, minWidth: '240px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '2px' }}>
                {doctor.name}
              </h2>
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
                {doctor.specialty} • {doctor.title}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span><strong>{doctor.experience} years</strong> experience</span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} /> {doctor.location}
                </span>
              </div>

              {/* Verification Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontWeight: 600 }}>
                {doctor.isIdentityVerified && (
                  <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} strokeWidth={3} /> Identity verified
                  </span>
                )}
                {doctor.isCredentialsVerified && (
                  <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} strokeWidth={3} /> Medical credentials verified
                  </span>
                )}
                {!doctor.isIdentityVerified && !doctor.isCredentialsVerified && (
                  <span style={{ color: '#64748b' }}>
                    Verification pending admin review
                  </span>
                )}
              </div>

              {/* Registration Info */}
              {doctor.medicalRegistration && (
                <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '6px' }}>
                  Registration: {doctor.medicalRegistration}
                </div>
              )}
            </div>
          </div>

          {/* Section: About the Doctor */}
          <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>About the Doctor</h4>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              {doctor.bio}
            </p>
          </div>

          {/* Section: Areas of Care */}
          {doctor.areasOfCare && doctor.areasOfCare.length > 0 && (
            <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>Areas of Care</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {doctor.areasOfCare.map((area, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--bg-alt)',
                      border: '1px solid var(--border-color)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '13px',
                      color: 'var(--text-main)'
                    }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section: Qualifications (Structured info per PRD Section 12) */}
          {doctor.qualifications && doctor.qualifications.length > 0 && (
            <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={16} /> Qualifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {doctor.qualifications.map((q, i) => (
                  <div key={i} style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{q.degree}</strong>
                    {' '}— {q.institution} ({q.year})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Professional History / Experience */}
          {doctor.professionalHistory && doctor.professionalHistory.length > 0 && (
            <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={16} /> Experience
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {doctor.professionalHistory.map((h, i) => (
                  <div key={i} style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{h.role}</strong>
                    {' '}• {h.organization} <span style={{ color: 'var(--text-subtle)' }}>({h.period})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Languages */}
          <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Languages Spoken</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {doctor.languages?.join(', ')}
            </p>
          </div>

          {/* Section: Consultation Information */}
          <div style={{
            background: 'var(--bg-alt)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Consultation Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Type</span>
                <strong>{doctor.consultationType || 'Online video consultation'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Duration</span>
                <strong>{doctor.consultationDuration || 30} minutes</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Consultation Fee</span>
                <strong style={{ color: 'var(--success)' }}>{doctor.consultationFee || 'Initial consultation: Free'}</strong>
              </div>
            </div>
          </div>

          {/* Section: Availability Calendar Preview */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} /> Upcoming Availability ({patientTimezone})
            </h4>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {upcomingDates.map((d, i) => (
                <div
                  key={d.iso}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    textAlign: 'center',
                    background: i === 0 ? 'var(--primary-light)' : 'white',
                    borderColor: i === 0 ? 'var(--primary)' : 'var(--border-color)',
                    minWidth: '95px'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-subtle)' }}>{d.dayName}</span>
                  <strong style={{ display: 'block', fontSize: '13px' }}>{d.short}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                    {doctor.baseSlotTimesUTC?.length || 4} slots
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onBookDoctor(doctor);
            }}
            id="modal-book-consultation-btn"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
