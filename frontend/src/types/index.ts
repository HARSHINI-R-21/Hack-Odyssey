export type UserRole = 'STUDENT' | 'RECRUITER' | 'INSTITUTION';

export interface User {
  id: number;
  name: str;
  email: str;
  role: UserRole;
  created_at?: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  college: string;
  degree: string;
  branch: string;
  graduation_year: number;
  interests?: string;
  preferred_domain?: string;
  target_role_id?: number;
  target_role?: Role;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
}

export interface RoleSkill {
  id: number;
  skill_id: number;
  required_level: number;
  importance: string;
  skill: Skill;
}

export interface Role {
  id: number;
  name: string;
  domain: string;
  description?: string;
  role_skills?: RoleSkill[];
}

export interface SkillEvidence {
  id: number;
  skill_id: number;
  skill_name: string;
  evidence_type: string;
  title: string;
  source: string;
  proficiency: number;
  confidence: 'High' | 'Medium' | 'Low';
  verification_status: string;
  created_at: string;
}

export interface SkillGapItem {
  skill_id: number;
  skill_name: string;
  required_level: number;
  current_proficiency: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  importance: string;
  confidence: 'High' | 'Medium' | 'Low';
  evidence_count: number;
  evidence_types: string[];
}

export interface ReadinessAnalysis {
  target_role: string;
  overall_readiness: number;
  strong_skills_count: number;
  gap_skills_count: number;
  highest_impact_gap: string | null;
  gaps: SkillGapItem[];
}

export interface LearningResource {
  id: number;
  skill_id: number;
  title: string;
  provider: string;
  url?: string;
  difficulty: string;
  estimated_hours: number;
}

export interface RoadmapItem {
  id: number;
  roadmap_id: number;
  skill_id: number;
  skill_name: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  recommended_action?: string;
  resource?: LearningResource;
}

export interface Roadmap {
  id: number;
  student_id: number;
  role_id: number;
  role_name: string;
  readiness_score: number;
  items: RoadmapItem[];
  updated_at: string;
}

export interface JobSkill {
  skill_id: number;
  skill_name?: string;
  required_level: number;
  importance: string;
}

export interface Job {
  id: number;
  recruiter_id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  experience_level: string;
  status: string;
  created_at: string;
  skills: JobSkill[];
}

export interface JobMatch {
  job: Job;
  match_score: number;
  why_you_match: string[];
  skills_to_improve: string[];
  readiness_level: string;
}

export interface Application {
  id: number;
  student_id: number;
  student_name: string;
  job_id: number;
  job_title: string;
  company: string;
  status: string;
  applied_at: string;
  match_score?: number;
  feedback_text?: string;
  extracted_skills?: string[];
}

export interface HeatmapItem {
  skill_name: string;
  category: string;
  industry_demand: 'High' | 'Medium' | 'Low';
  demand_count: number;
  student_readiness: 'High' | 'Medium' | 'Low';
  avg_proficiency: number;
  gap_level: 'High' | 'Medium' | 'Low';
}

export interface InstitutionAnalytics {
  summary: {
    total_students: number;
    avg_readiness_score: number;
    total_applications: number;
    placement_rate: string;
  };
  industry_skill_heatmap: HeatmapItem[];
  most_demanded_skills: { skill: string; demand_jobs: number }[];
}
