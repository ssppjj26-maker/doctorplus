import React, { useState, useEffect } from 'react';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Share2, MessageSquare,
  ShieldAlert, Award, FileText, Check, Clock, Stethoscope, Sparkles
} from 'lucide-react';
import { updateDoctorClinicalGuidance } from '../lib/storage';

export function TelehealthRoom({ appointment, onClose, onFinishConsultation }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('guidance'); // guidance, intake, chat
  const [timerSeconds, setTimerSeconds] = useState(240); // 4 minutes into consult
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Clinical Guidance Notes state
  const [notes, setNotes] = useState({
    lifestyle: appointment.doctorNotes?.lifestyle || 'Recommend 7,500 daily steps. Aim for 7.5 hours of uninterrupted sleep with blue-light curfew 1 hour before bed.',
    diet: appointment.doctorNotes?.diet || 'Prioritize lean protein (1.2g per kg body weight), increase soluble fiber intake, and avoid late evening refined carbohydrate snacking.',
    activity: appointment.doctorNotes?.activity || 'Moderate resistance exercise 3x weekly and 20-minute post-meal brisk walking to optimize glycemic disposal.',
    treatmentOptions: appointment.doctorNotes?.treatmentOptions || 'Baseline metabolic blood panel recommended (Fasting Lipid profile, HbA1c, TSH, Renal function). Re-evaluate clinical response in 4 weeks.',
    medicinesAppropriate: appointment.doctorNotes?.medicinesAppropriate || 'No new prescription indicated at this time. Continue current daily supplements. Clinical prescription to be determined upon lab verification.'
  });

  const [chatMessages, setChatMessages] = useState([
    { sender: 'doctor', time: '10:02 AM', text: `Hello! I am Dr. ${appointment.doctorName.split(' ')[1] || 'Physician'}. I have reviewed your ${appointment.categoryName} questionnaire.` },
    { sender: 'patient', time: '10:03 AM', text: 'Thank you doctor, I appreciate the free consultation.' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Consultation duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSaveNotes = () => {
    updateDoctorClinicalGuidance(appointment.id, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'patient', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: newMsg.trim() }
    ]);
    setNewMsg('');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#090d16', zIndex: 1200, display: 'flex', flexDirection: 'column' }}>
      {/* Top Telehealth Header Bar */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
          <div>
            <strong style={{ fontSize: '1rem', display: 'block' }}>
              DoctorPlus Encrypted Telehealth Session • {appointment.id}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {appointment.categoryName} Consultation with {appointment.doctorName}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#1e293b', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> {formatTimer(timerSeconds)}
          </div>
          <button className="btn btn-sm btn-secondary" onClick={onClose} style={{ color: 'white', borderColor: '#334155' }}>
            Exit Session
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stage & Clinical Documentation Sidebar */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 400px', overflow: 'hidden' }}>
        {/* Left: Video Feeds & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', background: '#090d16', position: 'relative' }}>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', position: 'relative' }}>
            {/* Doctor Feed */}
            <div className="feed-box">
              <img
                src={appointment.doctorPhoto}
                alt={appointment.doctorName}
                style={{ filter: 'brightness(0.95)' }}
              />
              <div className="feed-box-label">
                <span className="feed-live-dot"></span>
                <span>{appointment.doctorName} (Doctor)</span>
              </div>
            </div>

            {/* Patient Feed */}
            <div className="feed-box" style={{ background: cameraOn ? '#1e293b' : '#0f172a' }}>
              {cameraOn ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8' }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                    alt={appointment.patientName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="feed-box-label">
                    <span className="feed-live-dot"></span>
                    <span>{appointment.patientName} (You)</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <VideoOff size={44} style={{ margin: '0 auto 8px' }} />
                  <div>Camera Off</div>
                  <div className="feed-box-label">
                    <span>{appointment.patientName} (Audio Only)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Call Controls */}
          <div className="video-controls-bar">
            <button
              className={`ctrl-btn ${!micOn ? 'active-off' : ''}`}
              onClick={() => setMicOn(!micOn)}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              className={`ctrl-btn ${!cameraOn ? 'active-off' : ''}`}
              onClick={() => setCameraOn(!cameraOn)}
              title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <button
              className="ctrl-btn"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              title="Share Lab Reports or Screen"
              style={{ background: isScreenSharing ? '#0284c7' : '#334155' }}
            >
              <Share2 size={20} />
            </button>

            <button
              className="ctrl-btn hangup"
              onClick={onClose}
              title="Leave Consultation"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Doctor Clinical Guidance Pad & Patient Intake */}
        <div style={{ background: 'white', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
            <button
              style={{
                flex: 1, padding: '12px 6px', fontSize: '0.8125rem', fontWeight: 700,
                color: activeTab === 'guidance' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'guidance' ? '2px solid var(--primary)' : 'none',
                background: activeTab === 'guidance' ? 'white' : 'transparent'
              }}
              onClick={() => setActiveTab('guidance')}
            >
              Clinical Guidance
            </button>
            <button
              style={{
                flex: 1, padding: '12px 6px', fontSize: '0.8125rem', fontWeight: 700,
                color: activeTab === 'intake' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'intake' ? '2px solid var(--primary)' : 'none',
                background: activeTab === 'intake' ? 'white' : 'transparent'
              }}
              onClick={() => setActiveTab('intake')}
            >
              Patient Intake
            </button>
            <button
              style={{
                flex: 1, padding: '12px 6px', fontSize: '0.8125rem', fontWeight: 700,
                color: activeTab === 'chat' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'chat' ? '2px solid var(--primary)' : 'none',
                background: activeTab === 'chat' ? 'white' : 'transparent'
              }}
              onClick={() => setActiveTab('chat')}
            >
              Chat ({chatMessages.length})
            </button>
          </div>

          {/* TAB 1: Clinical Guidance Notes (Section 17 & 14) */}
          {activeTab === 'guidance' && (
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.06em' }}>
                  Doctor Clinical Guidance
                </span>
                {savedSuccess && (
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Saved & Synced!
                  </span>
                )}
              </div>

              {/* Lifestyle Guidance */}
              <div style={{ marginBottom: '14px' }}>
                <label className="question-label" style={{ fontSize: '0.8125rem' }}>1. Lifestyle & Sleep Advice:</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '60px', fontSize: '0.825rem' }}
                  value={notes.lifestyle}
                  onChange={(e) => setNotes({ ...notes, lifestyle: e.target.value })}
                />
              </div>

              {/* Dietary Guidance */}
              <div style={{ marginBottom: '14px' }}>
                <label className="question-label" style={{ fontSize: '0.8125rem' }}>2. Dietary & Nutritional Guidance:</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '60px', fontSize: '0.825rem' }}
                  value={notes.diet}
                  onChange={(e) => setNotes({ ...notes, diet: e.target.value })}
                />
              </div>

              {/* Physical Activity */}
              <div style={{ marginBottom: '14px' }}>
                <label className="question-label" style={{ fontSize: '0.8125rem' }}>3. Physical Activity & Exercise:</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '60px', fontSize: '0.825rem' }}
                  value={notes.activity}
                  onChange={(e) => setNotes({ ...notes, activity: e.target.value })}
                />
              </div>

              {/* Treatment Options */}
              <div style={{ marginBottom: '14px' }}>
                <label className="question-label" style={{ fontSize: '0.8125rem' }}>4. Clinical Treatment Options & Lab Tests:</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '60px', fontSize: '0.825rem' }}
                  value={notes.treatmentOptions}
                  onChange={(e) => setNotes({ ...notes, treatmentOptions: e.target.value })}
                />
              </div>

              {/* Medicines Clinically Appropriate */}
              <div style={{ marginBottom: '16px' }}>
                <label className="question-label" style={{ fontSize: '0.8125rem' }}>
                  5. Medicines (Only When Clinically & Legally Appropriate):
                </label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '60px', fontSize: '0.825rem' }}
                  value={notes.medicinesAppropriate}
                  onChange={(e) => setNotes({ ...notes, medicinesAppropriate: e.target.value })}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block', marginTop: '2px' }}>
                  Prescribed only where legally and clinically appropriate per telemedicine jurisdiction rules.
                </span>
              </div>

              <button
                className="btn btn-primary btn-full"
                onClick={handleSaveNotes}
                id="save-clinical-guidance-btn"
              >
                Save & Transmit Guidance to Patient
              </button>
            </div>
          )}

          {/* TAB 2: Patient Intake Questionnaire Answers */}
          {activeTab === 'intake' && (
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px' }}>
                Patient Submitted Answers:
              </h4>

              {appointment.questionnaireAnswers && Object.keys(appointment.questionnaireAnswers).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.825rem' }}>
                  {Object.entries(appointment.questionnaireAnswers).map(([key, val], idx) => (
                    <div key={idx} style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}:
                      </strong>
                      <p style={{ marginTop: '4px', color: 'var(--text-main)' }}>{String(val)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No prior intake submitted for this session.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: In-Call Text Chat */}
          {activeTab === 'chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'patient' ? 'var(--primary)' : 'var(--bg-alt)',
                      color: msg.sender === 'patient' ? 'white' : 'var(--text-main)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      maxWidth: '85%',
                      fontSize: '0.825rem'
                    }}
                  >
                    <div>{msg.text}</div>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '2px' }}>
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Type a message to the doctor..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', outline: 'none' }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
