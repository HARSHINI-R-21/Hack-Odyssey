import React from 'react';
import { Target, GitFork, ShieldCheck, TrendingUp, Briefcase, RefreshCw, CheckCircle2 } from 'lucide-react';

export const IntelligenceLoopDiagram: React.FC = () => {
  const steps = [
    { title: 'Assess', desc: 'Career Diagnostic', icon: Target, active: true },
    { title: 'Map', desc: 'Skill Graph', icon: GitFork, active: true },
    { title: 'Prove', desc: 'Skill Passport', icon: ShieldCheck, active: true },
    { title: 'Improve', desc: 'Adaptive Roadmap', icon: TrendingUp, active: true },
    { title: 'Apply', desc: 'Job Matching', icon: Briefcase, active: true },
    { title: 'Learn', desc: 'Recruiter Feedback', icon: RefreshCw, active: true }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-blue-500/20 bg-slate-900/60 my-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400 animate-spin-slow" />
            Career Intelligence Loop
          </h3>
          <p className="text-xs text-slate-400">
            Continuous evidence measurement $\rightarrow$ Skill gap detection $\rightarrow$ Adaptive roadmap calibration.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Closed-Loop Active
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-blue-500/50 transition-all hover:bg-slate-800 group"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all mb-2">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-blue-300">
                {idx + 1}. {step.title}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{step.desc}</div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600 font-mono text-xs">
                  $\rightarrow$
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
