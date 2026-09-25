import React, { useEffect, useState } from 'react';
import { applicationService } from '../services/api';
import { Application } from '../types';
import { FileSpreadsheet, Building2, Calendar, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await applicationService.getApplications();
        setApplications(apps);
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const defaultApps: Application[] = [
    {
      id: 1,
      student_id: 1,
      student_name: 'Arun Kumar',
      job_id: 1,
      job_title: 'Junior Backend Developer',
      company: 'TechCorp Solutions',
      status: 'UNDER_REVIEW',
      applied_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      match_score: 84.0,
      feedback_text: 'Candidate needs stronger REST API experience and more backend deployment exposure.',
      extracted_skills: ['REST API', 'Backend Deployment']
    },
    {
      id: 2,
      student_id: 1,
      student_name: 'Arun Kumar',
      job_id: 3,
      job_title: 'Associate Software Engineer',
      company: 'Global Cloud Systems',
      status: 'SHORTLISTED',
      applied_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      match_score: 92.0
    }
  ];

  const appList = applications.length > 0 ? applications : defaultApps;

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'APPLIED':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full text-xs font-bold">APPLIED</span>;
      case 'UNDER_REVIEW':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">UNDER REVIEW</span>;
      case 'SHORTLISTED':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full text-xs font-bold">SHORTLISTED</span>;
      case 'SELECTED':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">SELECTED 🎉</span>;
      case 'REJECTED':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full text-xs font-bold">REJECTED</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full text-xs font-bold">{st}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">My Applications & Feedback Loop</h1>
            <p className="text-xs text-slate-400">Track job application status & live recruiter feedback recommendations</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {appList.map((app) => (
          <div key={app.id} className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" /> {app.company}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white">{app.job_title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  {app.match_score || 84}% Match Score
                </span>
                {getStatusBadge(app.status)}
              </div>
            </div>

            {/* Feedback Box if available */}
            {app.feedback_text && (
              <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span>Recruiter Feedback Received:</span>
                </div>
                <p className="text-xs text-slate-200 italic">"{app.feedback_text}"</p>
                {app.extracted_skills && app.extracted_skills.length > 0 && (
                  <div className="pt-2 flex items-center gap-2 text-[11px]">
                    <span className="font-semibold text-slate-400">Extracted Skill Gaps:</span>
                    {app.extracted_skills.map((sk) => (
                      <span key={sk} className="bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/30">
                        {sk}
                      </span>
                    ))}
                    <span className="text-emerald-400 font-bold ml-auto">✓ Roadmap Calibrated</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
