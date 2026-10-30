import React from 'react';
import { ArrowRight } from 'lucide-react';

export function FinalBookingCta({ onStartBooking, onExploreConcerns }) {
  return (
    <section className="final-cta-section">
      <div className="container">
        <h2>Ready to find an appropriate healthcare professional?</h2>
        <p>
          Search by health concern or specialty and schedule your online consultation in a few simple steps.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-lg"
            onClick={onStartBooking}
            id="final-cta-find-doctor-btn"
          >
            Find a Doctor <ArrowRight size={16} />
          </button>
          <button
            className="btn btn-outline btn-lg"
            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={onExploreConcerns}
          >
            Explore Health Concerns
          </button>
        </div>
      </div>
    </section>
  );
}
