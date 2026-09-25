import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Printer, 
  Download, 
  Sparkles, 
  Award, 
  Briefcase, 
  BookOpen, 
  CheckCircle2, 
  User, 
  Mail, 
  Globe, 
  MapPin,
  Palette
} from 'lucide-react';

export default function ResumeBuilder() {
  const { user, gapAnalysis } = useApp();
  const [accentColor, setAccentColor] = useState('#6366f1'); // default indigo accent
  const [customBio, setCustomBio] = useState(
    user?.bio || "Results-driven Software Engineering student with verified expertise in React, Node.js APIs, System Design, and Data Structures."
  );

  const handlePrint = () => {
    window.print();
  };

  const isEligible = gapAnalysis?.isEligible || false;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
      
      {/* Control Panel Sidebar */}
      <div className="glass-card" style={{ position: 'sticky', top: '90px' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={20} color="#06b6d4" /> Resume Customizer
        </h3>

        {/* Color accent selection */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Theme Accent Color</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['#6366f1', '#06b6d4', '#10b981', '#ec4899', '#f59e0b'].map(color => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: color,
                  border: accentColor === color ? '2px solid #ffffff' : 'none', cursor: 'pointer',
                  transform: accentColor === color ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Custom Bio Edit */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Executive Summary Bio</label>
          <textarea
            className="form-input"
            rows={4}
            value={customBio}
            onChange={e => setCustomBio(e.target.value)}
            style={{ fontSize: '0.85rem', resize: 'vertical' }}
          />
        </div>

        {/* Sync Status Badge */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', padding: '0.8rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>⚡ SkillBridge Auto-Synced Data:</div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span>✓ Verified Credentials: <strong>{user?.credentials?.length || 0}</strong></span>
            <span>✓ Domain: <strong>{gapAnalysis?.domainName || 'Software Eng'}</strong></span>
            <span>✓ Match Percentage: <strong>{gapAnalysis?.skillMatchPercentage || 0}%</strong></span>
            <span>✓ Industry Verified: <strong>{isEligible ? 'YES (Passed)' : 'Pending'}</strong></span>
          </div>
        </div>

        <button 
          onClick={handlePrint}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', background: accentColor }}
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* Live Resume Document Preview (Styled clean for print & preview) */}
      <div 
        id="resume-printable-area"
        style={{
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          minHeight: '800px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        
        {/* Header */}
        <div style={{ borderBottom: `3px solid ${accentColor}`, paddingBottom: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', textTransform: 'capitalize' }}>
              {user?.name || "Alex Rivera"}
            </h1>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: accentColor, marginTop: '0.2rem' }}>
              Target Role: {gapAnalysis?.domainName || "Software Engineer"}
            </div>
            
            <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginTop: '0.6rem', fontSize: '0.85rem', color: '#475569' }}>
              <span>✉️ {user?.email}</span>
              <span>🎓 {user?.institution || "Apex Institute of Technology"}</span>
              <span>🌐 skillbridge.edu/p/{user?.id || 'alex'}</span>
            </div>
          </div>

          {/* Industry Verified Badge Stamp */}
          <div style={{
            border: `2px solid ${isEligible ? '#10b981' : '#cbd5e1'}`,
            borderRadius: '12px',
            padding: '0.5rem 0.8rem',
            background: isEligible ? '#ecfdf5' : '#f8fafc',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: isEligible ? '#047857' : '#64748b', textTransform: 'uppercase' }}>
              SkillBridge Certification
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isEligible ? '#059669' : '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isEligible ? "✓ INDUSTRY VERIFIED" : "LEVEL 1 CANDIDATE"}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {gapAnalysis?.skillMatchPercentage || 0}% Benchmark Match
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
            Executive Summary
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6' }}>
            {customBio}
          </p>
        </div>

        {/* Competencies & Skills Matrix */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
            Verified Technical Competencies
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(gapAnalysis?.standardsComparison || []).map((std, i) => (
              <span 
                key={i} 
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  background: std.studentLevel >= std.reqLevel ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${std.studentLevel >= std.reqLevel ? '#86efac' : '#cbd5e1'}`,
                  color: std.studentLevel >= std.reqLevel ? '#15803d' : '#334155',
                  fontWeight: 600
                }}
              >
                {std.skillName} ({std.studentLevel}%)
              </span>
            ))}
          </div>
        </div>

        {/* Projects & Certifications */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
            Verified Projects & Certifications
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {(user?.credentials || []).map((cred) => (
              <div key={cred.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{cred.title}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Issuer: <strong>{cred.issuer}</strong> • Type: {cred.type.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.2rem' }}>
                    Skills: {(cred.skillsExtracted || []).join(', ')}
                  </div>
                </div>

                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{cred.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic History */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
            Education
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Bachelor of Science in Computer Science & Engineering
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                {user?.institution || "Apex Institute of Technology"}
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'right' }}>
              Graduation: 2026<br />GPA: 3.8 / 4.0
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
