import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { User, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

export const DemoAccountPanel: React.FC = () => {
  const { quickLogin } = useAuth();

  const handleQuickLogin = async (role: UserRole) => {
    try {
      await quickLogin(role);
    } catch (err) {
      console.error("Quick login failed:", err);
    }
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-blue-500/20 shadow-xl bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h3 className="text-sm font-semibold text-slate-200">1-Click Demo Accounts</h3>
        </div>
        <span className="text-xs text-blue-400 font-medium px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">SIH 2026 Demo</span>
      </div>
      
      <p className="text-xs text-slate-400 mb-4">
        Select a role to test the complete Academia–Industry career intelligence feedback loop:
      </p>

      <div className="space-y-2.5">
        <button
          onClick={() => handleQuickLogin('STUDENT')}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-blue-900/40 border border-slate-700/60 hover:border-blue-500/40 transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                Arun Kumar <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">STUDENT</span>
              </div>
              <div className="text-[11px] text-slate-400">student@skillbridge.demo (Backend Dev)</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => handleQuickLogin('RECRUITER')}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-purple-900/40 border border-slate-700/60 hover:border-purple-500/40 transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                Priya Sharma <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">RECRUITER</span>
              </div>
              <div className="text-[11px] text-slate-400">recruiter@skillbridge.demo (Tech Recruiter)</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => handleQuickLogin('INSTITUTION')}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 hover:border-emerald-500/40 transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                ABC Engineering College <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">INSTITUTION</span>
              </div>
              <div className="text-[11px] text-slate-400">college@skillbridge.demo (Placement Cell)</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
};
