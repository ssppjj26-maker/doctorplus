import React from 'react';
import { ArrowRight } from 'lucide-react';

export function HowItWorks({ onStartBooking }) {
  const steps = [
    {
      num: '1',
      title: 'Tell us what you need',
      desc: 'Choose a health concern or specialty.'
    },
    {
      num: '2',
      title: 'Choose a doctor',
      desc: 'Review professional information, experience and availability.'
    },
    {
      num: '3',
      title: 'Book your consultation',
      desc: 'Select a convenient date and time.'
    }
  ];

  return (
    <section className="section-padding how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How DoctorPlus Works</h2>
          <p>Finding the right healthcare professional is straightforward and simple.</p>
        </div>

        <div className="steps-grid">
          {steps.map((st) => (
            <div key={st.num} className="step-card">
              <span className="step-num-badge">{st.num}</span>
              <h3 className="step-title">{st.title}</h3>
              <p className="step-text">{st.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button className="btn btn-primary" onClick={onStartBooking}>
            Find a Doctor <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
