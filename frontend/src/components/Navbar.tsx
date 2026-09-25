import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Play, LogOut, User as UserIcon, ShieldCheck, Sparkles, Building2, Briefcase } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { startDemo, isDemoActive } = useDemo();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (!user) return null;
    if (user.role === 'STUDENT') {
      return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1"><UserIcon className="w-3 h-3" /> STUDENT</span>;
    }
    if (user.role === 'RECRUITER') {
      return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1"><Briefcase className="w-3 h-3" /> RECRUITER</span>;
    }
    return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1"><Building2 className="w-3 h-3" /> INSTITUTION</span>;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight gradient-text">SkillBridge</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">SIH 2026</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Evidence-Driven Adaptive Career Intelligence</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {!isDemoActive && (
            <button
              onClick={startDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all group"
            >
              <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
              <span>Launch Demo Journey</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-200">{user.name}</div>
                <div className="mt-0.5">{getRoleBadge()}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 text-slate-400 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
