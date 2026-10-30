import React, { useState } from 'react';
import { X, Mail, Bell, Clock, Calendar, CheckCircle2, User, Video, ShieldCheck } from 'lucide-react';
import { getNotifications } from '../lib/storage';

export function NotificationCenterModal({ onClose, onJoinRoomById }) {
  const notifs = getNotifications();
  const [filterRecipient, setFilterRecipient] = useState('all'); // all, patient, doctor, admin

  const filteredNotifs = filterRecipient === 'all'
    ? notifs
    : notifs.filter((n) => n.recipient === filterRecipient);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-dialog" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Mail size={20} color="var(--primary)" />
            <h3 className="modal-title">Simulated Transactional Emails & Reminders</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ padding: '12px 24px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
          <button
            className={`role-btn ${filterRecipient === 'all' ? 'active' : ''}`}
            onClick={() => setFilterRecipient('all')}
          >
            All Logs ({notifs.length})
          </button>
          <button
            className={`role-btn ${filterRecipient === 'patient' ? 'active' : ''}`}
            onClick={() => setFilterRecipient('patient')}
          >
            Patient Emails
          </button>
          <button
            className={`role-btn ${filterRecipient === 'doctor' ? 'active' : ''}`}
            onClick={() => setFilterRecipient('doctor')}
          >
            Doctor Alerts
          </button>
          <button
            className={`role-btn ${filterRecipient === 'admin' ? 'active' : ''}`}
            onClick={() => setFilterRecipient('admin')}
          >
            Admin Audits
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {filteredNotifs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
              No notifications generated yet. Book an appointment to trigger automated email flows.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  style={{
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Subject Line & Meta */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: n.recipient === 'patient' ? '#dbeafe' : (n.recipient === 'doctor' ? '#fef3c7' : '#ede9fe'),
                        color: n.recipient === 'patient' ? '#1e40af' : (n.recipient === 'doctor' ? '#92400e' : '#6b21a8')
                      }}>
                        To: {n.recipient.toUpperCase()}
                      </span>
                      <strong style={{ fontSize: '0.95rem' }}>{n.title}</strong>
                    </div>

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Body Content Preview */}
                  <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '10px' }}>
                    <p>{n.details}</p>

                    {n.meetingLink && (
                      <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                        <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.725rem' }}>Encrypted Telehealth Meeting Link:</span>
                        <code style={{ color: 'var(--primary)', fontWeight: 600 }}>{n.meetingLink}</code>
                      </div>
                    )}
                  </div>

                  {/* Reminder System Simulator Note (Section 12) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    <span>
                      ⏰ Automated reminders scheduled for: <strong>24h before</strong>, <strong>1h before</strong>, and <strong>15m before</strong> consultation.
                    </span>

                    {n.appointmentId && (
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>ID: {n.appointmentId}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-full" onClick={onClose}>
            Close Notification Hub
          </button>
        </div>
      </div>
    </div>
  );
}
