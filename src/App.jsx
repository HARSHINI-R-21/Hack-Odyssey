import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import DomainSelector from './components/DomainSelector';
import CertificateUploader from './components/CertificateUploader';
import SkillGapAnalyzer from './components/SkillGapAnalyzer';
import AssessmentQuiz from './components/AssessmentQuiz';
import ResumeBuilder from './components/ResumeBuilder';
import JobMatchingEngine from './components/JobMatchingEngine';
import IndustryDashboard from './components/IndustryDashboard';
import InstitutionDashboard from './components/InstitutionDashboard';
import CommunityChat from './components/CommunityChat';
import { Sparkles, Target, Award, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import './styles/index.css';

function MainContent() {
  const { user, activeTab, toastMessage } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main View Container */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.5rem' }}>
        
        {/* Student Active Tab Views */}
        {user?.role === 'student' && (
          <>
            {activeTab === 'gap-analysis' && (
              <div>
                <DomainSelector />
                <CertificateUploader />
                <SkillGapAnalyzer />
              </div>
            )}

            {activeTab === 'assessment' && <AssessmentQuiz />}
            {activeTab === 'resume' && <ResumeBuilder />}
            {activeTab === 'jobs' && <JobMatchingEngine />}
            {activeTab === 'chat' && <CommunityChat />}
          </>
        )}

        {/* Academic Institution Active Tab View */}
        {user?.role === 'institution' && <InstitutionDashboard />}

        {/* Industry Recruiter Active Tab View */}
        {user?.role === 'industry' && <IndustryDashboard />}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        background: 'rgba(10, 13, 20, 0.95)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>SkillBridge Platform</strong> — Bridging Students, Universities & Tech Industry
          </div>
          <div>
            Designed with AI Competency Analysis & Moderated Peer Collaboration
          </div>
        </div>
      </footer>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: toastMessage.type === 'error' ? '#881337' : (toastMessage.type === 'success' ? '#064e3b' : '#1e1b4b'),
          border: `1px solid ${toastMessage.type === 'error' ? '#f43f5e' : (toastMessage.type === 'success' ? '#10b981' : '#6366f1')}`,
          color: '#ffffff',
          padding: '0.9rem 1.25rem',
          borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          maxWidth: '420px',
          fontSize: '0.88rem',
          lineHeight: '1.4',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {toastMessage.type === 'error' ? <AlertCircle size={20} color="#f43f5e" /> : (toastMessage.type === 'success' ? <CheckCircle2 size={20} color="#34d399" /> : <Info size={20} color="#818cf8" />)}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
