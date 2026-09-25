import React, { useState } from 'react';
import { aiService } from '../services/api';
import { FileText, Download, Sparkles, ShieldCheck, CheckCircle2, Briefcase, Printer } from 'lucide-react';

export const ResumeBuilderPage: React.FC = () => {
  const [targetJob, setTargetJob] = useState('Junior Backend Developer - TechCorp Solutions');
  const [tailoring, setTailoring] = useState(false);
  const [tailoredSummary, setTailoredSummary] = useState<string>(
    "Motivated Backend Developer candidate with verified evidence in Python (91%), SQL (82%), Git (89%), and Django (64%). Experienced in REST API microservices, database normalization, and automated CLI scripts."
  );
  const [emphasizedSkills, setEmphasizedSkills] = useState<string[]>(['Python', 'SQL', 'Git', 'REST API', 'Django']);

  const handleTailorResume = async () => {
    setTailoring(true);
    try {
      const res = await aiService.tailorResume(1);
      if (res.tailored_summary) {
        setTailoredSummary(res.tailored_summary);
      }
      if (res.emphasized_skills) {
        setEmphasizedSkills(res.emphasized_skills);
      }
    } catch (err) {
      console.error("Resume tailoring failed:", err);
    } finally {
      setTailoring(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">AI Evidence Resume Builder</h1>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-semibold">
                Verified Credentials Only
              </span>
            </div>
            <p className="text-xs text-slate-400">Generates truthful, evidence-backed resumes tailored to specific job requirements without fake claims</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTailorResume}
            disabled={tailoring}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{tailoring ? 'Tailoring via AI...' : 'Tailor Resume to Job'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Resume Document Preview Container */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 max-w-4xl mx-auto shadow-2xl text-slate-100 print:bg-white print:text-black print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-700 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">ARUN KUMAR</h2>
              <p className="text-sm font-bold text-blue-400">Target Role: Backend Developer</p>
              <p className="text-xs text-slate-400 mt-1">student@skillbridge.demo • Bengaluru, India • github.com/arunkumar</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> SkillBridge Passport Verified
              </span>
            </div>
          </div>
        </div>

        {/* Tailored Professional Summary */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 border-b border-slate-800 pb-1">
            Professional Summary
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
            {tailoredSummary}
          </p>
        </div>

        {/* Verified Skills */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 border-b border-slate-800 pb-1">
            Verified Skills & Proficiencies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { skill: 'Python', prof: 91, ev: '3 Evidences (Coursera, GitHub, Diagnostic)' },
              { skill: 'SQL', prof: 82, ev: '2 Evidences (Udemy, DB Schema)' },
              { skill: 'Git', prof: 89, ev: '1 Evidence (GitHub Repo)' },
              { skill: 'Django', prof: 64, ev: '1 Evidence (Coursework)' },
              { skill: 'REST API', prof: 51, ev: '1 Evidence (Microservice Project)' }
            ].map((s) => (
              <div key={s.skill} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white">{s.skill}</span>
                  <span className="text-blue-400">{s.prof}%</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{s.ev}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 border-b border-slate-800 pb-1">
            Verified Projects & GitHub Repositories
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white">Student Portal Backend API</h4>
                <span className="text-[10px] text-slate-400 font-mono">github.com/arunkumar/student-portal-backend</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">RESTful API service written in Python & Django with PostgreSQL database integration.</p>
              <div className="text-[10px] text-blue-300 mt-1">Technologies: Python, Django, PostgreSQL, REST API, Git</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white">Automated Data Analytics Pipeline</h4>
                <span className="text-[10px] text-slate-400 font-mono">github.com/arunkumar/etl-pipeline</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">ETL script processing relational SQL datasets and outputting structured JSON metrics.</p>
              <div className="text-[10px] text-blue-300 mt-1">Technologies: Python, SQL, Pandas</div>
            </div>
          </div>
        </div>

        {/* Education & Certificates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 border-b border-slate-800 pb-1">
              Education
            </h3>
            <div className="text-xs">
              <h4 className="font-bold text-white">B.Tech in Computer Science Engineering</h4>
              <p className="text-slate-400">ABC Engineering College • Graduating 2026</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 border-b border-slate-800 pb-1">
              Certifications
            </h3>
            <div className="text-xs">
              <h4 className="font-bold text-white">Meta Backend Developer Professional Certificate</h4>
              <p className="text-slate-400">Coursera / Meta • Verified Credential</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
