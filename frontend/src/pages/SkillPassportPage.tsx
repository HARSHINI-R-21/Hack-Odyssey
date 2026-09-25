import React, { useEffect, useState } from 'react';
import { skillService, readinessService } from '../services/api';
import { SkillEvidence } from '../types';
import { ShieldCheck, Award, CheckCircle2, FileCheck, Code2, BookOpen, Sparkles, ExternalLink } from 'lucide-react';

export const SkillPassportPage: React.FC = () => {
  const [evidences, setEvidences] = useState<SkillEvidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evs = await skillService.getMyEvidences();
        setEvidences(evs);
      } catch (err) {
        console.error("Failed to load evidence:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const passportSkills = [
    {
      name: 'Python',
      proficiency: 91,
      confidence: 'High',
      evidenceCount: 3,
      types: ['Course', 'Project', 'Assessment'],
      details: [
        { type: 'Course', title: 'Python for Backend Engineering (Coursera)' },
        { type: 'Project', title: 'Automated Task Scheduler CLI (GitHub Repo)' },
        { type: 'Assessment', title: 'Standard Python Diagnostic Test' }
      ]
    },
    {
      name: 'SQL',
      proficiency: 82,
      confidence: 'High',
      evidenceCount: 2,
      types: ['Course', 'Project'],
      details: [
        { type: 'Course', title: 'Relational Database Design (Udemy)' },
        { type: 'Project', title: 'E-commerce Database Schema & Queries' }
      ]
    },
    {
      name: 'Git',
      proficiency: 89,
      confidence: 'High',
      evidenceCount: 1,
      types: ['Project'],
      details: [
        { type: 'Project', title: 'Multi-Contributor Open Source Repo (GitHub)' }
      ]
    },
    {
      name: 'Django',
      proficiency: 64,
      confidence: 'Medium',
      evidenceCount: 1,
      types: ['Course'],
      details: [
        { type: 'Course', title: 'Django Web Application Framework Course' }
      ]
    },
    {
      name: 'REST API',
      proficiency: 51,
      confidence: 'Medium',
      evidenceCount: 1,
      types: ['Project'],
      details: [
        { type: 'Project', title: 'Basic CRUD REST Microservice' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Passport Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Verifiable Skill Passport
              </span>
              <span className="text-xs text-slate-400">ID: SKB-2026-ARUN-884</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Evidence-Backed Skill Passport
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Authentic, tamper-evident skills verified through direct course work, GitHub repositories, and diagnostic assessments.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-blue-500/30 bg-slate-900/80 text-center min-w-[160px]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Role Readiness</span>
            <div className="text-3xl font-extrabold text-blue-400 mt-0.5">76%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Backend Developer Fit</span>
          </div>
        </div>
      </div>

      {/* Grid of Verified Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {passportSkills.map((sk) => (
          <div
            key={sk.name}
            className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-blue-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-extrabold text-white">{sk.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                  sk.confidence === 'High'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {sk.confidence} Confidence
                </span>
              </div>

              {/* Meter */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Verified Proficiency</span>
                  <span className="text-white font-bold">{sk.proficiency}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sk.proficiency >= 80
                        ? 'bg-emerald-500'
                        : (sk.proficiency >= 60 ? 'bg-blue-500' : 'bg-amber-500')
                    }`}
                    style={{ width: `${sk.proficiency}%` }}
                  ></div>
                </div>
              </div>

              {/* Evidence Types Checkboxes */}
              <div className="mb-4 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Evidence Breakdown ({sk.evidenceCount})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Course', 'Project', 'Assessment', 'Certificate'].map((t) => {
                    const hasType = sk.types.includes(t);
                    return (
                      <span
                        key={t}
                        className={`text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1 border ${
                          hasType
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 font-bold'
                            : 'bg-slate-800/40 text-slate-500 border-slate-700/40 line-through'
                        }`}
                      >
                        {hasType ? '✓' : '•'} {t}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Evidence Items Details */}
              <div className="space-y-1.5">
                {sk.details.map((d, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-800/50 text-[11px] text-slate-300 border border-slate-700/50 flex items-center justify-between">
                    <span className="truncate">{d.title}</span>
                    <span className="text-[9px] text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded shrink-0">{d.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status: <strong className="text-emerald-400">VERIFIED</strong></span>
              <span className="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer">
                Verify <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
