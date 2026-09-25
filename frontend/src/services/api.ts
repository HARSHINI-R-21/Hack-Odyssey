import axios from 'axios';
import {
  User, StudentProfile, Role, Skill, SkillEvidence, ReadinessAnalysis,
  Roadmap, Job, JobMatch, Application, InstitutionAnalytics
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name: string, email: string, password: string, role: string) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const studentService = {
  getProfile: async (): Promise<StudentProfile> => {
    const res = await api.get('/students/me');
    return res.data;
  },
  updateProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const res = await api.put('/students/me', data);
    return res.data;
  },
};

export const skillService = {
  getAllSkills: async (): Promise<Skill[]> => {
    const res = await api.get('/skills');
    return res.data;
  },
  getMyVerifiedSkills: async (): Promise<Record<number, any>> => {
    const res = await api.get('/skills/me');
    return res.data;
  },
  getMyEvidences: async (): Promise<SkillEvidence[]> => {
    const res = await api.get('/skills/me/evidence');
    return res.data;
  },
};

export const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    const res = await api.get('/roles');
    return res.data;
  },
  getRoleGraph: async (roleId: number) => {
    const res = await api.get(`/roles/${roleId}/graph`);
    return res.data;
  },
  setTargetRole: async (roleId: number) => {
    const res = await api.post('/roles/me/target-role', { role_id: roleId });
    return res.data;
  },
};

export const readinessService = {
  getReadiness: async (): Promise<ReadinessAnalysis> => {
    const res = await api.get('/readiness');
    return res.data;
  },
  getSkillGaps: async () => {
    const res = await api.get('/skill-gaps');
    return res.data;
  },
};

export const roadmapService = {
  getRoadmap: async (): Promise<Roadmap> => {
    const res = await api.get('/roadmap');
    return res.data;
  },
  completeItem: async (itemId: number) => {
    const res = await api.post(`/roadmap/items/${itemId}/complete`);
    return res.data;
  },
};

export const jobService = {
  getAllJobs: async (): Promise<Job[]> => {
    const res = await api.get('/jobs');
    return res.data;
  },
  getJobDetail: async (jobId: number): Promise<Job> => {
    const res = await api.get(`/jobs/${jobId}`);
    return res.data;
  },
  getMyJobMatches: async (): Promise<JobMatch[]> => {
    const res = await api.get('/jobs/me/job-matches');
    return res.data;
  },
  createJob: async (jobData: any) => {
    const res = await api.post('/jobs', jobData);
    return res.data;
  },
};

export const applicationService = {
  applyToJob: async (jobId: number) => {
    const res = await api.post(`/applications/jobs/${jobId}/apply`);
    return res.data;
  },
  getApplications: async (): Promise<Application[]> => {
    const res = await api.get('/applications');
    return res.data;
  },
  submitFeedback: async (appId: number, feedbackText: string, updatedStatus?: string) => {
    const res = await api.post(`/applications/${appId}/feedback`, {
      feedback_text: feedbackText,
      updated_status: updatedStatus || 'UNDER_REVIEW',
    });
    return res.data;
  },
};

export const institutionService = {
  getAnalytics: async (): Promise<InstitutionAnalytics> => {
    const res = await api.get('/institution/analytics');
    return res.data;
  },
};

export const aiService = {
  extractSkills: async (text: string) => {
    const res = await api.post('/ai/extract-skills', { text });
    return res.data;
  },
  tailorResume: async (jobId: number) => {
    const res = await api.post('/ai/tailor-resume', { job_id: jobId });
    return res.data;
  },
};

export default api;
