import React from 'react';
import { Building2, Award, CheckCircle, ShieldCheck, Globe } from 'lucide-react';
import { TOP_HOSPITALS } from '../data/healthcareData';

export function HospitalTrustSection({ onFilterCountry }) {
  return (
    <section style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)', padding: '40px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 28px' }}>
          <span className="section-eyebrow">Institutional Trust Network</span>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            Consult Physicians Practicing at Top Accredited Teaching Hospitals
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Our healthcare providers hold clinical appointments, faculty posts, and admitting privileges across leading medical institutions in the US, UK, Australia, New Zealand, Germany, and Canada.
          </p>
        </div>

        {/* Hospital Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}>
          {TOP_HOSPITALS.slice(0, 8).map((hosp, i) => (
            <div
              key={i}
              style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                color: 'var(--primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Building2 size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.925rem', color: 'var(--text-main)', display: 'block' }}>
                  {hosp.name}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {hosp.city} • <strong>{hosp.country}</strong>
                </span>
                <div style={{
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  background: 'var(--primary-subtle)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '6px',
                  display: 'inline-block'
                }}>
                  ✓ {hosp.badge}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Six Flag Quick Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '14px 20px',
          background: 'white',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          maxWidth: '820px',
          margin: '0 auto',
          fontSize: '0.825rem'
        }}>
          <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Browse doctors by country:</span>
          {[
            { label: '🇺🇸 United States', country: 'United States' },
            { label: '🇬🇧 United Kingdom', country: 'United Kingdom' },
            { label: '🇦🇺 Australia', country: 'Australia' },
            { label: '🇳🇿 New Zealand', country: 'New Zealand' },
            { label: '🇩🇪 Germany', country: 'Germany' },
            { label: '🇨🇦 Canada', country: 'Canada' }
          ].map((c) => (
            <button
              key={c.country}
              type="button"
              className="tag-chip"
              onClick={() => onFilterCountry(c.country)}
              style={{ fontWeight: 600 }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
