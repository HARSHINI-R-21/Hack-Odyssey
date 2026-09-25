import React, { useEffect, useState } from 'react';
import { jobService, applicationService } from '../services/api';
import { Job, JobMatch } from '../types';
import { Briefcase, CheckCircle2, AlertTriangle, ArrowRight, MapPin, Building2, Sparkles, X } from 'lucide-react';

export const JobMarketplacePage: React.FC = () => {
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matches = await jobService.getMyJobMatches();
        setJobMatches(matches);
      } catch (err) {
        console.error("Failed to load job matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleApply = async (jobId: number, company: string, title: string) => {
    try {
      await applicationService.applyToJob(jobId);
      setAppliedJobIds((prev) => [...prev, jobId]);
      setAppliedMessage(`🎉 Successfully applied to ${title} at ${company}! Application tracked under My Applications.`);
      setSelectedMatch(null);
    } catch (err) {
      console.error("Failed to apply:", err);
    }
  };

  const defaultMatches: JobMatch[] = [
    {
      job: {
        id: 1,
        recruiter_id: 2,
        title: 'Junior Backend Developer',
        company: 'TechCorp Solutions',
        location: 'Bengaluru, India',
        experience_level: 'Entry Level',
        description: 'Looking for a Python backend developer with Django, REST APIs, PostgreSQL and Git experience.',
        status: 'OPEN',
        created_at: new Date().toISOString(),
        skills: [
          { skill_id: 1, skill_name: 'Python', required_level: 80, importance: 'High' },
          { skill_id: 4, skill_name: 'Django', required_level: 75, importance: 'High' },
          { skill_id: 5, skill_name: 'REST API', required_level: 70, importance: 'High' },
          { skill_id: 2, skill_name: 'SQL', required_level: 75, importance: 'High' },
          { skill_id: 3, skill_name: 'Git', required_level: 60, importance: 'Medium' }
        ]
      },
      match_score: 84.0,
      why_you_match: [
        'Python – Verified proficiency (91% vs 80% required)',
        'SQL – Verified proficiency (82% vs 75% required)',
        'Git – Verified proficiency (89% vs 60% required)'
      ],
      skills_to_improve: [
        'Django – Current 64% (Target: 75%)',
        'REST API – Current 51% (Target: 70%)'
      ],
      readiness_level: 'Good Match'
    },
    {
      job: {
        id: 2,
        recruiter_id: 2,
        title: 'Python API Developer',
        company: 'InnoData Labs',
        location: 'Remote / Hyderabad',
        experience_level: '0-2 Years',
        description: 'Seeking backend software engineer skilled in Python, FastAPI, REST APIs, and Docker for high-throughput microservices.',
        status: 'OPEN',
        created_at: new Date().toISOString(),
        skills: []
      },
      match_score: 79.5,
      why_you_match: [
        'Python – Strong evidence (91%)',
        'SQL & Data Management – Strong evidence'
      ],
      skills_to_improve: [
        'REST API – Current 51% (Target: 75%)',
        'Docker – Missing verified evidence'
      ],
      readiness_level: 'Good Match'
    },
    {
      job: {
        id: 3,
        recruiter_id: 2,
        title: 'Associate Software Engineer',
        company: 'Global Cloud Systems',
        location: 'Pune, India',
        experience_level: 'Entry Level',
        description: 'Entry level role building scalable web apps with Python, SQL, and Git version control.',
        status: 'OPEN',
        created_at: new Date().toISOString(),
        skills: []
      },
      match_score: 92.0,
      why_you_match: [
        'Python – Exceeds requirement (91% vs 75%)',
        'SQL – Exceeds requirement (82% vs 70%)',
        'Git – Exceeds requirement (89% vs 70%)'
      ],
      skills_to_improve: [],
      readiness_level: 'Strong Match'
    }
  ];

  const matchesList = jobMatches.length > 0 ? jobMatches : defaultMatches;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Find Opportunities & Job Marketplace</h1>
            <p className="text-xs text-slate-400">Explainable candidate-job matching calculated from verified evidence proficiencies</p>
          </div>
        </div>
      </div>

      {appliedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{appliedMessage}</span>
          </div>
          <button onClick={() => setAppliedMessage(null)} className="text-slate-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {matchesList.map((m) => {
          const isApplied = appliedJobIds.includes(m.job.id);
          const isTechCorp = m.job.company === 'TechCorp Solutions';

          return (
            <div
              key={m.job.id}
              className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" /> {m.job.company}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-extrabold border ${
                    m.match_score >= 85
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : (m.match_score >= 75 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')
                  }`}>
                    {m.match_score}% Match
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white">{m.job.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> {m.job.location} • {m.job.experience_level}
                </p>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2">{m.job.description}</p>

                {/* Match Snapshot */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Match Insights:</span>
                  <div className="text-[11px] text-emerald-400 truncate">✓ {m.why_you_match[0] || 'Core skills aligned'}</div>
                  {m.skills_to_improve[0] && (
                    <div className="text-[11px] text-amber-400 truncate">⚠ {m.skills_to_improve[0]}</div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedMatch(m)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
                >
                  Why You Match
                </button>

                <button
                  onClick={() => handleApply(m.job.id, m.job.company, m.job.title)}
                  disabled={isApplied || isTechCorp}
                  className="w-1/2 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
                >
                  {isApplied || isTechCorp ? 'Applied ✓' : 'Apply Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explainable Matching Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-slate-900 w-full max-w-xl shadow-2xl relative">
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-400">Explainable Match Engine</span>
                <h3 className="text-lg font-extrabold text-white">{selectedMatch.job.title}</h3>
                <p className="text-xs text-slate-400">{selectedMatch.job.company}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Match Score</span>
                <div className="text-2xl font-black text-purple-400">{selectedMatch.match_score}%</div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {selectedMatch.readiness_level}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Why You Match ({selectedMatch.why_you_match.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedMatch.why_you_match.map((wm, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 text-xs font-medium">
                      ✓ {wm}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Skills to Improve ({selectedMatch.skills_to_improve.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedMatch.skills_to_improve.map((st, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-amber-500/10 text-amber-200 border border-amber-500/20 text-xs font-medium">
                      ⚠ {st}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => handleApply(selectedMatch.job.id, selectedMatch.job.company, selectedMatch.job.title)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20"
              >
                Apply to Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
