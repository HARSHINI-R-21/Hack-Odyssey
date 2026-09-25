import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BarChart3, AlertTriangle, CheckCircle2, Award, HelpCircle } from 'lucide-react';

export const ReadinessPage: React.FC = () => {
  const readinessData = [
    { skill: 'Python', required: 80, current: 91, gap: 0, priority: 'Low', importance: 'High' },
    { skill: 'SQL', required: 75, current: 82, gap: 0, priority: 'Low', importance: 'High' },
    { skill: 'Git', required: 60, current: 89, gap: 0, priority: 'Low', importance: 'Medium' },
    { skill: 'Django', required: 75, current: 64, gap: 11, priority: 'Medium', importance: 'High' },
    { skill: 'REST API', required: 70, current: 51, gap: 19, priority: 'High', importance: 'High' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Role Readiness Analysis</h1>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-semibold">Backend Developer</span>
            </div>
            <p className="text-xs text-slate-400">Transparent deterministic evaluation comparing required skills vs verified proficiencies</p>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-blue-500/30 bg-slate-900/90 text-center min-w-[150px]">
          <span className="text-[10px] uppercase font-bold text-slate-400">Overall Readiness</span>
          <div className="text-3xl font-extrabold text-white">76%</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Job Market Ready</span>
        </div>
      </div>

      {/* Highest Impact Callout */}
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-white">Highest-Impact Skill Gap: REST API (Gap: 19% • Priority: HIGH)</h4>
          <p className="text-slate-300 mt-0.5">
            REST API is the single largest bottleneck holding your readiness score back. Addressing this skill in your adaptive roadmap will increase total role readiness from 76% to 82.2%.
          </p>
        </div>
      </div>

      {/* Recharts Visual Bar Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90">
        <h3 className="text-sm font-bold text-white mb-4">Required vs Current Skill Comparison</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={readinessData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="skill" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="required" name="Required Level" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" name="Current Verified" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transparent Breakdown Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Detailed Skill Evaluation Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-300 font-semibold border-b border-slate-700">
              <tr>
                <th className="p-4">Skill</th>
                <th className="p-4">Importance</th>
                <th className="p-4">Required</th>
                <th className="p-4">Current Verified</th>
                <th className="p-4">Skill Gap</th>
                <th className="p-4">Impact Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
              {readinessData.map((row) => (
                <tr key={row.skill} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{row.skill}</td>
                  <td className="p-4">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700">
                      {row.importance}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">{row.required}%</td>
                  <td className="p-4 font-bold text-blue-400">{row.current}%</td>
                  <td className="p-4">
                    {row.gap > 0 ? (
                      <span className="font-bold text-amber-400">{row.gap}%</span>
                    ) : (
                      <span className="font-bold text-emerald-400">0% (Met)</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      row.priority === 'High'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : (row.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')
                    }`}>
                      {row.priority} Priority
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
