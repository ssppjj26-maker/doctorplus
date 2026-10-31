import React, { useState } from 'react';
import {
  MessageSquare, X, Send, AlertTriangle, ArrowRight, Bot, Stethoscope
} from 'lucide-react';
import { CATEGORIES } from '../data/healthcareData';

export function AiAssistantWidget({
  onSelectCategory,
  onStartBooking,
  onTriggerEmergency
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I am the DoctorPlus Assistant. I can help you find the right healthcare professional, explain how booking works, and navigate the platform.",
      chips: [
        'Find a doctor for Weight Management',
        'How does online consultation work?',
        'Find a Dermatologist for skin concern',
        'How are doctors verified?'
      ]
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const emergencyKeywords = [
    'chest pain', 'heart attack', 'cant breathe', "can't breathe", 'shortness of breath',
    'stroke', 'unconscious', 'fainted', 'suicide', 'self harm', 'bleeding severely',
    'severe allergic reaction', 'anaphylaxis', 'choking'
  ];

  const handleSend = (e) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    const lower = query.toLowerCase();
    const newMsgs = [...messages, { sender: 'user', text: query }];
    setInputVal('');

    // PRD Section 29: Emergency Symptom Screening
    const hasEmergency = emergencyKeywords.some((kw) => lower.includes(kw));

    if (hasEmergency) {
      newMsgs.push({
        sender: 'assistant',
        text: "⚠️ EMERGENCY WARNING: The symptoms you described may be life-threatening or require immediate physical emergency medical care. Please do NOT wait for an online consultation. Call your local emergency medical service (112, 911, or 999) or proceed to the nearest emergency department immediately.",
        isEmergency: true
      });
      setMessages(newMsgs);
      onTriggerEmergency();
      return;
    }

    // Navigation and Help Matching
    let replyText = "";
    let matchedCat = null;

    if (lower.includes('how') && (lower.includes('work') || lower.includes('book'))) {
      replyText = "DoctorPlus works in 3 simple steps: 1) Tell us your health concern or specialty, 2) Choose an appropriate doctor and review their verified qualifications, 3) Select an available date/time in your timezone and confirm.";
    } else if (lower.includes('verify') || lower.includes('verified') || lower.includes('qualification')) {
      replyText = "We verify medical council registration licenses and academic degrees provided by participating doctors before displaying verification badges. You can see each doctor's credentials directly on their profile.";
    } else if (lower.includes('free') || lower.includes('price') || lower.includes('cost')) {
      replyText = "In this preview platform environment, sample appointment scheduling is completely free. When real practice billing is active, each doctor's consultation fee is transparently stated upfront with no hidden fees.";
    } else {
      // Health concern match
      for (const cat of CATEGORIES) {
        if (lower.includes(cat.name.toLowerCase()) || lower.includes(cat.slug)) {
          matchedCat = cat;
          break;
        }
      }
      if (!matchedCat) {
        if (lower.includes('weight') || lower.includes('diet') || lower.includes('fat') || lower.includes('metabolism')) matchedCat = CATEGORIES.find(c => c.id === 'weight-management');
        else if (lower.includes('joint') || lower.includes('bone') || lower.includes('spine') || lower.includes('knee')) matchedCat = CATEGORIES.find(c => c.id === 'bone-joint');
        else if (lower.includes('tinnitus') || lower.includes('ear') || lower.includes('ringing')) matchedCat = CATEGORIES.find(c => c.id === 'tinnitus-ear');
        else if (lower.includes('sexual') || lower.includes('libido') || lower.includes('erectile')) matchedCat = CATEGORIES.find(c => c.id === 'sexual-health');
        else if (lower.includes('sugar') || lower.includes('diabetes')) matchedCat = CATEGORIES.find(c => c.id === 'diabetes');
        else if (lower.includes('skin') || lower.includes('hair') || lower.includes('acne') || lower.includes('pimple')) matchedCat = CATEGORIES.find(c => c.id === 'skin-hair');
        else if (lower.includes('dental') || lower.includes('tooth') || lower.includes('teeth')) matchedCat = CATEGORIES.find(c => c.id === 'dental');
        else if (lower.includes('prostate') || lower.includes('urine') || lower.includes('urination')) matchedCat = CATEGORIES.find(c => c.id === 'prostate');
        else matchedCat = CATEGORIES.find(c => c.id === 'general-health') || CATEGORIES[0];
      }

      replyText = `For ${matchedCat.name}, DoctorPlus connects you with qualified practitioners (${matchedCat.specialtyName}) who can review your history and advise on lifestyle, nutrition, and care options during an online consultation.`;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: replyText,
          matchedCategory: matchedCat
        }
      ]);
    }, 400);

    setMessages(newMsgs);
  };

  const handleChipClick = (chip) => {
    setInputVal(chip);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            padding: '12px 20px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 900,
            fontWeight: 600,
            fontSize: '14px'
          }}
          aria-label="Open DoctorPlus Assistant"
        >
          <Bot size={18} />
          <span>DoctorPlus Assistant</span>
        </button>
      )}

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '360px',
          maxWidth: 'calc(100vw - 32px)',
          height: '520px',
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 950,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} />
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>DoctorPlus Assistant</strong>
                <span style={{ fontSize: '11px', color: '#dbeafe' }}>Navigation & platform guide</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ color: 'white' }}
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Assistant Safety Notice per PRD Section 29 */}
          <div style={{
            background: 'var(--bg-alt)',
            borderBottom: '1px solid var(--border-color)',
            padding: '6px 12px',
            fontSize: '11px',
            color: 'var(--text-subtle)',
            textAlign: 'center'
          }}>
            Non-diagnostic assistant • Cannot prescribe or provide emergency care
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  background: m.isEmergency ? '#fef2f2' : (m.sender === 'user' ? 'var(--primary)' : 'var(--bg-alt)'),
                  color: m.isEmergency ? '#991b1b' : (m.sender === 'user' ? 'white' : 'var(--text-main)'),
                  border: m.isEmergency ? '1px solid #fecaca' : (m.sender === 'user' ? 'none' : '1px solid var(--border-color)'),
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '14px',
                  lineHeight: 1.5
                }}>
                  {m.text}
                </div>

                {/* Prompt Suggestion Chips */}
                {m.chips && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                    {m.chips.map((chip, ci) => (
                      <button
                        key={ci}
                        type="button"
                        onClick={() => handleChipClick(chip)}
                        style={{
                          background: 'white',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          fontSize: '12px',
                          color: 'var(--primary)',
                          textAlign: 'left'
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {/* Category Action Button */}
                {m.matchedCategory && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '8px' }}
                    onClick={() => {
                      setIsOpen(false);
                      onSelectCategory(m.matchedCategory.id);
                    }}
                  >
                    View {m.matchedCategory.name} Doctors <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} style={{ borderTop: '1px solid var(--border-color)', padding: '10px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about a concern or specialty..."
              style={{
                flex: 1,
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 12px' }}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
