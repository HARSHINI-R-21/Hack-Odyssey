import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface DemoStep {
  id: number;
  title: string;
  description: string;
  path: string;
  userRole: 'STUDENT' | 'RECRUITER' | 'INSTITUTION';
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: '1. Student Home Dashboard',
    description: 'Overview of Arun Kumar, target role (Backend Dev), 76% readiness, and intelligence loop stepper.',
    path: '/dashboard',
    userRole: 'STUDENT'
  },
  {
    id: 2,
    title: '2. Career Assessment Diagnostic',
    description: 'Explainable assessment mapping interest & skills to Software Development domain recommendation.',
    path: '/assessment',
    userRole: 'STUDENT'
  },
  {
    id: 3,
    title: '3. Skill Graph Engine',
    description: 'Interactive node-and-edge dependency graph showing Python -> Django -> REST API.',
    path: '/skill-graph',
    userRole: 'STUDENT'
  },
  {
    id: 4,
    title: '4. Evidence Skill Passport',
    description: 'Evidence-backed verified skill credentials (Python 91%, REST API 51%) with confidence badges.',
    path: '/passport',
    userRole: 'STUDENT'
  },
  {
    id: 5,
    title: '5. Role Readiness Analysis',
    description: 'Transparent evaluation table & charts identifying REST API as highest-impact priority gap.',
    path: '/readiness',
    userRole: 'STUDENT'
  },
  {
    id: 6,
    title: '6. Find Opportunities & Explainable Match',
    description: 'Explore 8+ jobs with transparent match scoring ("Why you match" vs "Skills to improve") and apply.',
    path: '/jobs',
    userRole: 'STUDENT'
  },
  {
    id: 7,
    title: '7. AI Resume Builder',
    description: 'Auto-populated resume with verified skills & 1-click "Tailor Resume to Job" without fake claims.',
    path: '/resume-builder',
    userRole: 'STUDENT'
  },
  {
    id: 8,
    title: '8. Recruiter Dashboard & Candidate Ranking',
    description: 'Login as Recruiter (Priya Sharma), post job with AI JD skill extraction, & view ranked candidates.',
    path: '/recruiter',
    userRole: 'RECRUITER'
  },
  {
    id: 9,
    title: '9. Recruiter Feedback Engine',
    description: 'Recruiter submits: "Candidate needs stronger REST API experience" -> NLP extracts skill gap!',
    path: '/recruiter',
    userRole: 'RECRUITER'
  },
  {
    id: 10,
    title: '10. Adaptive Roadmap & Recalibration',
    description: 'Student roadmap automatically adapts! Click "Mark Complete" -> creates evidence & updates readiness.',
    path: '/roadmap',
    userRole: 'STUDENT'
  },
  {
    id: 11,
    title: '11. Institution Skill Intelligence',
    description: 'College dashboard with aggregated demand metrics & Industry Skill Heatmap.',
    path: '/institution',
    userRole: 'INSTITUTION'
  }
];

interface DemoContextType {
  isDemoActive: boolean;
  currentStepIndex: number;
  startDemo: () => void;
  stopDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  currentStep: DemoStep;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const startDemo = () => {
    setIsDemoActive(true);
    setCurrentStepIndex(0);
  };

  const stopDemo = () => {
    setIsDemoActive(false);
  };

  const nextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < DEMO_STEPS.length) {
      setCurrentStepIndex(index);
    }
  };

  const currentStep = DEMO_STEPS[currentStepIndex];

  return (
    <DemoContext.Provider
      value={{
        isDemoActive,
        currentStepIndex,
        startDemo,
        stopDemo,
        nextStep,
        prevStep,
        goToStep,
        currentStep
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
