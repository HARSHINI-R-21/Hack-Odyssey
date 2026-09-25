import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Building2, 
  GraduationCap, 
  User, 
  ChevronDown, 
  LogOut,
  Award,
  Globe
} from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, activeTab, setActiveTab, switchRole, gapAnalysis, language, setLanguage, LANGUAGES, t } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 13, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.75rem 1.5rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab(user.role === 'institution' ? 'institution' : (user.role === 'industry' ? 'industry' : 'gap-analysis'))}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit', background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SkillBridge
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 600 }}>
              {t('brandSubtitle')}
            </div>
          </div>
        </div>

        {/* Multilingual Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.35rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', flexWrap: 'wrap' }}>
          
          {user?.role === 'student' && (
            <>
              <button 
                onClick={() => setActiveTab('gap-analysis')}
                className={`btn-secondary ${activeTab === 'gap-analysis' ? 'active-nav-btn' : ''}`}
                style={{ 
                  background: activeTab === 'gap-analysis' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  borderColor: activeTab === 'gap-analysis' ? 'var(--primary-indigo)' : 'transparent',
                  fontSize: '0.85rem', padding: '0.45rem 0.85rem' 
                }}
              >
                <Target size={15} color={activeTab === 'gap-analysis' ? '#818cf8' : '#94a3b8'} />
                {t('gapAnalysisTab')}
                {gapAnalysis && (
                  <span style={{ fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.3)', color: '#818cf8', padding: '2px 6px', borderRadius: '10px' }}>
                    {gapAnalysis.skillMatchPercentage}%
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('assessment')}
                className={`btn-secondary ${activeTab === 'assessment' ? 'active-nav-btn' : ''}`}
                style={{ 
                  background: activeTab === 'assessment' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  borderColor: activeTab === 'assessment' ? 'var(--primary-cyan)' : 'transparent',
                  fontSize: '0.85rem', padding: '0.45rem 0.85rem' 
                }}
              >
                <CheckCircle2 size={15} color={activeTab === 'assessment' ? '#38bdf8' : '#94a3b8'} />
                {t('assessmentTab')}
                {gapAnalysis?.isEligible && (
                  <Award size={13} color="#34d399" title="Verified Eligible" />
                )}
              </button>

              <button 
                onClick={() => setActiveTab('resume')}
                className={`btn-secondary ${activeTab === 'resume' ? 'active-nav-btn' : ''}`}
                style={{ 
                  background: activeTab === 'resume' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  borderColor: activeTab === 'resume' ? 'var(--primary-violet)' : 'transparent',
                  fontSize: '0.85rem', padding: '0.45rem 0.85rem' 
                }}
              >
                <FileText size={15} color={activeTab === 'resume' ? '#a78bfa' : '#94a3b8'} />
                {t('resumeTab')}
              </button>

              <button 
                onClick={() => setActiveTab('jobs')}
                className={`btn-secondary ${activeTab === 'jobs' ? 'active-nav-btn' : ''}`}
                style={{ 
                  background: activeTab === 'jobs' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  borderColor: activeTab === 'jobs' ? 'var(--accent-emerald)' : 'transparent',
                  fontSize: '0.85rem', padding: '0.45rem 0.85rem' 
                }}
              >
                <Briefcase size={15} color={activeTab === 'jobs' ? '#34d399' : '#94a3b8'} />
                {t('jobsTab')}
              </button>

              <button 
                onClick={() => setActiveTab('chat')}
                className={`btn-secondary ${activeTab === 'chat' ? 'active-nav-btn' : ''}`}
                style={{ 
                  background: activeTab === 'chat' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                  borderColor: activeTab === 'chat' ? 'var(--accent-amber)' : 'transparent',
                  fontSize: '0.85rem', padding: '0.45rem 0.85rem' 
                }}
              >
                <MessageSquare size={15} color={activeTab === 'chat' ? '#fbbf24' : '#94a3b8'} />
                {t('chatTab')}
              </button>
            </>
          )}

          {user?.role === 'institution' && (
            <button 
              onClick={() => setActiveTab('institution')}
              className="btn-secondary"
              style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'var(--accent-emerald)', fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
            >
              <GraduationCap size={16} color="#34d399" />
              {t('institutionTab')}
            </button>
          )}

          {user?.role === 'industry' && (
            <button 
              onClick={() => setActiveTab('industry')}
              className="btn-secondary"
              style={{ background: 'rgba(245, 158, 11, 0.2)', borderColor: 'var(--accent-amber)', fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
            >
              <Building2 size={16} color="#fbbf24" />
              {t('industryTab')}
            </button>
          )}
        </nav>

        {/* Right Section: Language Toggle & User Account Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          
          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowLangDropdown(!showLangDropdown); setShowRoleDropdown(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '0.45rem 0.75rem',
                borderRadius: '12px',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <Globe size={15} color="#06b6d4" />
              <span>{currentLangObj.flag} {currentLangObj.name}</span>
              <ChevronDown size={12} color="#94a3b8" />
            </button>

            {showLangDropdown && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '180px',
                background: '#111827',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '0.5rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
                zIndex: 100
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', padding: '0 0.4rem' }}>
                  Select Language
                </div>

                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangDropdown(false); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '8px',
                      background: language === lang.code ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                      border: language === lang.code ? '1px solid rgba(6, 182, 212, 0.4)' : 'none',
                      color: language === lang.code ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      textAlign: 'left',
                      marginBottom: '0.2rem'
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account Role Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowRoleDropdown(!showRoleDropdown); setShowLangDropdown(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                padding: '0.4rem 0.75rem',
                borderRadius: '12px',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {typeof user?.avatar === 'string' && user.avatar.startsWith('http') ? (
                <img src={user.avatar} alt="User" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.2rem' }}>{user?.avatar || '👤'}</span>
              )}

              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {user?.role === 'student' ? t('studentRole') : (user?.role === 'institution' ? t('institutionRole') : t('industryRole'))}
                </div>
              </div>
              <ChevronDown size={14} color="#94a3b8" />
            </button>

            {/* Quick Demo Switcher Dropdown */}
            {showRoleDropdown && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '260px',
                background: '#111827',
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                padding: '0.75rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
                zIndex: 100
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                  {t('switchRole')}
                </div>

                <button 
                  onClick={() => { switchRole('student'); setShowRoleDropdown(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: user?.role === 'student' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left', marginBottom: '0.25rem' }}
                >
                  <User size={16} color="#818cf8" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('studentRole')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Alex Rivera (Software Eng)</div>
                  </div>
                </button>

                <button 
                  onClick={() => { switchRole('institution'); setShowRoleDropdown(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: user?.role === 'institution' ? 'rgba(16, 185, 129, 0.2)' : 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left', marginBottom: '0.25rem' }}
                >
                  <GraduationCap size={16} color="#34d399" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('institutionRole')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Apex Institute Analytics</div>
                  </div>
                </button>

                <button 
                  onClick={() => { switchRole('industry'); setShowRoleDropdown(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: user?.role === 'industry' ? 'rgba(245, 158, 11, 0.2)' : 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left', marginBottom: '0.5rem' }}
                >
                  <Building2 size={16} color="#fbbf24" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('industryRole')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Apex Global Tech Hiring</div>
                  </div>
                </button>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem' }}>
                  <button 
                    onClick={() => { onOpenAuth(); setShowRoleDropdown(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    <LogOut size={14} /> Log Out / Switch Account
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onOpenAuth}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          >
            {t('loginSignup')}
          </button>
        </div>

      </div>
    </header>
  );
}
