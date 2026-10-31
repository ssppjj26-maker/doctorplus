import React, { useState } from 'react';
import { ArrowRight, User, Globe, Menu, X, Shield, PhoneCall } from 'lucide-react';

export function Navbar({ currentView, setCurrentView, apptCount, onStartBooking, activeRole, onRoleChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Main BookDoc Header matching exact screenshot */}
      <header className="bookdoc-header">
        <div className="container bookdoc-header-inner">
          {/* Brand Logo with exact 4-leaf medical clover */}
          <div className="bookdoc-logo" onClick={() => navigateTo('home')} role="button" tabIndex={0}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              {/* Top-Left: Green */}
              <rect x="2" y="2" width="13" height="13" rx="6.5" fill="#10B981" />
              {/* Top-Right: Cyan */}
              <rect x="19" y="2" width="13" height="13" rx="6.5" fill="#06B6D4" />
              {/* Bottom-Left: Dark Blue */}
              <rect x="2" y="19" width="13" height="13" rx="6.5" fill="#1E3A8A" />
              {/* Bottom-Right: Vibrant Blue */}
              <rect x="19" y="19" width="13" height="13" rx="6.5" fill="#1D70E8" />
            </svg>
            <span className="bookdoc-logo-text">
              <span className="book-dark">Doctor</span>
              <span className="doc-blue">Plus</span>
            </span>
          </div>

          {/* Centered Pill Capsule Menu */}
          <nav className="bookdoc-nav-capsule">
            <button
              type="button"
              className={`bookdoc-nav-pill ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`bookdoc-nav-pill ${currentView === 'doctors' ? 'active' : ''}`}
              onClick={() => navigateTo('doctors')}
            >
              Doctors
            </button>
            <button
              type="button"
              className={`bookdoc-nav-pill ${currentView === 'categories' ? 'active' : ''}`}
              onClick={() => navigateTo('categories')}
            >
              Medicals
            </button>
            <button
              type="button"
              className={`bookdoc-nav-pill ${currentView === 'how-it-works' ? 'active' : ''}`}
              onClick={() => navigateTo('how-it-works')}
            >
              Services
            </button>
          </nav>

          {/* Right Button: Contact Us -> */}
          <div className="bookdoc-header-right">
            {apptCount > 0 && (
              <button
                className="patient-portal-pill-btn"
                onClick={() => navigateTo('patient-dashboard')}
                style={{ marginRight: '8px' }}
              >
                <User size={13} />
                <span>My Consultations ({apptCount})</span>
              </button>
            )}

            <button
              type="button"
              className="bookdoc-contact-btn"
              onClick={() => navigateTo('contact')}
            >
              <span>Contact Us</span>
              <span className="arrow-circle">
                <ArrowRight size={14} strokeWidth={2.5} />
              </span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              className="bookdoc-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="bookdoc-mobile-drawer">
            <button
              type="button"
              className={`bookdoc-mobile-link ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`bookdoc-mobile-link ${currentView === 'doctors' ? 'active' : ''}`}
              onClick={() => navigateTo('doctors')}
            >
              Doctors
            </button>
            <button
              type="button"
              className={`bookdoc-mobile-link ${currentView === 'categories' ? 'active' : ''}`}
              onClick={() => navigateTo('categories')}
            >
              Medicals & Departments
            </button>
            <button
              type="button"
              className={`bookdoc-mobile-link ${currentView === 'how-it-works' ? 'active' : ''}`}
              onClick={() => navigateTo('how-it-works')}
            >
              Services & How It Works
            </button>
            <button
              type="button"
              className="bookdoc-mobile-link"
              onClick={() => navigateTo('contact')}
            >
              Contact Us
            </button>
          </div>
        )}
      </header>
    </>
  );
}
