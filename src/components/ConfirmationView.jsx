import React from 'react';
import {
  CheckCircle2, Calendar, Clock, Globe, Video, Download,
  ArrowRight, ArrowLeft
} from 'lucide-react';
import { generateIcsFile } from '../lib/storage';

export function ConfirmationView({
  appointment,
  onViewAppointment,
  onGoHome
}) {
  if (!appointment) return null;

  const handleDownloadCalendar = () => {
    generateIcsFile(appointment);
  };

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '640px' }}>
        <div style={{
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          {/* Success Check Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            border: '2px solid var(--success-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Appointment Confirmed
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Your consultation has been scheduled.
          </p>

          {/* Structured Appointment Details per PRD Section 22 */}
          <div style={{
            background: 'var(--bg-alt)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            textAlign: 'left',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Doctor:</span>
              <strong style={{ color: 'var(--text-main)', fontSize: '15px' }}>{appointment.doctorName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Specialty:</span>
              <strong style={{ color: 'var(--text-main)', fontSize: '15px' }}>{appointment.doctorSpecialty}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Date:</span>
              <strong style={{ color: 'var(--text-main)', fontSize: '15px' }}>{appointment.date}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Time:</span>
              <strong style={{ color: 'var(--text-main)', fontSize: '15px' }}>
                {appointment.timeFormatted} ({appointment.patientTimezone})
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Consultation:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '15px' }}>Online</strong>
            </div>
          </div>

          {/* PRD Section 22 Required Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={onViewAppointment}
              id="confirmation-view-appointment-btn"
            >
              View Appointment
            </button>

            <button
              className="btn btn-secondary btn-full"
              onClick={handleDownloadCalendar}
              id="confirmation-add-calendar-btn"
            >
              <Download size={16} /> Add to Calendar
            </button>

            <button
              className="btn btn-outline btn-full"
              onClick={onGoHome}
              id="confirmation-back-home-btn"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
