import React, { useState } from 'react';
import {
  HelpCircle, ShieldCheck, FileText, Phone, Mail, MapPin,
  AlertTriangle, ChevronDown, ChevronUp, CheckCircle, ArrowRight
} from 'lucide-react';
import { FAQS, EMERGENCY_NUMBERS } from '../data/healthcareData';

// ABOUT PAGE (PRD Section 31)
export function AboutPage({ onStartBooking }) {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="section-header">
          <h1>About CareFind</h1>
          <p>
            Making it easier for people to discover healthcare professionals and arrange consultations online.
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-muted)' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>
            Our Purpose & Core Philosophy
          </h3>
          <p style={{ marginBottom: '16px' }}>
            CareFind was created around a single, straightforward principle:
            <em> "I have a health concern. CareFind can help me find an appropriate healthcare professional, understand who they are, and book a consultation without making the process complicated."</em>
          </p>
          <p style={{ marginBottom: '16px' }}>
            We believe patients deserve complete transparency before choosing a healthcare professional. That means showing verified educational credentials, genuine clinical experience, clear language proficiencies, and honest consultation fees without surprise bills or aggressive marketing claims.
          </p>

          <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginTop: '28px', marginBottom: '12px' }}>
            Core Principles
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: 'var(--bg-alt)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Accessibility</strong>
              <span>Simple, mobile-first design so anyone can navigate care options easily.</span>
            </div>
            <div style={{ background: 'var(--bg-alt)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Transparency</strong>
              <span>Verifiable degrees, real appointment availability and clear consultation fees.</span>
            </div>
            <div style={{ background: 'var(--bg-alt)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Medical Integrity</strong>
              <span>Strict prohibition of fake testimonials, exaggerated claims or automated diagnoses.</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button className="btn btn-primary" onClick={onStartBooking}>
              Find a Doctor <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// CONTACT PAGE (PRD Section 32)
export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="section-header">
          <h1>Contact CareFind</h1>
          <p>
            Have questions about finding a doctor, our credential verification, or technical support?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '28px', alignItems: 'flex-start' }}>
          {/* Contact Details */}
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Support & Information</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Email Support</span>
                <strong>support@carefind.health</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Practitioner Inquiries</span>
                <strong>doctors@carefind.health</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Support Hours</span>
                <strong>Monday – Saturday: 9:00 AM – 7:00 PM IST</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '12px' }}>Operational Notice</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  CareFind operates as an online healthcare discovery & booking technology platform.
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={40} color="var(--success)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Message Received</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Thank you for reaching out. Our support team will respond to your inquiry via email within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Send a Message</h3>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Appointment assistance, Doctor registration"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                    placeholder="How can we help?"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// MEDICAL DISCLAIMER PAGE (PRD Section 34)
export function MedicalDisclaimerPage() {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="section-header">
          <h1>Medical Disclaimer</h1>
          <p>Important legal and health safety disclosures regarding the use of CareFind.</p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-muted)' }}>
          <div className="notice-box-emergency" style={{ marginBottom: '24px' }}>
            <strong style={{ display: 'block', fontSize: '15px', marginBottom: '4px' }}>
              CareFind Is Not an Emergency Medical Service
            </strong>
            If you are experiencing severe chest pain, shortness of breath, loss of consciousness, stroke symptoms, severe bleeding, or any life-threatening emergency, call your local emergency service (112 / 911 / 999) or go to the nearest hospital emergency department immediately.
          </div>

          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            1. Nature of the Platform
          </h3>
          <p style={{ marginBottom: '16px' }}>
            CareFind is a healthcare discovery and appointment scheduling platform. CareFind connects individuals with independent healthcare professionals. CareFind is not a hospital, clinic, or medical practice and does not directly provide medical diagnoses or clinical care.
          </p>

          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            2. Informational Content & Non-Diagnosis
          </h3>
          <p style={{ marginBottom: '16px' }}>
            All content published on this website—including health concern summaries, educational overviews, and intake questionnaire prompts—is provided for general informational purposes only. It is not intended as a substitute for professional medical advice, clinical diagnosis, or individualized treatment.
          </p>

          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            3. Limitations of Online Consultations
          </h3>
          <p style={{ marginBottom: '16px' }}>
            Telehealth and virtual consultations may not be appropriate for every medical condition. Certain clinical conditions require physical examination, laboratory testing, imaging, or hands-on clinical intervention. Consulting doctors may recommend in-person evaluation when clinically indicated.
          </p>

          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            4. Prescriptions & Medication Decisions
          </h3>
          <p>
            Any decision to prescribe medication rests solely with the qualified healthcare professional after reviewing your medical history and where legally authorized under local medical regulations. CareFind does not guarantee prescription issuance and never automatically prescribes medication.
          </p>
        </div>
      </div>
    </div>
  );
}

// PRIVACY POLICY PAGE (PRD Section 35)
export function PrivacyPolicyPage() {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="section-header">
          <h1>Privacy Policy</h1>
          <p>How we handle and protect personal and health-related information.</p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-muted)' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            1. Information We Collect
          </h3>
          <p style={{ marginBottom: '16px' }}>
            We collect only the information necessary to facilitate your consultation:
            your name, email address, phone number, general location, and answers to non-diagnostic health intake questions provided during booking.
          </p>

          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            2. How Information Is Used
          </h3>
          <p style={{ marginBottom: '16px' }}>
            Your information is shared strictly with the specific healthcare professional you have booked a consultation with so they can prepare for your appointment. We do not sell, rent, or trade patient information to advertisers, lead brokers, or third parties.
          </p>

          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            3. Data Security & Storage
          </h3>
          <p style={{ marginBottom: '16px' }}>
            Access to sensitive consultation information is restricted to authorized personnel and the consulting clinician. We implement role-based access controls, session management, and encrypted communication channels.
          </p>

          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            4. Your Rights
          </h3>
          <p>
            You may request to view, update, or delete your appointment history and stored information at any time by contacting privacy@carefind.health.
          </p>
        </div>
      </div>
    </div>
  );
}
