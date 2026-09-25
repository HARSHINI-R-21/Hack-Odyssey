// server/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { DOMAINS, INITIAL_ASSESSMENTS, INITIAL_JOBS, INITIAL_CHAT_MESSAGES, INITIAL_USERS } from './data/mockData.js';
import { moderateMessage } from './middleware/moderation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database (persisted during server session)
let users = [...INITIAL_USERS];
let jobs = [...INITIAL_JOBS];
let chatMessages = { ...INITIAL_CHAT_MESSAGES };
let applications = [
  {
    id: "app-1",
    jobId: "job-101",
    studentId: "user-student-1",
    studentName: "Alex Rivera",
    studentEmail: "alex.student@skillbridge.edu",
    domain: "software-engineering",
    matchScore: 82,
    eligible: true,
    assessmentScore: 80,
    status: "Shortlisted",
    appliedDate: "2026-09-24"
  }
];

// Helper: Calculate Skill Gap for a user in a target domain
function calculateUserSkillGap(user, domainId) {
  const targetDomain = DOMAINS.find(d => d.id === domainId) || DOMAINS[0];
  const userCredentials = user.credentials || [];
  
  // Extract all acquired skills from credentials
  const acquiredSkillNames = new Set();
  userCredentials.forEach(cred => {
    (cred.skillsExtracted || []).forEach(skill => acquiredSkillNames.add(skill));
  });

  // Check assessment bonus if user passed assessment in this domain
  const userAssessment = user.assessmentScores && user.assessmentScores[domainId];
  const hasPassedAssessment = userAssessment && userAssessment.score >= 50;

  let totalRequiredWeight = 0;
  let totalAcquiredWeight = 0;

  const standardsComparison = targetDomain.standards.map(standard => {
    const isAcquiredFromCred = acquiredSkillNames.has(standard.name);
    
    let currentLevel = 0;
    if (isAcquiredFromCred) currentLevel += Math.round(standard.reqLevel * 0.7);
    if (hasPassedAssessment) currentLevel += Math.round(standard.reqLevel * 0.35);
    
    currentLevel = Math.min(100, currentLevel);
    
    totalRequiredWeight += standard.reqLevel;
    totalAcquiredWeight += currentLevel;

    return {
      skillName: standard.name,
      reqLevel: standard.reqLevel,
      studentLevel: currentLevel,
      status: currentLevel >= standard.reqLevel ? "Mastered" : (currentLevel > 0 ? "In Progress" : "Missing")
    };
  });

  const skillMatchPercentage = Math.min(100, Math.round((totalAcquiredWeight / totalRequiredWeight) * 100));
  const skillGapPercentage = 100 - skillMatchPercentage;

  const acquiredSkills = standardsComparison.filter(s => s.studentLevel > 0).map(s => s.skillName);
  const missingSkills = standardsComparison.filter(s => s.studentLevel < s.reqLevel).map(s => s.skillName);

  // Generate personalized learning roadmap steps
  const roadmap = missingSkills.map((skill, index) => ({
    step: index + 1,
    skill: skill,
    targetGoal: `Achieve 80%+ proficiency in ${skill}`,
    recommendedDuration: `${3 + index * 2} Weeks`,
    status: "Upcoming"
  }));

  // Recommended courses for missing skills
  const recommendedCourses = targetDomain.courseRecommendations.filter(course => 
    missingSkills.includes(course.skillCovered)
  );

  return {
    domainId,
    domainName: targetDomain.name,
    skillMatchPercentage,
    skillGapPercentage,
    standardsComparison,
    acquiredSkills,
    missingSkills,
    roadmap,
    recommendedCourses: recommendedCourses.length > 0 ? recommendedCourses : targetDomain.courseRecommendations,
    isEligible: hasPassedAssessment
  };
}

// ================= API ROUTES =================

// 1. Authentication & Roles
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid email or password credentials." });
  }
  return res.json({ success: true, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, institution, companyName } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "Please fill all required fields." });
  }
  
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: "Account with this email already exists." });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
    role,
    institution: institution || "Apex Institute of Technology",
    companyName: companyName || "",
    targetDomain: "software-engineering",
    avatar: role === 'student' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' : (role === 'institution' ? '🏛️' : '🏢'),
    credentials: [],
    assessmentScores: {},
    bio: `Registered as ${role} on SkillBridge.`
  };

  users.push(newUser);
  res.json({ success: true, user: newUser });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ success: true, user });
});

