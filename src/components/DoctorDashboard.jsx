import React, { useState } from 'react';
import {
  Calendar, Clock, Video, FileText, CheckCircle, XCircle,
  User, Check, AlertCircle, Stethoscope, Save
} from 'lucide-react';
import { updateAppointmentStatus, updateDoctorProfile } from '../lib/storage';

export function DoctorDashboard({
  doctor,
  appointments,
  onJoinRoom,
  onUpdateAppt
}) {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'availability', 'profile', 'qualifications'
  const [selectedAppt, setSelectedAppt] = useState(appointments[0] || null);

  // Profile Edit State
  const [bio, setBio] = useState(doctor?.bio || '');
  const [fee, setFee] = useState(doctor?.consultationFee || 'Free (Demo preview)');
  const [newQualification, setNewQualification] = useState({ degree: '', institution: '', year: '' });
  const [saveToast, setSaveToast] = useState(false);

  const docAppts = appointments.filter(
    (a) => !doctor || a.doctorId === doctor.id || a.doctorName === doctor.name
  );

  const handleStatusChange = (apptId, status) => {
    updateAppointmentStatus(apptId, status);
    onUpdateAppt();
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!doctor) return;
    updateDoctorProfile(doctor.id, {
      bio,
      consultationFee: fee
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
    onUpdateAppt();
  };

  const handleAddQualification = (e) => {
    e.preventDefault();
    if (!newQualification.degree || !doctor) return;
    const currentQuals = doctor.qualifications || [];
    updateDoctorProfile(doctor.id, {
      qualifications: [...currentQuals, { ...newQualification, year: Number(newQualification.year) || 2024 }]
    });
    setNewQualification({ degree: '', institution: '', year: '' });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
    onUpdateAppt();
  };

  return (
    <div className="section-padding">
      <div className="container">
        {/* Banner */}
        <div style={{
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 700, textTransform: 'uppercase' }}>
                Doctor Portal
              </span>
              {doctor?.isCredentialsVerified ? (
                <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
                  ✓ Admin Verified
                </span>
              ) : (
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  Verification Pending Admin Review
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 700 }}>
              {doctor?.name || 'Dr. Sarah Patel'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {doctor?.specialty || 'Dermatology'} • {doctor?.location || 'Ahmedabad, India'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-color)', padding: '10px 18px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', display: 'block' }}>Upcoming Visits</span>
              <strong style={{ fontSize: '18px', color: 'var(--primary)' }}>
                {docAppts.filter((a) => a.status === 'confirmed').length}
              </strong>
            </div>
            <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-color)', padding: '10px 18px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', display: 'block' }}>Completed</span>
              <strong style={{ fontSize: '18px', color: 'var(--success)' }}>
                {docAppts.filter((a) => a.status === 'completed').length}
              </strong>
            </div>
          </div>
        </div>

        {saveToast && (
          <div style={{
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--success)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            ✓ Doctor details saved successfully!
          </div>
        )}

        {/* Tab Navigation (PRD Section 25) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
          marginBottom: '24px'
        }}>
          {[
            { id: 'appointments', label: `Appointments (${docAppts.length})`, icon: Calendar },
            { id: 'profile', label: 'Manage Profile & Bio', icon: FileText },
            { id: 'qualifications', label: 'Qualifications & Verification', icon: Stethoscope }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Appointments Queue */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Queue List */}
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>Consultation Requests</h3>
              {docAppts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {docAppts.map((appt) => {
                    const isSelected = selectedAppt?.id === appt.id;
                    return (
                      <div
                        key={appt.id}
                        onClick={() => setSelectedAppt(appt)}
                        style={{
                          background: 'white',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '15px' }}>{appt.patientName}</strong>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: appt.status === 'confirmed' ? 'var(--success-bg)' : '#f1f5f9',
                            color: appt.status === 'confirmed' ? 'var(--success)' : '#64748b'
                          }}>
                            {appt.status.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {appt.date} • {appt.timeFormatted} ({appt.patientTimezone})
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No appointments queued</h3>
                  <p>When patients book a consultation, it will appear here.</p>
                </div>
              )}
            </div>

            {/* Selected Appointment Details */}
            {selectedAppt && (
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px' }}>
                  Appointment Details ({selectedAppt.id})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Patient</span>
                    <strong>{selectedAppt.patientName}</strong> ({selectedAppt.patientAge} yrs, {selectedAppt.patientGender})
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Contact</span>
                    {selectedAppt.patientEmail} • {selectedAppt.patientPhone} ({selectedAppt.patientCountry})
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Scheduled For</span>
                    <strong>{selectedAppt.date} at {selectedAppt.timeFormatted} ({selectedAppt.patientTimezone})</strong>
                  </div>
                </div>

                {selectedAppt.healthAnswers && Object.keys(selectedAppt.healthAnswers).length > 0 && (
                  <div style={{ marginBottom: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Health Questionnaire Responses:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(selectedAppt.healthAnswers).map(([k, v]) => (
                        <div key={k} style={{ background: 'var(--bg-alt)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-subtle)', display: 'block', textTransform: 'capitalize' }}>{k.replace('_', ' ')}</span>
                          <strong>{v}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Controls (PRD Section 25) */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onJoinRoom(selectedAppt)}
                  >
                    <Video size={14} /> Join Video Consultation
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleStatusChange(selectedAppt.id, 'completed')}
                  >
                    Mark Completed
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--error)' }}
                    onClick={() => handleStatusChange(selectedAppt.id, 'cancelled')}
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Manage Profile & Bio */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '28px', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Edit Professional Profile</h3>

            <div className="form-group">
              <label className="form-label">Professional Biography</label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-textarea"
                placeholder="Share your clinical focus, specialty areas and approach to patient care..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Pricing</label>
              <input
                type="text"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="form-input"
                placeholder="e.g. Free (Initial consultation) or $40 / 30 mins"
              />
              <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                Must be clearly and transparently displayed to patients with no hidden fees.
              </span>
            </div>

            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </form>
        )}

        {/* TAB 3: Qualifications & Verification Status */}
        {activeTab === 'qualifications' && (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '28px', maxWidth: '680px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Qualifications & Verification Status
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Doctors must not be able to falsely mark themselves as verified. Verification status is controlled strictly by administrators after document auditing.
            </p>

            <div style={{
              background: doctor?.isCredentialsVerified ? 'var(--success-bg)' : '#f8fafc',
              border: `1px solid ${doctor?.isCredentialsVerified ? 'var(--success-border)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <strong>Status: {doctor?.isCredentialsVerified ? 'Verified Healthcare Professional' : 'Verification Pending Admin Review'}</strong>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Identity Verified: {doctor?.isIdentityVerified ? '✓ Yes' : 'Pending review'}<br />
                Credentials Verified: {doctor?.isCredentialsVerified ? '✓ Yes' : 'Pending review'}
              </div>
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Current Qualifications</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {doctor?.qualifications?.map((q, i) => (
                <div key={i} style={{ background: 'var(--bg-alt)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}>
                  <strong>{q.degree}</strong> — {q.institution} ({q.year})
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Upload / Add New Qualification</h4>
            <form onSubmit={handleAddQualification} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Degree / Certificate (e.g. MD Endocrinology)"
                value={newQualification.degree}
                onChange={(e) => setNewQualification({ ...newQualification, degree: e.target.value })}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Institution / Medical College"
                value={newQualification.institution}
                onChange={(e) => setNewQualification({ ...newQualification, institution: e.target.value })}
                className="form-input"
                required
              />
              <input
                type="number"
                placeholder="Year of Completion (e.g. 2018)"
                value={newQualification.year}
                onChange={(e) => setNewQualification({ ...newQualification, year: e.target.value })}
                className="form-input"
                required
              />
              <button type="submit" className="btn btn-secondary" style={{ width: 'fit-content' }}>
                + Submit Qualification for Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
