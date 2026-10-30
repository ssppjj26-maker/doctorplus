import React, { useState, useMemo } from 'react';
import {
  Search, Filter, MapPin, Globe, Check, Star,
  RotateCcw, ArrowRight, User
} from 'lucide-react';
import { CATEGORIES } from '../data/healthcareData';
import { convertSlotToPatientTime } from '../lib/storage';

export function DoctorSearch({
  doctors,
  selectedCategory,
  onCategoryChange,
  onViewDoctorProfile,
  onBookDoctor,
  patientTimezone
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minExperience, setMinExperience] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');

  // Extract distinct filter values
  const allSpecialties = useMemo(() => {
    return Array.from(new Set(doctors.map((d) => d.specialty))).sort();
  }, [doctors]);

  const allLanguages = useMemo(() => {
    const langs = new Set();
    doctors.forEach((d) => d.languages?.forEach((l) => langs.add(l)));
    return Array.from(langs).sort();
  }, [doctors]);

  const allLocations = useMemo(() => {
    return Array.from(new Set(doctors.map((d) => d.location))).sort();
  }, [doctors]);

  // Filter & Sort Logic
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all') {
        if (doc.categoryId !== selectedCategory) return false;
      }

      // Specialty filter
      if (selectedSpecialty !== 'all' && doc.specialty !== selectedSpecialty) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== 'all' && !doc.languages?.includes(selectedLanguage)) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all' && doc.location !== selectedLocation) {
        return false;
      }

      // Experience filter
      if (doc.experience < minExperience) {
        return false;
      }

      // Search keyword filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.location.toLowerCase().includes(q) ||
          doc.languages?.some((l) => l.toLowerCase().includes(q)) ||
          doc.areasOfCare?.some((a) => a.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'experience') return b.experience - a.experience;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'earliest') {
        const slotA = a.baseSlotTimesUTC?.[0] || '24:00';
        const slotB = b.baseSlotTimesUTC?.[0] || '24:00';
        return slotA.localeCompare(slotB);
      }
      // 'recommended' default: verified first, then experience
      if (a.isCredentialsVerified !== b.isCredentialsVerified) {
        return a.isCredentialsVerified ? -1 : 1;
      }
      return b.experience - a.experience;
    });
  }, [
    doctors, selectedCategory, selectedSpecialty, selectedLanguage,
    selectedLocation, minExperience, searchTerm, sortBy
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    onCategoryChange('all');
    setSelectedSpecialty('all');
    setSelectedLanguage('all');
    setSelectedLocation('all');
    setMinExperience(0);
    setSortBy('recommended');
  };

  return (
    <section className="section-padding" id="find-a-doctor-page">
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Find a Doctor</h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            Search by health problem, specialty, doctor name, language or location.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}>
          {/* Main Search Input */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div className="search-input-wrap" style={{ flex: 1, minWidth: '240px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
              <Search size={18} color="var(--primary)" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by health concern, specialty or doctor name..."
                id="doctor-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ fontSize: '13px', color: 'var(--text-subtle)' }}
                >
                  Clear
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '170px' }}
              aria-label="Sort options"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="experience">Sort: Experience</option>
              <option value="rating">Sort: Rating</option>
              <option value="earliest">Sort: Earliest availability</option>
            </select>
          </div>

          {/* Filter Dropdowns Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '10px',
            alignItems: 'center'
          }}>
            {/* Category / Concern filter */}
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="form-select"
              aria-label="Filter by Health Concern"
            >
              <option value="all">All Health Concerns</option>
              {CATEGORIES.filter((c) => c.id !== 'more').map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Specialty filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="form-select"
              aria-label="Filter by Specialty"
            >
              <option value="all">All Specialties</option>
              {allSpecialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Language filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="form-select"
              aria-label="Filter by Language"
            >
              <option value="all">All Languages</option>
              {allLanguages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            {/* Location filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="form-select"
              aria-label="Filter by Location"
            >
              <option value="all">All Locations</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Experience filter */}
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="form-select"
              aria-label="Filter by Experience"
            >
              <option value="0">Any Experience</option>
              <option value="5">5+ Years</option>
              <option value="10">10+ Years</option>
              <option value="15">15+ Years</option>
            </select>

            {/* Reset button */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={resetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredDoctors.length}</strong> {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
          </span>
          {patientTimezone && (
            <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>
              Availability shown in: <strong>{patientTimezone}</strong>
            </span>
          )}
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="doctors-grid">
            {filteredDoctors.map((doc) => {
              const qualificationsStr = doc.qualifications?.map((q) => q.degree).join(', ') || doc.degree || 'MBBS';
              const nextSlotFormatted = doc.baseSlotTimesUTC?.[0]
                ? convertSlotToPatientTime(doc.baseSlotTimesUTC[0], patientTimezone)
                : 'Tomorrow, 10:00 AM';

              return (
                <div key={doc.id} className="doctor-card">
                  <div>
                    <div className="doctor-card-top">
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="doctor-photo"
                        loading="lazy"
                      />

                      <div className="doctor-info-col">
                        <div className="doctor-name-row">
                          <h3 className="doctor-name">{doc.name}</h3>
                        </div>
                        <div className="doctor-specialty">{doc.specialty}</div>
                        <div className="doctor-qual-text">{qualificationsStr}</div>

                        <div className="doctor-meta-items">
                          <span><strong>{doc.experience} years</strong> experience</span>
                          <span>•</span>
                          <span>{doc.languages?.join(' • ')}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <MapPin size={13} />
                          <span>{doc.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating display (Strictly honest: only if real reviews exist) */}
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {doc.rating ? (
                        <>
                          <span style={{ color: '#eab308', display: 'inline-flex', alignItems: 'center' }}>
                            <Star size={14} fill="#eab308" />
                          </span>
                          <strong>{doc.rating}</strong>
                          <span>({doc.reviewCount} {doc.reviewCount === 1 ? 'verified review' : 'verified reviews'})</span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)' }}>No reviews yet • Be the first to review</span>
                      )}
                    </div>

                    {/* Verification Status (Only display if actually verified by admin) */}
                    <div className="doctor-verification-strip">
                      {doc.isIdentityVerified && (
                        <span className="badge-verified">
                          <Check size={14} strokeWidth={3} /> Identity verified
                        </span>
                      )}
                      {doc.isCredentialsVerified && (
                        <span className="badge-verified">
                          <Check size={14} strokeWidth={3} /> Medical credentials verified
                        </span>
                      )}
                      {!doc.isIdentityVerified && !doc.isCredentialsVerified && (
                        <span className="badge-pending">
                          Verification pending admin review
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="doctor-card-actions">
                    <div className="doctor-availability-info">
                      <span>Next available:</span>
                      <strong>Today, {nextSlotFormatted}</strong>
                    </div>

                    <div className="doctor-btn-group">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewDoctorProfile(doc)}
                        id={`btn-view-profile-${doc.id}`}
                      >
                        View Profile
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onBookDoctor(doc)}
                        id={`btn-book-${doc.id}`}
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State per PRD Section 44 */
          <div className="empty-state">
            <h3>No doctors found</h3>
            <p>
              We couldn't find a suitable doctor matching your search filters. Try clearing some filters or searching for another health concern.
            </p>
            <button className="btn btn-primary" onClick={resetFilters}>
              Search Again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
