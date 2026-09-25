import React, { useState } from 'react';
import { GitFork, ShieldCheck, ArrowRight, BookOpen, AlertTriangle, Layers, X, CheckCircle2 } from 'lucide-react';

interface NodeDetail {
  name: string;
  category: string;
  required: number;
  current: number;
  confidence: string;
  evidence: string[];
  prereq?: string;
  dependent?: string;
  resource: string;
}

export const SkillGraphPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>({
    name: 'REST API',
    category: 'Web Services',
    required: 70,
    current: 51,
    confidence: 'Medium',
    evidence: ['Basic CRUD REST Microservice (GitHub Project)'],
    prereq: 'Django',
    dependent: 'Docker',
    resource: 'REST API Fundamentals & Design (FreeCodeCamp)'
  });

  const nodes: NodeDetail[] = [
    {
      name: 'Python',
      category: 'Programming Language',
      required: 80,
      current: 91,
      confidence: 'High',
      evidence: ['Python for Backend Engineering (Coursera)', 'Automated Task Scheduler CLI', 'Standard Diagnostic Test'],
      dependent: 'Django',
      resource: 'Advanced Python Design Patterns'
    },
    {
      name: 'Django',
      category: 'Backend Framework',
      required: 75,
      current: 64,
      confidence: 'Medium',
      evidence: ['Django Web Application Framework Course'],
      prereq: 'Python',
      dependent: 'REST API',
      resource: 'Django Web Development Mastery (Coursera)'
    },
    {
      name: 'REST API',
      category: 'Web Services',
      required: 70,
      current: 51,
      confidence: 'Medium',
      evidence: ['Basic CRUD REST Microservice'],
      prereq: 'Django',
      dependent: 'Docker',
      resource: 'REST API Fundamentals & Design'
    },
    {
      name: 'SQL',
      category: 'Database',
      required: 75,
      current: 82,
      confidence: 'High',
      evidence: ['Relational Database Design (Udemy)', 'E-commerce Database Schema'],
      dependent: 'PostgreSQL',
      resource: 'SQL for Software Developers'
    },
    {
      name: 'Git',
      category: 'Tools & Version Control',
      required: 60,
      current: 89,
      confidence: 'High',
      evidence: ['Multi-Contributor Open Source Repo'],
      resource: 'Git & GitHub Version Control Guide'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Interactive Skill Graph Engine</h1>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Backend Developer</span>
            </div>
            <p className="text-xs text-slate-400">DAG representation mapping prerequisite skills $\rightarrow$ dependent skills $\rightarrow$ learning progression</p>
          </div>
        </div>
      </div>

      {/* Main Skill Graph Diagram Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Canvas View */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-blue-500/20 bg-slate-900/90 relative overflow-hidden min-h-[480px]">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              Role Root: Backend Developer
            </span>
          </div>

          {/* DAG Nodes Display */}
          <div className="mt-12 space-y-8 relative">
            {/* Primary Chain */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative">
              {/* Node 1: Python */}
              <button
                onClick={() => setSelectedNode(nodes[0])}
                className={`w-full sm:w-44 p-4 rounded-2xl border transition-all text-left shadow-lg cursor-pointer ${
                  selectedNode?.name === 'Python'
                    ? 'bg-blue-600/30 border-blue-400 text-white ring-2 ring-blue-500/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-blue-400 uppercase">Step 1 • Prerequisite</div>
                <div className="text-sm font-extrabold mt-0.5">Python</div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">Current: 91%</div>
                <div className="text-[10px] text-slate-400">Required: 80%</div>
              </button>

              <ArrowRight className="w-5 h-5 text-blue-400 hidden sm:block shrink-0 animate-pulse" />

              {/* Node 2: Django */}
              <button
                onClick={() => setSelectedNode(nodes[1])}
                className={`w-full sm:w-44 p-4 rounded-2xl border transition-all text-left shadow-lg cursor-pointer ${
                  selectedNode?.name === 'Django'
                    ? 'bg-blue-600/30 border-blue-400 text-white ring-2 ring-blue-500/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Step 2 • Framework</div>
                <div className="text-sm font-extrabold mt-0.5">Django</div>
                <div className="text-xs text-amber-400 font-semibold mt-1">Current: 64%</div>
                <div className="text-[10px] text-slate-400">Required: 75%</div>
              </button>

              <ArrowRight className="w-5 h-5 text-blue-400 hidden sm:block shrink-0 animate-pulse" />

              {/* Node 3: REST API */}
              <button
                onClick={() => setSelectedNode(nodes[2])}
                className={`w-full sm:w-44 p-4 rounded-2xl border transition-all text-left shadow-lg cursor-pointer ${
                  selectedNode?.name === 'REST API'
                    ? 'bg-red-600/30 border-red-400 text-white ring-2 ring-red-500/40 shadow-red-500/10'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-red-500/40 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-red-400 uppercase flex items-center justify-between">
                  <span>Step 3 • API</span>
                  <span className="text-[9px] bg-red-500/20 text-red-300 px-1 rounded">Highest Gap</span>
                </div>
                <div className="text-sm font-extrabold mt-0.5">REST API</div>
                <div className="text-xs text-red-400 font-semibold mt-1">Current: 51%</div>
                <div className="text-[10px] text-slate-400">Required: 70%</div>
              </button>
            </div>

            {/* Parallel Chains */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedNode(nodes[3])}
                className={`p-4 rounded-2xl border transition-all text-left shadow-lg cursor-pointer ${
                  selectedNode?.name === 'SQL'
                    ? 'bg-blue-600/30 border-blue-400 text-white'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-emerald-400 uppercase">Database Core</div>
                <div className="text-sm font-extrabold mt-0.5">SQL & Database</div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">Current: 82% (Req: 75%)</div>
              </button>

              <button
                onClick={() => setSelectedNode(nodes[4])}
                className={`p-4 rounded-2xl border transition-all text-left shadow-lg cursor-pointer ${
                  selectedNode?.name === 'Git'
                    ? 'bg-blue-600/30 border-blue-400 text-white'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-purple-400 uppercase">Version Control</div>
                <div className="text-sm font-extrabold mt-0.5">Git & GitHub</div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">Current: 89% (Req: 60%)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Skill Detail Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {selectedNode.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1">{selectedNode.name}</h3>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                  selectedNode.current >= selectedNode.required
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {selectedNode.current >= selectedNode.required ? 'Target Met' : 'Skill Gap'}
                </span>
              </div>

              {/* Levels */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase">Required Level</span>
                  <div className="text-base font-extrabold text-white mt-0.5">{selectedNode.required}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase">Current Verified</span>
                  <div className="text-base font-extrabold text-blue-400 mt-0.5">{selectedNode.current}%</div>
                </div>
              </div>

              {/* Verified Evidence */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Verified Evidence ({selectedNode.evidence.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.evidence.map((ev, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-800/40 text-[11px] text-slate-200 border border-slate-700/40 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dependencies */}
              {(selectedNode.prereq || selectedNode.dependent) && (
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1 text-xs text-slate-300">
                  {selectedNode.prereq && <div>Prerequisite: <strong className="text-blue-400">{selectedNode.prereq}</strong></div>}
                  {selectedNode.dependent && <div>Unlocks: <strong className="text-purple-400">{selectedNode.dependent}</strong></div>}
                </div>
              )}

              {/* Recommended Resource */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Recommended Resource
                </span>
                <p className="text-xs font-bold text-white mt-1">{selectedNode.resource}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs my-auto py-12">
              Click any node in the Skill Graph to view prerequisites, verified evidence, and learning resources.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
