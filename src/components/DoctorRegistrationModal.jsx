import React, { useState } from 'react';
import { X, Award, ShieldCheck, Check, Upload, Stethoscope, ArrowRight } from 'lucide-react';
import { registerDoctor } from '../lib/storage';
import { CATEGORIES } from '../data/healthcareData';

export function DoctorRegistrationModal({ onClose, onRegistered }) {
  const [formData, setFormData] = useState({
    name: '',
    qualifications: '',
    specialty: '',
    categoryId: 'weight-loss',
    licenseNumber: '',
    licenseAuthority: '',
    country: 'United States',
    experience: 10,
    languages: 'English',
    bio: '',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    hospitalAffiliation: ''
  });

  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (f, v) => setFormData((prev) => ({ ...prev, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.qualifications.trim()) errs.qualifications = 'Medical qualifications required.';
    if (!formData.specialty.trim()) errs.specialty = 'Specialty title required.';
    if (!formData.licenseNumber.trim()) errs.licenseNumber = 'Medical license/registration number required.';
    if (!formData.licenseAuthority.trim()) errs.licenseAuthority = 'Issuing authority required (e.g. State Medical Board, GMC).';
    if (!formData.bio.trim()) errs.bio = 'Professional bio is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newDoc = registerDoctor({
      name: formData.name.startsWith('Dr.') ? formData.name : `Dr. ${formData.name}`,
      qualifications: formData.qualifications.split(',').map((s) => s.trim()),
      specialty: formData.specialty,
      categoryId: formData.categoryId,
      licenseNumber: formData.licenseNumber,
      licenseAuthority: formData.licenseAuthority,
      country: formData.country,
      experience: Number(formData.experience),
      languages: formData.languages.split(',').map((s) => s.trim()),
      about: formData.bio,
      photo: formData.photo,
      hospitalAffiliation: formData.hospitalAffiliation || `${formData.country} Medical Center`,
      expertise: ['Clinical Consultation', 'Diagnostic Evaluation', 'Preventive Care'],
      gender: 'Other',
      timezone: 'America/New_York'
    });

    onRegistered(newDoc);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Stethoscope size={20} color="var(--primary)" />
            <h3 className="modal-title">Healthcare Professional Registration</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '18px', fontSize: '0.8125rem', color: '#475569' }}>
              <strong>Clinical Verification Notice:</strong> Registrations are placed in <em>Pending Verification</em>. Doctors only appear publicly once licenses, issuing medical boards, and credentials are authenticated.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <div>
                <label className="question-label" style={{ fontSize: '0.8rem' }}>Full Legal Name & Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Robert Hayes, MD"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                {errors.name && <span style={{ color: 'var(--emergency-red)', fontSize: '0.75rem' }}>{errors.name}</span>}
              </div>

              <div>
                <label className="question-label" style={{ fontSize: '0.8rem' }}>Primary Health Category *</label>
                <select
                  className="form-select"
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="question-label" style={{ fontSize: '0.8rem' }}>Medical Qualifications * (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MBBS, MD Internal Medicine, FOMA"
                  value={formData.qualifications}
                  onChange={(e) => handleChange('qualifications', e.target.value)}
                />
                {errors.qualifications && <span style={{ color: 'var(--emergency-red)', fontSize: '0.75rem' }}>{errors.qualifications}</span>}
              </div>

              <div>
                <label className="question-label" style={{ fontSize: '0.8rem' }}>Specialty Designation *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Endocrinologist & Diabetologist"
                  value={formData.specialty}
                  onChange={(e) => handleChange('specialty', e.target.value)}
                />
                {errors.specialty && <span style={{ color: 'var(--emergency-red)', fontSize: '0.75rem' }}>{errors.specialty}</span>}
              </div>

              <div>
                <label className="question-label" style={{ fontSize: '0.8rem' }}>Medical License / Registration No. *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MED-849201-US"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                />
                {errors.licenseNumber && <span style={{ color: 'var(--emergency-red)', fontSize: '0.75rem' }}>{errors.licenseNumber}</span>}
              </div>

              <div>
                <label className="question-label" style={{ fontSize: '0.8rem' }}>Issuing Licensing Authority *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Massachusetts Board of Registration in Medicine"
                  value={formData.licenseAuthority}
                  onChange={(e) => handleChange('licenseAuthority', e.target.value)}
                />
                {errors.licenseAuthority && <span style={{ color: 'var(--emergency-red)', fontSize: '0.75rem' }}>{errors.licenseAuthority}</span>}
              </div>

              <div>
                <label className="question-label" style={{ fontSize: '0.8rem' }}>Years of Clinical Experience *</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="50"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                />
              </div>

              <div>
                <label className="question-label" style={{ fontSize: '0.8rem' }}>Country & Hospital Affiliation</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. United States, Boston Medical Center"
                  value={formData.hospitalAffiliation}
                  onChange={(e) => handleChange('hospitalAffiliation', e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="question-label" style={{ fontSize: '0.8rem' }}>Professional Bio / Clinical Summary *</label>
              <textarea
                className="form-textarea"
                placeholder="Describe your medical training, clinical focus, and telemedicine approach..."
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
              {errors.bio && <span style={{ color: 'var(--emergency-red)', fontSize: '0.75rem' }}>{errors.bio}</span>}
            </div>

            {/* Document Upload Simulation */}
            <div style={{ marginTop: '14px', border: '1.5px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center', background: 'var(--bg-main)' }}>
              <Upload size={24} color="var(--primary)" style={{ margin: '0 auto 6px' }} />
              <strong style={{ fontSize: '0.85rem', display: 'block' }}>Upload Medical License & ID Document for Verification</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, JPG, PNG up to 10MB</span>
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${documentUploaded ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDocumentUploaded(true)}
                >
                  {documentUploaded ? '✓ Document Uploaded (license_verified.pdf)' : 'Select Verification Document'}
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Doctor Registration for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
