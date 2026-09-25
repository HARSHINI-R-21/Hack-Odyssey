import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { readinessService, roadmapService, applicationService } from '../services/api';
import { ReadinessAnalysis, Roadmap, Application } from '../types';
import { IntelligenceLoopDiagram } from '../components/IntelligenceLoopDiagram';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, TrendingUp, Briefcase, AlertTriangle, ArrowRight,
  CheckCircle2, Target, Award, Play, Sparkles
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { startDemo } = useDemo();
  const [readiness, setReadiness] = useState<ReadinessAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [readRes, roadRes, appRes] = await Promise.all([
          readinessService.getReadiness().catch(() => null),
          roadmapService.getRoadmap().catch(() => null),
          applicationService.getApplications().catch(() => [])
        ]);
        if (readRes) setReadiness(readRes);
        if (roadRes) setRoadmap(roadRes);
        if (appRes) setApplications(appRes);
      } catch (err) {
        console.error("Failed to load student dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const overallScore = readiness?.overall_readiness || 76.0;
  const targetRole = readiness?.target_role || 'Backend Developer';
  const highestGap = readiness?.highest_impact_gap || 'REST API';
  const gapCount = readiness?.gap_skills_count || 2;
  const appCount = applications.length || 4;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                Verified Student Profile
              </span>
              <span className="text-xs text-slate-400">ABC Engineering College</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{user?.name || 'Arun Kumar'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Target Role: <strong className="text-white">{targetRole}</strong> • Verified evidence continuously matched against industry requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/passport"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Skill Passport</span>
            </Link>
            <Link
              to="/roadmap"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Continue Roadmap</span>
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
            >
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Find Jobs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Overall Readiness</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{overallScore}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Target Match</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: `${overallScore}%` }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Priority Skill Gaps</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{gapCount}</span>
            <span className="text-xs text-amber-400 font-medium">Require Action</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">Highest gap: <strong className="text-slate-200">{highestGap}</strong></p>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Roadmap Progress</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">58%</span>
            <span className="text-xs text-slate-400">Adaptive Tasks</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '58%' }}></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Applications</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{appCount}</span>
            <span className="text-xs text-purple-400 font-medium">Tracked</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Latest: TechCorp Solutions</p>
        </div>
      </div>

      {/* Recommended Action Card */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Top Strategic Focus</span>
            <h4 className="text-sm font-bold text-white">Improve REST API skills (Highest Impact Gap: 51% vs 70% required)</h4>
            <p className="text-xs text-slate-300">Completing your REST API project will boost overall readiness score by +6.2%</p>
          </div>
        </div>
        <Link
          to="/roadmap"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-all shadow-md shadow-amber-500/20"
        >
          Start REST API Module
        </Link>
      </div>

      {/* Career Intelligence Loop Stepper Component */}
      <IntelligenceLoopDiagram />

      {/* Grid: Skill Passport Summary & Priority Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verified Skills Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Verified Skill Passport (Arun Kumar)
            </h3>
            <Link to="/passport" className="text-xs text-blue-400 hover:underline">View All</Link>
          </div>

          <div className="space-y-3">
            {[
              { skill: 'Python', level: 91, conf: 'High', count: 3 },
              { skill: 'SQL', level: 82, conf: 'High', count: 2 },
              { skill: 'Git', level: 89, conf: 'High', count: 1 },
              { skill: 'Django', level: 64, conf: 'Medium', count: 1 },
              { skill: 'REST API', level: 51, conf: 'Medium', count: 1 }
            ].map((s) => (
              <div key={s.skill} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    {s.skill}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${s.conf === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {s.conf} Confidence
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{s.count} Verified Evidence Item(s)</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">{s.level}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Roadmap */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Adaptive Roadmap Milestones
            </h3>
            <Link to="/roadmap" className="text-xs text-blue-400 hover:underline">View Full Roadmap</Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Phase 1 • High Priority</span>
                <span className="text-[11px] font-semibold text-slate-400">In Progress</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1">REST API Fundamentals & Design</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Address highest gap (51% vs 70% required level)</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Phase 2 • Medium Priority</span>
                <span className="text-[11px] font-semibold text-slate-400">Up Next</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1">Django REST Framework Project</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Build production-grade REST API backend microservice</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Phase 3 • Assessment</span>
                <span className="text-[11px] font-semibold text-slate-400">Upcoming</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1">REST API Diagnostic Verification</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Validate skill proficiency to upgrade Skill Passport credential</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
