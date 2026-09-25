import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoProvider } from './context/DemoContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DemoTourBar } from './components/DemoTourBar';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AssessmentPage } from './pages/AssessmentPage';
import { TargetRolePage } from './pages/TargetRolePage';
import { SkillGraphPage } from './pages/SkillGraphPage';
import { SkillPassportPage } from './pages/SkillPassportPage';
import { ReadinessPage } from './pages/ReadinessPage';
import { AdaptiveRoadmapPage } from './pages/AdaptiveRoadmapPage';
import { LearningResourcesPage } from './pages/LearningResourcesPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { JobMarketplacePage } from './pages/JobMarketplacePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { InstitutionDashboard } from './pages/InstitutionDashboard';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <DemoTourBar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {user && <Sidebar />}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DemoProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/target-role" element={<TargetRolePage />} />
              <Route path="/skill-graph" element={<SkillGraphPage />} />
              <Route path="/passport" element={<SkillPassportPage />} />
              <Route path="/readiness" element={<ReadinessPage />} />
              <Route path="/roadmap" element={<AdaptiveRoadmapPage />} />
              <Route path="/resources" element={<LearningResourcesPage />} />
              <Route path="/resume-builder" element={<ResumeBuilderPage />} />
              <Route path="/jobs" element={<JobMarketplacePage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/recruiter/jobs" element={<RecruiterDashboard />} />
              <Route path="/institution" element={<InstitutionDashboard />} />
              <Route path="/institution/heatmap" element={<InstitutionDashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </DemoProvider>
    </AuthProvider>
  );
};

export default App;
