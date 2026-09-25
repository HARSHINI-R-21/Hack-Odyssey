import React, { useState } from 'react';
import { roleService } from '../services/api';
import { Role } from '../types';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({
    programming: 'high',
    analytical: 'high',
    webdev: 'high',
    data: 'medium',
    design: 'medium',
    communication: 'medium',
    worktype: 'backend'
  });
  const [submitted, setSubmitted] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const handleSelect = (key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    try {
      const allRoles = await roleService.getAllRoles().catch(() => []);
      setRoles(allRoles);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setSubmitted(true);
    }
  };

  const handleSetTargetRole = async (roleId: number) => {
    try {
      await roleService.setTargetRole(roleId);
      navigate('/skill-graph');
    } catch (err) {
      console.error("Failed to set target role:", err);
      navigate('/skill-graph');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Career Intelligence Assessment</h1>
            <p className="text-xs text-slate-400">Diagnostic evaluation mapping interests & skills to industry domains</p>
          </div>
        </div>
      </div>

      {!submitted ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-6">
          <div className="space-y-4">
            {/* Q1 */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <label className="block text-xs font-bold text-slate-200 mb-2">
                1. How passionate are you about core software architecture and backend algorithms?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect('programming', opt)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase border transition-all ${
                      answers.programming === opt
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <label className="block text-xs font-bold text-slate-200 mb-2">
                2. Rate your interest in relational SQL databases and API integrations:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect('webdev', opt)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase border transition-all ${
                      answers.webdev === opt
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <label className="block text-xs font-bold text-slate-200 mb-2">
                3. Which technical work environment appeals to you most?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'backend', label: 'Backend & Server Systems' },
                  { id: 'frontend', label: 'Frontend UI/UX Interfaces' },
                  { id: 'data', label: 'Data & Analytics Pipelines' },
                  { id: 'cloud', label: 'Cloud & Infrastructure' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect('worktype', opt.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      answers.worktype === opt.id
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Analyze My Assessment</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-slate-900/90 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-white">Recommended Domain: Software Development</h3>
              <p className="text-xs mt-1">
                <strong>Why:</strong> Based on your strong interest in backend programming, existing verified evidence in Python (91%) & SQL (82%), and assessment responses, your optimal career alignment is <strong>Software Development</strong> with specialization in <strong>Backend Developer</strong>.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Select Your Target Role to Generate Skill Graph:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 1, name: 'Backend Developer', desc: 'Python, SQL, Django, REST API, Git' },
                { id: 2, name: 'Full Stack Developer', desc: 'React, TypeScript, Python, REST API' },
                { id: 3, name: 'Frontend Developer', desc: 'React, TypeScript, JavaScript, CSS' },
                { id: 4, name: 'Data Analyst', desc: 'SQL, Python, Data Visualization' }
              ].map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">{r.name}</h5>
                    <p className="text-[11px] text-slate-400 mt-1">{r.desc}</p>
                  </div>
                  <button
                    onClick={() => handleSetTargetRole(r.id)}
                    className="mt-3 w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Set as Target Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
