import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, LANGUAGES } from '../i18n/translations';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current language state
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('skillbridge_lang') || 'en';
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem('skillbridge_lang', langCode);
  };

  // Translation helper function
  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  // Current user state (Defaults to demo Alex Rivera, student)
  const [user, setUser] = useState({
    id: "user-student-1",
    email: "alex.student@skillbridge.edu",
    name: "Alex Rivera",
    role: "student", // 'student' | 'institution' | 'industry'
    institution: "Apex Institute of Technology",
    targetDomain: "software-engineering",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    credentials: [
      {
        id: "cred-1",
        title: "Meta Front-End Developer Professional Certificate",
        type: "certification",
        issuer: "Coursera / Meta",
        date: "2026-04-15",
        verified: true,
        skillsExtracted: ["Frontend Development (React/CSS)", "Git Version Control & CI/CD"]
      },
      {
        id: "cred-2",
        title: "Full-Stack E-Commerce Platform with Node.js & React",
        type: "project",
        issuer: "GitHub Project",
        date: "2026-06-20",
        verified: true,
        skillsExtracted: ["Backend APIs & Databases (Node/SQL)", "Frontend Development (React/CSS)"]
      },
      {
        id: "cred-3",
        title: "CS301: Advanced Data Structures & Algorithms",
        type: "coursework",
        issuer: "Apex Institute of Technology",
        date: "2026-05-10",
        verified: true,
        skillsExtracted: ["Data Structures & Algorithms"]
      }
    ],
    assessmentScores: {
      "software-engineering": {
        score: 80,
        date: "2026-09-20",
        eligible: true
      }
    },
    bio: "Results-driven Software Engineering student with verified expertise in React, Node.js APIs, System Design, and Data Structures."
  });

  const [activeTab, setActiveTab] = useState('gap-analysis');
  const [domains, setDomains] = useState([]);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchGapAnalysis(user.id, user.targetDomain || 'software-engineering');
    }
    fetchJobs();
  }, [user]);

  const fetchDomains = async () => {
    try {
      const res = await fetch('/api/domains');
      const data = await res.json();
      if (data.success) {
        setDomains(data.domains);
      }
    } catch (err) {
      console.error("Failed to fetch domains", err);
    }
  };

  const fetchGapAnalysis = async (userId, domainId) => {
    try {
      const res = await fetch(`/api/student/skill-gap/${userId}?domainId=${domainId}`);
      const data = await res.json();
      if (data.success) {
        setGapAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("Failed to fetch gap analysis", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobs?userId=${user?.id || ''}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const updateTargetDomain = async (domainId) => {
    try {
      const res = await fetch('/api/student/domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, domainId })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        fetchGapAnalysis(user.id, domainId);
        showToast(`Target domain updated to ${domainId.replace('-', ' ')}`, 'success');
      }
    } catch (err) {
      showToast("Error updating domain", "error");
    }
  };

  const addCredential = async (credData) => {
    try {
      const res = await fetch('/api/student/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...credData })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        fetchGapAnalysis(user.id, user.targetDomain || 'software-engineering');
        showToast("New credential uploaded & verified successfully!", "success");
      }
    } catch (err) {
      showToast("Error uploading credential", "error");
    }
  };

  const deleteCredential = async (credId) => {
    try {
      const res = await fetch(`/api/student/credentials/${user.id}/${credId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        fetchGapAnalysis(user.id, user.targetDomain || 'software-engineering');
        showToast("Credential removed.", "info");
      }
    } catch (err) {
      showToast("Error removing credential", "error");
    }
  };

  const submitAssessment = async (domainId, answers) => {
    try {
      const res = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, domainId, answers })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        fetchGapAnalysis(user.id, domainId);
        fetchJobs();
        return data;
      }
    } catch (err) {
      showToast("Error submitting assessment", "error");
    }
  };

  const switchRole = (role) => {
    if (role === 'student') {
      setUser({
        id: "user-student-1",
        email: "alex.student@skillbridge.edu",
        name: "Alex Rivera",
        role: "student",
        institution: "Apex Institute of Technology",
        targetDomain: "software-engineering",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        credentials: [
          { id: "cred-1", title: "Meta Front-End Developer Certificate", type: "certification", issuer: "Coursera", date: "2026-04-15", verified: true, skillsExtracted: ["Frontend Development (React/CSS)", "Git Version Control & CI/CD"] },
          { id: "cred-2", title: "Full-Stack Node.js Project", type: "project", issuer: "GitHub", date: "2026-06-20", verified: true, skillsExtracted: ["Backend APIs & Databases (Node/SQL)"] }
        ],
        assessmentScores: { "software-engineering": { score: 80, eligible: true } }
      });
      setActiveTab('gap-analysis');
      showToast("Switched role to Student (Alex Rivera)", "info");
    } else if (role === 'institution') {
      setUser({
        id: "user-institution-1",
        email: "mit.admin@university.edu",
        name: "Apex Institute of Technology",
        role: "institution",
        institutionName: "Apex Institute of Technology",
        avatar: "🏛️"
      });
      setActiveTab('institution');
      showToast("Switched role to Academic Institution (Apex Institute)", "info");
    } else if (role === 'industry') {
      setUser({
        id: "user-industry-1",
        email: "recruiter@techcorp.com",
        name: "Apex Global Tech",
        role: "industry",
        companyName: "Apex Global Tech",
        avatar: "🏢"
      });
      setActiveTab('industry');
      showToast("Switched role to Industry Recruiter (Apex Global Tech)", "info");
    }
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      LANGUAGES,
      t,
      user,
      setUser,
      activeTab,
      setActiveTab,
      domains,
      gapAnalysis,
      jobs,
      fetchJobs,
      updateTargetDomain,
      addCredential,
      deleteCredential,
      submitAssessment,
      switchRole,
      showToast,
      toastMessage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
