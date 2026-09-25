import React, { useEffect, useState } from 'react';
import { institutionService } from '../services/api';
import { InstitutionAnalytics } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Building2, Award, Users, FileSpreadsheet, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const InstitutionDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<InstitutionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await institutionService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load institution analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const heatmapData = analytics?.industry_skill_heatmap || [
    { skill_name: 'Python', category: 'Programming Language', industry_demand: 'High', demand_count: 5, student_readiness: 'High', avg_proficiency: 88.5, gap_level: 'Low' },
    { skill_name: 'SQL', category: 'Database', industry_demand: 'High', demand_count: 4, student_readiness: 'Medium', avg_proficiency: 78.0, gap_level: 'Medium' },
    { skill_name: 'REST API', category: 'Web Services', industry_demand: 'High', demand_count: 5, student_readiness: 'Medium', avg_proficiency: 58.0, gap_level: 'High' },
    { skill_name: 'Django', category: 'Backend Framework', industry_demand: 'High', demand_count: 3, student_readiness: 'Medium', avg_proficiency: 64.0, gap_level: 'Medium' },
    { skill_name: 'Cloud / AWS', category: 'Cloud Computing', industry_demand: 'High', demand_count: 3, student_readiness: 'Low', avg_proficiency: 42.0, gap_level: 'High' },
    { skill_name: 'Docker', category: 'DevOps & Cloud', industry_demand: 'Medium', demand_count: 2, student_readiness: 'Low', avg_proficiency: 45.0, gap_level: 'High' }
  ];

  const summary = analytics?.summary || {
    total_students: 10,
    avg_readiness_score: 76.5,
    total_applications: 4,
    placement_rate: '78%'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Institution Skill Intelligence</h1>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                ABC Engineering College (Placement Cell)
              </span>
            </div>
            <p className="text-xs text-slate-300">Aggregate curriculum readiness, industry demand gaps, and placement analytics</p>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-emerald-500/30 bg-slate-900/90 text-center min-w-[160px]">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Batch Readiness</span>
          <div className="text-3xl font-extrabold text-emerald-400">{summary.avg_readiness_score}%</div>
          <span className="text-[10px] text-slate-400">Target Match Fit</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{summary.total_students}</div>
          <span className="text-[11px] text-slate-400">CS Engineering Batch</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
            <span>Batch Placement Rate</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{summary.placement_rate}</div>
          <span className="text-[11px] text-slate-400">Target Role Placements</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
            <span>Job Applications</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{summary.total_applications}</div>
          <span className="text-[11px] text-slate-400">Tracked Applications</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
            <span>Top Demand Bottleneck</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-amber-400 mt-2">REST API</div>
          <span className="text-[11px] text-slate-400">High Industry Demand / Medium Readiness</span>
        </div>
      </div>

      {/* Recharts Industry Skill Demand Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90">
        <h3 className="text-sm font-bold text-white mb-4">Batch Skill Readiness vs Industry Demand</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={heatmapData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="skill_name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="avg_proficiency" name="Batch Avg Proficiency (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Industry Skill Heatmap */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Industry Skill Heatmap Matrix
          </h3>
          <span className="text-xs text-slate-400">Identifies curriculum training priorities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-300 font-semibold border-b border-slate-700">
              <tr>
                <th className="p-4">Skill Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Industry Demand</th>
                <th className="p-4">Student Readiness</th>
                <th className="p-4">Curriculum Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
              {heatmapData.map((row) => (
                <tr key={row.skill_name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-extrabold text-white">{row.skill_name}</td>
                  <td className="p-4 text-slate-400">{row.category}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      row.industry_demand === 'High'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {row.industry_demand} Demand
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      row.student_readiness === 'High'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : (row.student_readiness === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20')
                    }`}>
                      {row.student_readiness} ({row.avg_proficiency}%)
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      row.gap_level === 'High'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : (row.gap_level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')
                    }`}>
                      {row.gap_level} Gap
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
