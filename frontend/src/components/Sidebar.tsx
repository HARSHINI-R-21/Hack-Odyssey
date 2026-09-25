import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Target, GitFork, ShieldCheck, BarChart3,
  TrendingUp, BookOpen, FileText, Briefcase, FileSpreadsheet, Building2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const studentLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Career Assessment', path: '/assessment', icon: Target },
    { label: 'Target Role', path: '/target-role', icon: Target },
    { label: 'Skill Graph', path: '/skill-graph', icon: GitFork },
    { label: 'My Skill Passport', path: '/passport', icon: ShieldCheck },
    { label: 'Role Readiness Analysis', path: '/readiness', icon: BarChart3 },
    { label: 'Adaptive Roadmap', path: '/roadmap', icon: TrendingUp },
    { label: 'Learning Resources', path: '/resources', icon: BookOpen },
    { label: 'AI Resume Builder', path: '/resume-builder', icon: FileText },
    { label: 'Find Opportunities', path: '/jobs', icon: Briefcase },
    { label: 'My Applications', path: '/applications', icon: FileSpreadsheet },
  ];

  const recruiterLinks = [
    { label: 'Recruiter Dashboard', path: '/recruiter', icon: LayoutDashboard },
    { label: 'Jobs & Candidates', path: '/recruiter/jobs', icon: Briefcase },
    { label: 'Applications & Feedback', path: '/applications', icon: FileSpreadsheet },
  ];

  const institutionLinks = [
    { label: 'Skill Intelligence', path: '/institution', icon: Building2 },
    { label: 'Curriculum & Demand Heatmap', path: '/institution/heatmap', icon: BarChart3 },
    { label: 'Job Marketplace Preview', path: '/jobs', icon: Briefcase },
  ];

  const links = role === 'STUDENT' ? studentLinks : (role === 'RECRUITER' ? recruiterLinks : institutionLinks);

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-800 p-4 min-h-[calc(100vh-4rem)] hidden md:block">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-3">
        {role} Navigation
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const IconComp = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <IconComp className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
