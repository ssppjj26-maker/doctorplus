import React from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../data/healthcareData';

export function EmergencyAlertModal({ onClose, patientCountry = 'United States' }) {
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="modal-dialog" style={{ maxWidth: '580px', borderTop: '6px solid var(--emergency-red)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ background: '#fef2f2' }}>
          <div className="modal-title-group">
            <AlertTriangle size={24} color="var(--emergency-red)" />
            <h3 className="modal-title" style={{ color: '#991b1b' }}>Urgent Medical Attention Required</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
            <p style={{ fontWeight: 700, color: '#991b1b', fontSize: '1rem', marginBottom: '6px' }}>
              Do NOT proceed with an online consultation appointment.
            </p>
            <p style={{ color: '#7f1d1d', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Your reported symptoms may require urgent medical attention or immediate physical emergency intervention. Telehealth appointments cannot provide physical resuscitation, critical monitoring, or emergency stabilization.
            </p>
          </div>

          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Immediate Action Required:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {EMERGENCY_NUMBERS.map((em, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.875rem' }}>{em.country}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{em.service}</span>
                </div>
                <a
                  href={`tel:${em.number.split(' ')[0]}`}
                  className="btn btn-sm"
                  style={{ background: 'var(--emergency-red)', color: 'white', fontWeight: 700 }}
                >
                  <PhoneCall size={14} /> Call {em.number}
                </a>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            • If you are alone, call for emergency medical transport immediately.<br/>
            • Do not attempt to drive yourself if you are experiencing dizziness, severe chest pain, or shortness of breath.<br/>
            • Contact a family member, neighbor, or emergency contact immediately.
          </div>
        </div>

        <div className="modal-footer" style={{ background: '#fef2f2' }}>
          <button className="btn btn-secondary btn-full" onClick={onClose}>
            I Understand — Close Emergency Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