// 2. Domains
app.get('/api/domains', (req, res) => {
  res.json({ success: true, domains: DOMAINS });
});

// 3. Student Target Domain & Credentials
app.post('/api/student/domain', (req, res) => {
  const { userId, domainId } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.targetDomain = domainId;
  res.json({ success: true, user });
});

app.post('/api/student/credentials', (req, res) => {
  const { userId, title, type, issuer, date, skillsExtracted } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const newCredential = {
    id: `cred-${Date.now()}`,
    title,
    type: type || "certification",
    issuer: issuer || "Self-Verified",
    date: date || new Date().toISOString().split('T')[0],
    verified: true,
    skillsExtracted: skillsExtracted || ["Frontend Development (React/CSS)"]
  };

  if (!user.credentials) user.credentials = [];
  user.credentials.push(newCredential);

  res.json({ success: true, credential: newCredential, user });
});

app.delete('/api/student/credentials/:userId/:credId', (req, res) => {
  const { userId, credId } = req.params;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.credentials = (user.credentials || []).filter(c => c.id !== credId);
  res.json({ success: true, user });
});

// 4. Skill Gap Analysis & Calculation Engine
app.get('/api/student/skill-gap/:userId', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const domainId = req.query.domainId || user.targetDomain || "software-engineering";
  const analysis = calculateUserSkillGap(user, domainId);
  res.json({ success: true, analysis });
});

// 5. Assessments & Eligibility Gate
app.get('/api/assessments/:domainId', (req, res) => {
  const domainId = req.params.domainId;
  const questions = INITIAL_ASSESSMENTS[domainId] || INITIAL_ASSESSMENTS["software-engineering"];
  res.json({ success: true, questions });
});

app.post('/api/assessments/submit', (req, res) => {
  const { userId, domainId, answers } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const questions = INITIAL_ASSESSMENTS[domainId] || INITIAL_ASSESSMENTS["software-engineering"];
  let correctCount = 0;

  questions.forEach(q => {
    if (answers[q.id] === q.correctIndex) {
      correctCount += 1;
    }
  });

  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const isEligible = scorePercentage >= 50;

  if (!user.assessmentScores) user.assessmentScores = {};
  user.assessmentScores[domainId] = {
    score: scorePercentage,
    date: new Date().toISOString().split('T')[0],
    eligible: isEligible,
    correctCount,
    totalCount: questions.length
  };

  res.json({
    success: true,
    scorePercentage,
    correctCount,
    totalCount: questions.length,
    isEligible,
    badgeUnlocked: isEligible ? "Industry Verified / Recruitment Eligible" : null,
    user
  });
});

// 6. Job Matching Engine & Industry Applications
app.get('/api/jobs', (req, res) => {
  const { userId, domainFilter } = req.query;
  const user = users.find(u => u.id === userId);

  let filteredJobs = jobs;
  if (domainFilter && domainFilter !== "all") {
    filteredJobs = filteredJobs.filter(j => j.domain === domainFilter);
  }

  const jobsWithMatch = filteredJobs.map(job => {
    let matchScore = 60;
    let isEligible = false;

    if (user && user.role === 'student') {
      const userDomain = job.domain;
      const userGapAnalysis = calculateUserSkillGap(user, userDomain);
      matchScore = userGapAnalysis.skillMatchPercentage;
      
      const userAssessment = user.assessmentScores && user.assessmentScores[userDomain];
      isEligible = userAssessment ? userAssessment.score >= (job.minScoreRequired || 50) : false;
    }

    const hasApplied = applications.some(a => a.jobId === job.id && a.studentId === userId);

    return {
      ...job,
      userMatchScore: matchScore,
      userEligible: isEligible,
      hasApplied
    };
  });

  res.json({ success: true, jobs: jobsWithMatch });
});

app.post('/api/jobs', (req, res) => {
  const { title, company, location, type, domain, stipend, description, requiredSkills, minScoreRequired } = req.body;
  const newJob = {
    id: `job-${Date.now()}`,
    title,
    company: company || "Tech Innovators Inc",
    logo: "💼",
    location: location || "Remote",
    type: type || "Full Time",
    domain: domain || "software-engineering",
    stipend: stipend || "$80,000 / yr",
    description: description || "Exciting engineering role.",
    requiredSkills: requiredSkills || [],
    minScoreRequired: minScoreRequired || 50,
    applicants: 0
  };

  jobs.unshift(newJob);
  res.json({ success: true, job: newJob });
});

