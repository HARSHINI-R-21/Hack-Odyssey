import React, { useEffect, useState } from 'react';
import { roleService } from '../services/api';
import { Role } from '../types';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const TargetRolePage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.getAllRoles();
        setRoles(data);
      } catch (err) {
        console.error("Failed to load roles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleSelectRole = async (roleId: number) => {
    try {
      await roleService.setTargetRole(roleId);
      setActiveRole(roleId);
      navigate('/skill-graph');
    } catch (err) {
      console.error("Failed to select role:", err);
    }
  };

  const defaultRoles = [
    {
      id: 1,
      name: 'Backend Developer',
      domain: 'Software Development',
      description: 'Designs, builds, and maintains server-side web applications, databases, and APIs.',
      skills: ['Python', 'SQL', 'Git', 'Django', 'REST API', 'PostgreSQL', 'Docker'],
      estimatedReadiness: 76,
      topGap: 'REST API'
    },
    {
      id: 2,
      name: 'Frontend Developer',
      domain: 'Software Development',
      description: 'Builds modern responsive user interfaces using web technologies.',
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Git'],
      estimatedReadiness: 62,
      topGap: 'React'
    },
    {
      id: 3,
      name: 'Full Stack Developer',
      domain: 'Software Development',
      description: 'Handles both frontend and backend development end-to-end.',
      skills: ['Python', 'React', 'TypeScript', 'SQL', 'REST API', 'Git'],
      estimatedReadiness: 68,
      topGap: 'TypeScript'
    },
    {
      id: 4,
      name: 'Data Analyst',
      domain: 'Data & AI',
      description: 'Analyzes structured and unstructured data to drive business insights.',
      skills: ['SQL', 'Python', 'Data Analysis', 'Pandas', 'NumPy'],
      estimatedReadiness: 70,
      topGap: 'Data Analysis'
    },
    {
      id: 5,
      name: 'AI/ML Engineer',
      domain: 'Data & AI',
      description: 'Develops and deploys machine learning models into production systems.',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'Docker'],
      estimatedReadiness: 55,
      topGap: 'Machine Learning'
    },
    {
      id: 6,
      name: 'Cloud Engineer',
      domain: 'Cloud & Infrastructure',
      description: 'Manages cloud infrastructure, container orchestration, and CI/CD pipelines.',
      skills: ['Docker', 'AWS', 'Git', 'Python', 'CI/CD'],
      estimatedReadiness: 48,
      topGap: 'AWS'
    },
    {
      id: 7,
      name: 'Cybersecurity Analyst',
      domain: 'Security',
      description: 'Protects IT systems, applications, and networks from cyber threats.',
      skills: ['Cybersecurity', 'Python', 'SQL', 'Git'],
      estimatedReadiness: 42,
      topGap: 'Cybersecurity'
    }
  ];

  const roleList = roles.length > 0 ? roles : defaultRoles;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Target Role Selection</h1>
            <p className="text-xs text-slate-400">Select an industry target role to calibrate your evidence-backed readiness & skill graph</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roleList.map((r: any) => {
          const readinessVal = r.estimatedReadiness || 76;
          const topGapVal = r.topGap || 'REST API';
          const isSelected = r.id === activeRole || r.name === 'Backend Developer';

          return (
            <div
              key={r.id}
              className={`glass-card p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500/60 bg-slate-900/90 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {r.domain || 'Engineering'}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Target
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-white">{r.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estimated Readiness:</span>
                    <span className="font-extrabold text-white">{readinessVal}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Top Skill Gap:</span>
                    <span className="font-semibold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {topGapVal}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectRole(r.id)}
                className={`mt-5 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-800 hover:bg-blue-600/20 hover:text-blue-300 text-slate-300 border border-slate-700'
                }`}
              >
                <span>{isSelected ? 'Active Target Role' : 'Set as Target Role'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
