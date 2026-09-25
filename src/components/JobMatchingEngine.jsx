import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Search, 
  Filter, 
  Send,
  Award,
  AlertCircle
} from 'lucide-react';

export default function JobMatchingEngine() {
  const { jobs, user, gapAnalysis, fetchJobs, showToast } = useApp();
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingJob, setApplyingJob] = useState(null);

  const handleApply = async (jobId) => {
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, userId: user.id })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Application submitted successfully to recruiter!", "success");
        fetchJobs();
        setApplyingJob(null);
      } else {
        showToast(data.message || "Failed to submit application", "error");
      }
    } catch (err) {
      showToast("Error submitting job application", "error");
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesDomain = selectedDomain === 'all' || job.domain === selectedDomain;
    const matchesQuery = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesQuery;
  });

  const isEligible = gapAnalysis?.isEligible || false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Search & Filter Bar */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={24} color="#34d399" /> Smart Career & Internship Matching Engine
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Positions automatically ranked by your verified competency match score and assessment eligibility status.
            </p>
          </div>

          {/* Student Status pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified Status:</span>
            {isEligible ? (
              <span className="badge-tag badge-eligible">
                <Award size={14} /> Verified Eligible
              </span>
            ) : (
              <span className="badge-tag badge-ineligible">
                Assessment Required (&lt;50%)
              </span>
            )}
          </div>
        </div>

        {/* Filter Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-input"
              placeholder="Search by job title, tech stack or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select 
            className="form-input" 
            value={selectedDomain} 
            onChange={e => setSelectedDomain(e.target.value)}
          >
            <option value="all">All Domains</option>
            <option value="software-engineering">Software Engineering</option>
            <option value="data-science-ai">Data Science & AI</option>
            <option value="cloud-devops">Cloud & DevOps</option>
            <option value="cyber-security">Cyber Security</option>
            <option value="management-analytics">Management & Tech</option>
            <option value="core-engineering">Core Engineering</option>
          </select>
        </div>
      </div>

      {/* Job Listings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filteredJobs.map(job => {
          const matchPercentage = job.userMatchScore || 70;
          const meetsEligibility = isEligible || !job.minScoreRequired;

          return (
            <div 
              key={job.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                border: meetsEligibility ? '1px solid var(--border-glass)' : '1px solid rgba(244, 63, 94, 0.2)',
                background: meetsEligibility ? 'var(--bg-card)' : 'rgba(18, 24, 38, 0.5)'
              }}
            >
              <div>
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.8rem', padding: '0.4rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)' }}>
                      {job.logo || '💼'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.3' }}>{job.title}</h3>
                      <div style={{ fontSize: '0.82rem', color: '#06b6d4', fontWeight: 600 }}>{job.company}</div>
                    </div>
                  </div>

                  {/* Skill Match Badge */}
                  <div style={{
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Match</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#06b6d4' }}>{matchPercentage}%</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '1rem' }}>
                  {job.description}
                </p>

                {/* Job Metadata */}
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="#94a3b8" /> {job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} color="#34d399" /> {job.stipend}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14} color="#fbbf24" /> {job.type}</span>
                </div>

                {/* Required Skills tags */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem' }}>Target Requirements:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(job.requiredSkills || []).map((sk, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', padding: '2px 8px', borderRadius: '6px' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button & Eligibility Check */}
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem' }}>
                {job.hasApplied ? (
                  <button className="btn-secondary" disabled style={{ width: '100%', justifyContent: 'center', opacity: 0.8, color: '#34d399' }}>
                    <CheckCircle2 size={16} /> Application Submitted
                  </button>
                ) : (
                  meetsEligibility ? (
                    <button 
                      onClick={() => handleApply(job.id)}
                      className="btn-emerald"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Send size={16} /> Quick Apply with Verified Profile
                    </button>
                  ) : (
                    <button 
                      onClick={() => setApplyingJob(job)}
                      className="btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fda4af' }}
                    >
                      <Lock size={16} color="#f43f5e" /> Eligibility Gate Lock (&ge;50% Assessment Required)
                    </button>
                  )
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Lock Info Modal if user clicks locked job */}
      {applyingJob && (
        <div className="modal-overlay" onClick={() => setApplyingJob(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Lock size={32} color="#f43f5e" />
            </div>

            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Domain Eligibility Gate Locked
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              This position requires candidates to pass the <strong>{applyingJob.domain.replace('-', ' ').toUpperCase()}</strong> domain assessment with a minimum score of 50%.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setApplyingJob(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Close</button>
              <button onClick={() => { setApplyingJob(null); }} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Go to Assessment Gate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