app.post('/api/jobs/apply', (req, res) => {
  const { jobId, userId } = req.body;
  const user = users.find(u => u.id === userId);
  const job = jobs.find(j => j.id === jobId);

  if (!user || !job) return res.status(404).json({ message: "User or Job not found" });

  const existingApp = applications.find(a => a.jobId === jobId && a.studentId === userId);
  if (existingApp) return res.status(400).json({ message: "You have already applied to this position." });

  const gapAnalysis = calculateUserSkillGap(user, job.domain);
  const userAssessment = user.assessmentScores && user.assessmentScores[job.domain];

  const newApp = {
    id: `app-${Date.now()}`,
    jobId,
    jobTitle: job.title,
    company: job.company,
    studentId: userId,
    studentName: user.name,
    studentEmail: user.email,
    domain: job.domain,
    matchScore: gapAnalysis.skillMatchPercentage,
    eligible: userAssessment ? userAssessment.score >= 50 : false,
    assessmentScore: userAssessment ? userAssessment.score : 0,
    status: "Under Review",
    appliedDate: new Date().toISOString().split('T')[0]
  };

  applications.push(newApp);
  job.applicants += 1;

  res.json({ success: true, application: newApp });
});

app.get('/api/industry/applications', (req, res) => {
  res.json({ success: true, applications });
});

app.post('/api/industry/applications/status', (req, res) => {
  const { applicationId, status } = req.body;
  const app = applications.find(a => a.id === applicationId);
  if (!app) return res.status(404).json({ message: "Application not found" });

  app.status = status;
  res.json({ success: true, application: app });
});

// 7. Academic Institution Dashboard & Analytics
app.get('/api/institution/analytics', (req, res) => {
  const cohortMetrics = {
    totalStudents: 420,
    placementEligibleCount: 302,
    placementReadinessPercentage: 72,
    domainBreakdown: [
      { domain: "Software Engineering", studentCount: 180, avgMatchScore: 78, verifiedEligibleCount: 142 },
      { domain: "Data Science & AI", studentCount: 110, avgMatchScore: 68, verifiedEligibleCount: 75 },
      { domain: "Cloud & DevOps", studentCount: 65, avgMatchScore: 74, verifiedEligibleCount: 48 },
      { domain: "Cyber Security", studentCount: 40, avgMatchScore: 65, verifiedEligibleCount: 25 },
      { domain: "Management & Tech", studentCount: 25, avgMatchScore: 82, verifiedEligibleCount: 20 }
    ],
    topDeficientSkills: [
      { skill: "System Design & Architecture", missingCount: 165, percentage: 39 },
      { skill: "Docker & Container Orchestration", missingCount: 142, percentage: 34 },
      { skill: "MLOps & Model Deployment", missingCount: 98, percentage: 23 },
      { skill: "Ethical Hacking & PenTesting", missingCount: 75, percentage: 18 }
    ]
  };

  res.json({ success: true, metrics: cohortMetrics });
});

// 8. Moderated Student Community Chat
app.get('/api/chat/messages/:channelId', (req, res) => {
  const channelId = req.params.channelId;
  const messages = chatMessages[channelId] || [];
  res.json({ success: true, messages });
});

app.post('/api/chat/messages', (req, res) => {
  const { channelId, senderName, senderRole, senderAvatar, content } = req.body;
  
  const modResult = moderateMessage(content);
  if (!modResult.isAllowed) {
    return res.status(400).json({
      success: false,
      blocked: true,
      reason: modResult.reason,
      matchedTerms: modResult.matchedTerms
    });
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    sender: senderName || "Anonymous Student",
    role: senderRole || "student",
    avatar: senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    content: content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    flagged: false
  };

  if (!chatMessages[channelId]) chatMessages[channelId] = [];
  chatMessages[channelId].push(newMessage);

  res.json({ success: true, message: newMessage, moderation: modResult });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`SkillBridge Backend API running on http://localhost:${PORT}`);
});
