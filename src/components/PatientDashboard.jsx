import React, { useState } from 'react';
import {
  Calendar, Clock, Video, User, FileText, Bell,
  Settings, Shield, XCircle, RotateCcw, CheckCircle,
  AlertTriangle, Star, ArrowRight, MessageSquare
} from 'lucide-react';
import { submitReview } from '../lib/storage';

export function PatientDashboard({
  appointments,
  onJoinRoom,
  onReschedule,
  onCancel,
  onStartNewBooking
}) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'profile', 'health', 'notifications', 'privacy'
  const [reviewModalAppt, setReviewModalAppt] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const upcomingAppts = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );
  const pastAppts = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewModalAppt || !reviewComment.trim()) return;

    submitReview({
      appointmentId: reviewModalAppt.id,
      doctorId: reviewModalAppt.doctorId,
      patientName: reviewModalAppt.patientName || 'Verified Patient',
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalAppt(null);
      setReviewComment('');
    }, 2000);
  };

  return (
    <div className="section-padding">
      <div className="container">
        {/* Patient Dashboard Header */}
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
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--primary)',
              letterSpacing: '0.04em'
            }}>
              Patient Account
            </span>
            <h1 style={{ fontSize: '28px', marginTop: '4px', marginBottom: '4px' }}>
              Consultation Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Manage your scheduled consultations, view past doctor summaries and update health preferences.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onStartNewBooking} id="patient-new-booking-btn">
            + Book New Consultation
          </button>
        </div>

        {/* Tab Navigation (PRD Section 23) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
          marginBottom: '24px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'upcoming', label: `Upcoming (${upcomingAppts.length})`, icon: Calendar },
            { id: 'past', label: `Past Consultations (${pastAppts.length})`, icon: Clock },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'health', label: 'Health Information', icon: FileText },
            { id: 'privacy', label: 'Privacy & Security', icon: Shield }
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

        {/* TAB 1: Upcoming Appointments */}
        {activeTab === 'upcoming' && (
          <div>
            {upcomingAppts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {upcomingAppts.map((appt) => (
                  <div
                    key={appt.id}
                    style={{
                      background: 'white',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                          Appointment ID: {appt.id}
                        </span>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px', color: 'var(--text-main)' }}>
                          {appt.doctorName}
                        </h3>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                          {appt.doctorSpecialty} • {appt.categoryName}
                        </div>
                      </div>

                      <span style={{
                        background: 'var(--success-bg)',
                        color: 'var(--success)',
                        border: '1px solid var(--success-border)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        Confirmed
                      </span>
                    </div>

                    {/* Appointment Details Grid (PRD Section 24) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px',
                      background: 'var(--bg-alt)',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Date</span>
                        <strong>{appt.date}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Time</span>
                        <strong>{appt.timeFormatted} ({appt.patientTimezone})</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Method</span>
                        <strong style={{ color: 'var(--primary)' }}>Online video consultation</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Fee</span>
                        <strong style={{ color: 'var(--success)' }}>{appt.consultationFee || 'Free'}</strong>
                      </div>
                    </div>

                    {/* Actions: Join, Reschedule, Cancel (PRD Section 24) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onJoinRoom(appt)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        id={`btn-join-room-${appt.id}`}
                      >
                        <Video size={15} /> Join Consultation Room
                      </button>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onReschedule(appt.id)}
                        >
                          <RotateCcw size={14} /> Reschedule
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--error)' }}
                          onClick={() => onCancel(appt.id)}
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state per PRD Section 45 */
              <div className="empty-state">
                <h3>No upcoming appointments</h3>
                <p>You don't have any upcoming consultations scheduled.</p>
                <button className="btn btn-primary" onClick={onStartNewBooking}>
                  Find a Doctor
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Past Appointments */}
        {activeTab === 'past' && (
          <div>
            {pastAppts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pastAppts.map((appt) => (
                  <div
                    key={appt.id}
                    style={{
                      background: 'white',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '16px' }}>{appt.doctorName}</strong>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block' }}>
                          {appt.doctorSpecialty} • {appt.date}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: appt.status === 'completed' ? 'var(--success-bg)' : '#f1f5f9',
                        color: appt.status === 'completed' ? 'var(--success)' : '#64748b'
                      }}>
                        {appt.status.toUpperCase()}
                      </span>
                    </div>

                    {appt.status === 'completed' && (
                      <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setReviewModalAppt(appt)}
                        >
                          <Star size={14} color="#f59e0b" /> Leave Doctor Feedback
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No past consultations</h3>
                <p>You haven't completed any previous consultations yet.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Profile */}
        {activeTab === 'profile' && (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '28px', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Patient Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Name</span>
                <strong>{appointments[0]?.patientName || 'Demo Patient'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Email</span>
                <strong>{appointments[0]?.patientEmail || 'patient@example.com'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Phone</span>
                <strong>{appointments[0]?.patientPhone || '+91 98765 43210'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Country</span>
                <strong>{appointments[0]?.patientCountry || 'India'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Health Information */}
        {activeTab === 'health' && (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '28px', maxWidth: '680px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Health Questions History</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Answers provided during booking are stored securely and accessible only to your consulting clinician.
            </p>
            {appointments[0]?.healthAnswers ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(appointments[0].healthAnswers).map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--bg-alt)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'capitalize' }}>{k.replace('_', ' ')}</span>
                    <strong style={{ display: 'block', fontSize: '14px' }}>{v}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No health questionnaires submitted yet.</p>
            )}
          </div>
        )}

        {/* TAB 5: Privacy & Security */}
        {activeTab === 'privacy' && (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '28px', maxWidth: '680px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Privacy & Data Controls</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
              DoctorPlus strictly protects sensitive patient records. Your clinical questionnaire responses and contact details are accessible solely by your consulting practitioner.
            </p>
            <div style={{ background: 'var(--bg-alt)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-muted)' }}>
              • End-to-end encrypted video consultation streaming<br />
              • Zero lead selling or affiliate marketing tracking<br />
              • Request full data deletion at privacy@doctorplus.health
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewModalAppt && (
          <div className="modal-overlay" onClick={() => setReviewModalAppt(null)}>
            <div className="modal-dialog" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Leave Doctor Feedback</h3>
                <button className="modal-close-btn" onClick={() => setReviewModalAppt(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {reviewSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <CheckCircle size={40} color="var(--success)" style={{ margin: '0 auto 12px' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: 700 }}>Thank you for your feedback!</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      Your genuine review has been recorded and will appear on the platform.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Reviewing your consultation with <strong>{reviewModalAppt.doctorName}</strong>.
                    </p>

                    <div className="form-group">
                      <label className="form-label">Rating (1 to 5 Stars)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            style={{ padding: '6px' }}
                          >
                            <Star
                              size={24}
                              fill={star <= reviewRating ? '#f59e0b' : 'none'}
                              color={star <= reviewRating ? '#f59e0b' : '#cbd5e1'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Honest Feedback *</label>
                      <textarea
                        rows={4}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="form-textarea"
                        placeholder="How was the doctor's communication, professional advice and timeliness?"
                      />
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginBottom: '16px' }}>
                      * DoctorPlus displays genuine, consent-verified patient feedback. No fabricated reviews are permitted.
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">
                      Submit Verified Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
