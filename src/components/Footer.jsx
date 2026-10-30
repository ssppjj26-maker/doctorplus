import React from 'react';
import { Stethoscope } from 'lucide-react';

export function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="13" height="13" rx="6.5" fill="#10B981" />
                <rect x="19" y="2" width="13" height="13" rx="6.5" fill="#06B6D4" />
                <rect x="2" y="19" width="13" height="13" rx="6.5" fill="#1E3A8A" />
                <rect x="19" y="19" width="13" height="13" rx="6.5" fill="#1D70E8" />
              </svg>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
                <span style={{ color: '#0f172a' }}>Book</span>
                <span style={{ color: '#1d70e8' }}>Doc</span>
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, maxWidth: '320px' }}>
              Book top-tier doctors anytime, anywhere. 100% Free online consultations with certified medical specialists.
            </p>
          </div>

          {/* Platform Links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('doctors')}>
                  Find a Doctor
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('categories')}>
                  Health Concerns
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('how-it-works')}>
                  How It Works
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('for-doctors')}>
                  For Doctors
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('about')}>
                  About CareFind
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('contact')}>
                  Contact Us
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('about')}>
                  Careers
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('faq')}>
                  Help Center
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('faq')}>
                  FAQ
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('patient-dashboard')}>
                  Patient Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-col">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('privacy')}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('disclaimer')}>
                  Medical Disclaimer
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('privacy')}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => onNavigate('privacy')}>
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} CareFind. All rights reserved.
          </div>
          <div style={{ color: '#64748b', fontSize: '12px' }}>
            CareFind is a healthcare discovery and appointment platform. Not an emergency medical service.
          </div>
        </div>
      </div>
    </footer>
  );
}
