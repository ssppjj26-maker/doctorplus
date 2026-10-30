import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { HowItWorks } from './components/HowItWorks';
import { FeaturedDoctorsSection } from './components/FeaturedDoctorsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PatientReviewsSection } from './components/PatientReviewsSection';
import { FaqSection } from './components/FaqSection';
import { FinalBookingCta } from './components/FinalBookingCta';
import { ProblemDoctorMatcher } from './components/ProblemDoctorMatcher';
import { Footer } from './components/Footer';
import { DoctorSearch } from './components/DoctorSearch';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { BookingWizardModal } from './components/BookingWizardModal';
import { ConfirmationView } from './components/ConfirmationView';
import { HealthConcernPage } from './components/HealthConcernPage';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';
import { TelehealthRoom } from './components/TelehealthRoom';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { MobileBottomBar } from './components/MobileBottomBar';
import { AboutPage, ContactPage, MedicalDisclaimerPage, PrivacyPolicyPage } from './components/StaticPages';
import {
  getStoredDoctors, getStoredAppointments, detectBrowserTimezone,
  updateAppointmentStatus, getActiveRole, setActiveRole
} from './lib/storage';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeRole, setActiveRoleState] = useState(getActiveRole());

  // Core Data
  const [doctors, setDoctors] = useState(getStoredDoctors());
  const [appointments, setAppointments] = useState(getStoredAppointments());
  const [patientTimezone] = useState(detectBrowserTimezone());

  // Search & Category Navigation State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeConcernSlug, setActiveConcernSlug] = useState('weight-management');

  // Modals & Active Rooms
  const [doctorProfileModalDoc, setDoctorProfileModalDoc] = useState(null);
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);
  const [bookingWizardConfig, setBookingWizardConfig] = useState({ categoryId: 'weight-management', doctor: null });
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [telehealthRoomAppt, setTelehealthRoomAppt] = useState(null);
  const [latestConfirmedAppt, setLatestConfirmedAppt] = useState(null);

  // Sync storage updates
  const refreshStorage = () => {
    setDoctors(getStoredDoctors());
    setAppointments(getStoredAppointments());
  };

  const handleRoleChange = (newRole) => {
    setActiveRoleState(newRole);
    setActiveRole(newRole);
  };

  // Handlers
  const handleStartBooking = (categoryId = null, doctor = null) => {
    setBookingWizardConfig({
      categoryId: categoryId || 'weight-management',
      doctor: doctor || null
    });
    setBookingWizardOpen(true);
  };

  const handleBookingSuccess = (newAppt) => {
    setBookingWizardOpen(false);
    setLatestConfirmedAppt(newAppt);
    setCurrentView('confirmation');
    refreshStorage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (term) => {
    setCurrentView('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setCurrentView('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCategoryDetail = (slug) => {
    setActiveConcernSlug(slug);
    setCurrentView('concern-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReschedule = (apptId) => {
    const appt = appointments.find((a) => a.id === apptId);
    if (appt) {
      const doc = doctors.find((d) => d.id === appt.doctorId);
      handleStartBooking(appt.categoryId, doc);
    }
  };

  const handleCancelAppt = (apptId) => {
    if (window.confirm('Are you sure you wish to cancel this scheduled consultation?')) {
      updateAppointmentStatus(apptId, 'cancelled', 'Cancelled by patient');
      refreshStorage();
    }
  };

  return (
    <div className="bookdoc-outer-canvas">
      <div className="bookdoc-white-frame">
        {/* 1. Global Navigation Bar */}
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          apptCount={appointments.filter((a) => a.status === 'confirmed').length}
          onStartBooking={() => handleStartBooking()}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
        />

        {/* Main Routed Content */}
        <main>
        {/* HOMEPAGE — EXACT ORDER PER PRD SECTION 51:
            1. Navigation (rendered above)
            2. Hero + doctor search
            3. Popular health concerns
            4. How CareFind Works
            5. Featured doctors
            6. Why patients use CareFind
            7. Patient experiences, only if genuine
            8. FAQ
            9. Final booking CTA
            10. Footer (rendered below)
        */}
        {currentView === 'home' && (
          <>
            {/* 2. Hero + Doctor Search */}
            <Hero
              onSearchSubmit={handleSearchSubmit}
              onSelectCategory={handleSelectCategory}
              onExploreConcerns={() => {
                setCurrentView('categories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 3. Our Departments */}
            <CategoriesSection
              onSelectCategory={handleSelectCategory}
              onViewCategoryDetail={handleViewCategoryDetail}
              onStartBooking={handleStartBooking}
            />

            {/* 4. One Major Problem = One Dedicated Doctor Matcher */}
            <ProblemDoctorMatcher
              onStartBooking={handleStartBooking}
              onViewDoctorProfile={(doc) => setDoctorProfileModalDoc(doc)}
            />

            {/* 5. Customer Reviews for Free Online Consultation Services */}
            <PatientReviewsSection
              onStartBooking={() => handleStartBooking()}
            />

            {/* 6. Featured Doctors */}
            <FeaturedDoctorsSection
              doctors={doctors}
              patientTimezone={patientTimezone}
              onViewDoctorProfile={(doc) => setDoctorProfileModalDoc(doc)}
              onBookDoctor={(doc) => handleStartBooking(doc.categoryId, doc)}
              onExploreAll={() => {
                setCurrentView('doctors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 7. How BookDoc Works */}
            <HowItWorks
              onStartBooking={() => handleStartBooking()}
            />

            {/* 8. Why Patients Use BookDoc */}
            <WhyChooseUs
              onStartBooking={() => handleStartBooking()}
            />

            {/* 9. FAQ */}
            <FaqSection />

            {/* 9. Final Booking CTA */}
            <FinalBookingCta
              onStartBooking={() => handleStartBooking()}
              onExploreConcerns={() => {
                setCurrentView('categories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* Dedicated Find a Doctor View (PRD Section 10) */}
        {currentView === 'doctors' && (
          <DoctorSearch
            doctors={doctors}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onViewDoctorProfile={(doc) => setDoctorProfileModalDoc(doc)}
            onBookDoctor={(doc) => handleStartBooking(doc.categoryId, doc)}
            patientTimezone={patientTimezone}
          />
        )}

        {/* Health Concerns Overview (PRD Section 9) */}
        {currentView === 'categories' && (
          <CategoriesSection
            onSelectCategory={handleSelectCategory}
            onViewCategoryDetail={handleViewCategoryDetail}
          />
        )}

        {/* Dedicated Health Concern Page (PRD Section 27) */}
        {currentView === 'concern-detail' && (
          <HealthConcernPage
            categorySlug={activeConcernSlug}
            doctors={doctors}
            patientTimezone={patientTimezone}
            onBack={() => {
              setCurrentView('categories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDoctorProfile={(doc) => setDoctorProfileModalDoc(doc)}
            onBookDoctor={(doc) => handleStartBooking(doc.categoryId, doc)}
          />
        )}

        {/* How It Works Full Page */}
        {currentView === 'how-it-works' && (
          <HowItWorks onStartBooking={() => handleStartBooking()} />
        )}

        {/* For Doctors / Doctor Registration info page */}
        {currentView === 'for-doctors' && (
          <div className="section-padding">
            <div className="container" style={{ maxWidth: '780px' }}>
              <div className="section-header">
                <h1>For Healthcare Professionals</h1>
                <p>Join CareFind to accept verified online consultation requests from patients.</p>
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '32px', lineHeight: 1.7, fontSize: '15px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Professional Credentialing Process</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                  CareFind performs rigorous administrative verification of medical registration licenses and academic qualifications before displaying verified badges. Falsely marking yourself as verified is strictly prevented.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleRoleChange('doctor');
                      setCurrentView('doctor-dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Open Doctor Workspace Demo
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      handleRoleChange('admin');
                      setCurrentView('admin-dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Open Admin Verification Center
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient Dashboard / Portal (PRD Section 23) */}
        {currentView === 'patient-dashboard' && (
          <PatientDashboard
            appointments={appointments}
            onJoinRoom={(appt) => setTelehealthRoomAppt(appt)}
            onReschedule={handleReschedule}
            onCancel={handleCancelAppt}
            onStartNewBooking={() => handleStartBooking()}
          />
        )}

        {/* Doctor Dashboard / Portal (PRD Section 25) */}
        {currentView === 'doctor-dashboard' && (
          <DoctorDashboard
            doctor={doctors[0]}
            appointments={appointments}
            onJoinRoom={(appt) => setTelehealthRoomAppt(appt)}
            onUpdateAppt={refreshStorage}
          />
        )}

        {/* Admin Dashboard (PRD Section 26) */}
        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            doctors={doctors}
            appointments={appointments}
            onUpdateData={refreshStorage}
          />
        )}

        {/* Booking Confirmation View (PRD Section 22) */}
        {currentView === 'confirmation' && latestConfirmedAppt && (
          <ConfirmationView
            appointment={latestConfirmedAppt}
            onViewAppointment={() => {
              setCurrentView('patient-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Static Content Pages (PRD Sections 31-34) */}
        {currentView === 'about' && <AboutPage onStartBooking={() => handleStartBooking()} />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'faq' && <FaqSection />}
        {currentView === 'disclaimer' && <MedicalDisclaimerPage />}
        {currentView === 'privacy' && <PrivacyPolicyPage />}
      </main>

      {/* 10. Global Footer (PRD Section 30 & 51) */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      </div>

      {/* Mobile Sticky Bottom CTA: Find a Doctor (PRD Section 7) */}
      <MobileBottomBar
        onFindDoctor={() => {
          setCurrentView('doctors');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MODALS */}
      {/* 1. Doctor Profile Modal (PRD Section 12) */}
      {doctorProfileModalDoc && (
        <DoctorProfileModal
          doctor={doctorProfileModalDoc}
          patientTimezone={patientTimezone}
          onClose={() => setDoctorProfileModalDoc(null)}
          onBookDoctor={(doc) => {
            setDoctorProfileModalDoc(null);
            handleStartBooking(doc.categoryId, doc);
          }}
        />
      )}

      {/* 2. 5-Step Booking Wizard Modal (PRD Sections 17-22) */}
      {bookingWizardOpen && (
        <BookingWizardModal
          initialCategory={bookingWizardConfig.categoryId}
          initialDoctor={bookingWizardConfig.doctor}
          doctors={doctors}
          onClose={() => setBookingWizardOpen(false)}
          onBookingSuccess={handleBookingSuccess}
          onTriggerEmergency={() => {
            setBookingWizardOpen(false);
            setEmergencyModalOpen(true);
          }}
        />
      )}

      {/* 3. Emergency Safety Screening Alert Modal (PRD Section 20) */}
      {emergencyModalOpen && (
        <EmergencyAlertModal
          onClose={() => setEmergencyModalOpen(false)}
        />
      )}

      {/* 4. Telehealth Video Consultation Room */}
      {telehealthRoomAppt && (
        <TelehealthRoom
          appointment={telehealthRoomAppt}
          onClose={() => setTelehealthRoomAppt(null)}
          onFinishConsultation={() => {
            updateAppointmentStatus(telehealthRoomAppt.id, 'completed');
            refreshStorage();
            setTelehealthRoomAppt(null);
          }}
        />
      )}

      {/* 5. CareFind Assistant (PRD Section 29) */}
      <AiAssistantWidget
        onSelectCategory={handleSelectCategory}
        onStartBooking={() => handleStartBooking()}
        onTriggerEmergency={() => setEmergencyModalOpen(true)}
      />
    </div>
  );
}
