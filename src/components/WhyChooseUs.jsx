import React from 'react';
import { Search, FileText, Video, Eye, ShieldAlert } from 'lucide-react';

export function WhyChooseUs({ onStartBooking }) {
  const cards = [
    {
      icon: Search,
      title: 'Easy to find',
      desc: 'Search by health concern or specialty.'
    },
    {
      icon: FileText,
      title: 'Clear doctor information',
      desc: 'Review qualifications, experience and available information before booking.'
    },
    {
      icon: Video,
      title: 'Convenient consultations',
      desc: 'Book online without unnecessary steps.'
    },
    {
      icon: Eye,
      title: 'Transparent process',
      desc: "Know what you're booking before you confirm."
    }
  ];

  return (
    <section className="section-padding why-section" id="why-doctorplus">
      <div className="container">
        <div className="section-header">
          <h2>Why patients use DoctorPlus</h2>
          <p>
            Designed to make it easier for people to discover healthcare professionals and arrange consultations online.
          </p>
        </div>

        <div className="why-grid">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="why-card">
                <div className="why-card-icon">
                  <Icon size={20} />
                </div>
                <h3 className="why-card-title">{c.title}</h3>
                <p className="why-card-desc">{c.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Doctor Verification Transparency Callout (PRD Section 13) */}
        <div className="verification-notice-box" style={{ marginTop: '32px' }}>
          <strong>Doctor Verification Standard</strong>
          We verify the professional information provided by participating healthcare professionals before displaying verification badges. In this demo/preview environment, verification controls can be inspected live in the Admin Dashboard.
        </div>

        {/* Emergency Medical Notice (PRD Section 20) */}
        <div className="notice-box-emergency" style={{ marginTop: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Important Medical Safety Notice:</strong>
            DoctorPlus is not an emergency medical service. If you are experiencing a medical emergency, severe symptoms or an immediate danger to your health, contact your local emergency service (112 / 911 / 999) or seek urgent in-person medical care immediately.
          </div>
        </div>
      </div>
    </section>
  );
}
