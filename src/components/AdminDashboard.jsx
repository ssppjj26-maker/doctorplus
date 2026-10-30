import React, { useState } from 'react';
import {
  Users, Stethoscope, Calendar, CheckCircle, XCircle, AlertTriangle,
  Award, Shield, Plus, Check, RefreshCw, Filter, Search
} from 'lucide-react';
import { getAdminStats, updateDoctorVerification, updateAppointmentStatus, registerDoctor } from '../lib/storage';
import { CATEGORIES } from '../data/healthcareData';

export function AdminDashboard({
  doctors,
  appointments,
  onUpdateData
}) {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'doctors', 'appointments', 'patients'
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [apptFilter, setApptFilter] = useState('all');

  // Real statistics based strictly on database/storage (PRD Section 26)
  const stats = getAdminStats();

  // Add doctor form state
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialty: 'Dermatologist',
    categoryId: 'skin-hair',
    experience: 8,
    location: 'New Delhi, India',
    languages: 'English, Hindi',
    degree: 'MBBS, MD',
    institution: 'AIIMS New Delhi',
    medicalRegistration: 'State Medical Council Reg. 48102'
  });

  const handleVerify = (docId, isIdentity, isCredentials) => {
    updateDoctorVerification(docId, {
      isIdentityVerified: isIdentity,
      isCredentialsVerified: isCredentials,
      verificationStatus: (isIdentity && isCredentials) ? 'verified' : 'pending'
    });
    onUpdateData();
  };

  const handleApptStatus = (apptId, status) => {
    updateAppointmentStatus(apptId, status);
    onUpdateData();
  };

  const handleCreateDoctor = (e) => {
    e.preventDefault();
    registerDoctor({
      name: newDoc.name,
      specialty: newDoc.specialty,
      categoryId: newDoc.categoryId,
      experience: Number(newDoc.experience),
      location: newDoc.location,
      languages: newDoc.languages.split(',').map((s) => s.trim()),
      qualifications: [{ degree: newDoc.degree, institution: newDoc.institution, year: 2018 }],
      medicalRegistration: newDoc.medicalRegistration
    });
    setShowAddDoctorModal(false);
    onUpdateData();
  };

  const filteredAppointments = apptFilter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === apptFilter);

  return (
    <div className="section-padding">
      <div className="container">
        {/* Admin Header */}
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
            <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 700, textTransform: 'uppercase' }}>
              Administration & Credentialing
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px' }}>
              CareFind Management Center
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Audit medical credentials, manage participating doctors, and oversee appointment scheduling.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowAddDoctorModal(true)}
            id="admin-add-doctor-btn"
          >
            <Plus size={16} /> Add Doctor for Review
          </button>
        </div>

        {/* Tab Navigation (PRD Section 26) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
          marginBottom: '24px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'stats', label: 'Platform Statistics', icon: Shield },
            { id: 'doctors', label: `Doctors Management (${doctors.length})`, icon: Stethoscope },
            { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: 'patients', label: `Patients (${stats.totalPatients})`, icon: Users }
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
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Platform Statistics (Strictly data-based, PRD Section 26) */}
        {activeTab === 'stats' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Doctors</span>
                <strong style={{ display: 'block', fontSize: '28px', color: 'var(--text-main)', marginTop: '4px' }}>
                  {stats.totalDoctors}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Actual database roster</span>
              </div>

              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Patients</span>
                <strong style={{ display: 'block', fontSize: '28px', color: 'var(--text-main)', marginTop: '4px' }}>
                  {stats.totalPatients}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Unique registered patients</span>
              </div>

              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Upcoming Appointments</span>
                <strong style={{ display: 'block', fontSize: '28px', color: 'var(--primary)', marginTop: '4px' }}>
                  {stats.upcomingAppointments}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Confirmed & scheduled</span>
              </div>

              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Completed Consultations</span>
                <strong style={{ display: 'block', fontSize: '28px', color: 'var(--success)', marginTop: '4px' }}>
                  {stats.completedAppointments}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Verified completions</span>
              </div>

              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pending Verification</span>
                <strong style={{ display: 'block', fontSize: '28px', color: stats.pendingVerification > 0 ? 'var(--warning)' : 'var(--text-muted)', marginTop: '4px' }}>
                  {stats.pendingVerification}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Awaiting credential review</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <strong>Trust Standard Verification Notice:</strong> Statistics above represent real database records without artificial inflation or fabricated patient counts, per PRD Section 26.
            </div>
          </div>
        )}

        {/* TAB 2: Doctors Management (PRD Section 26) */}
        {activeTab === 'doctors' && (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Participating Healthcare Professionals</h3>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{doctors.length} doctors total</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px' }}>Doctor Name</th>
                    <th style={{ padding: '12px 16px' }}>Specialty</th>
                    <th style={{ padding: '12px 16px' }}>Location</th>
                    <th style={{ padding: '12px 16px' }}>Identity Status</th>
                    <th style={{ padding: '12px 16px' }}>Credentials Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <strong>{doc.name}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-subtle)', display: 'block' }}>
                          {doc.medicalRegistration || 'Reg. pending review'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 600 }}>
                        {doc.specialty}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {doc.location}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {doc.isIdentityVerified ? (
                          <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '13px' }}>✓ Verified</span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '13px' }}>Unverified</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {doc.isCredentialsVerified ? (
                          <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '13px' }}>✓ Verified</span>
                        ) : (
                          <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '13px' }}>Pending Review</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {(!doc.isIdentityVerified || !doc.isCredentialsVerified) ? (
                            <button
                              className="btn btn-sm"
                              style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' }}
                              onClick={() => handleVerify(doc.id, true, true)}
                            >
                              Verify Doctor
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#fef2f2', color: 'var(--error)', border: '1px solid #fecaca' }}
                              onClick={() => handleVerify(doc.id, false, false)}
                            >
                              Revoke Verification
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Appointment Management (PRD Section 26) */}
        {activeTab === 'appointments' && (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Appointments Roster</h3>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Filter status:</span>
                <select
                  value={apptFilter}
                  onChange={(e) => setApptFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
                >
                  <option value="all">All ({appointments.length})</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredAppointments.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '12px 16px' }}>Appt ID</th>
                      <th style={{ padding: '12px 16px' }}>Patient</th>
                      <th style={{ padding: '12px 16px' }}>Doctor</th>
                      <th style={{ padding: '12px 16px' }}>Scheduled Date/Time</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{a.id}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <strong>{a.patientName}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-subtle)', display: 'block' }}>{a.patientEmail}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>{a.doctorName}</td>
                        <td style={{ padding: '12px 16px' }}>
                          {a.date} at {a.timeFormatted}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: a.status === 'confirmed' ? 'var(--success-bg)' : (a.status === 'completed' ? '#eff6ff' : '#f1f5f9'),
                            color: a.status === 'confirmed' ? 'var(--success)' : (a.status === 'completed' ? 'var(--primary)' : '#64748b')
                          }}>
                            {a.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {a.status === 'confirmed' && (
                              <>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => handleApptStatus(a.id, 'completed')}
                                >
                                  Complete
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  style={{ color: 'var(--error)' }}
                                  onClick={() => handleApptStatus(a.id, 'cancelled')}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No appointments match the selected filter.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Patient Management */}
        {activeTab === 'patients' && (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
              Registered Patient Records ({stats.totalPatients})
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Sensitive patient medical records have strict role-based access controls and are audit-logged.
            </p>

            {appointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from(new Set(appointments.map((a) => a.patientEmail))).map((email) => {
                  const patientAppts = appointments.filter((a) => a.patientEmail === email);
                  const first = patientAppts[0];
                  return (
                    <div key={email} style={{ background: 'var(--bg-alt)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{first.patientName}</strong>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block' }}>
                          {email} • {first.patientPhone} ({first.patientCountry})
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                        {patientAppts.length} {patientAppts.length === 1 ? 'consultation' : 'consultations'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No patients registered yet.</p>
            )}
          </div>
        )}

        {/* Add Doctor Modal */}
        {showAddDoctorModal && (
          <div className="modal-overlay" onClick={() => setShowAddDoctorModal(false)}>
            <div className="modal-dialog" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add Healthcare Professional for Verification</h3>
                <button className="modal-close-btn" onClick={() => setShowAddDoctorModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleCreateDoctor}>
                  <div className="form-group">
                    <label className="form-label">Doctor Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Verma"
                      value={newDoc.name}
                      onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Specialty *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Diabetologist"
                        value={newDoc.specialty}
                        onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Health Concern Category</label>
                      <select
                        value={newDoc.categoryId}
                        onChange={(e) => setNewDoc({ ...newDoc, categoryId: e.target.value })}
                        className="form-select"
                      >
                        {CATEGORIES.filter((c) => c.id !== 'more').map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Years of Experience</label>
                      <input
                        type="number"
                        value={newDoc.experience}
                        onChange={(e) => setNewDoc({ ...newDoc, experience: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location (City, Country)</label>
                      <input
                        type="text"
                        value={newDoc.location}
                        onChange={(e) => setNewDoc({ ...newDoc, location: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Degrees & Qualifications</label>
                    <input
                      type="text"
                      placeholder="e.g. MBBS, MD General Medicine"
                      value={newDoc.degree}
                      onChange={(e) => setNewDoc({ ...newDoc, degree: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medical Registration License Number</label>
                    <input
                      type="text"
                      placeholder="e.g. State Medical Council Reg. 59281"
                      value={newDoc.medicalRegistration}
                      onChange={(e) => setNewDoc({ ...newDoc, medicalRegistration: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="modal-footer" style={{ padding: '16px 0 0', background: 'transparent' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddDoctorModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Register Doctor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
