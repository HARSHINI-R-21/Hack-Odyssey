import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Plus, 
  Users, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Award, 
  Briefcase, 
  Search,
  UserCheck,
  XCircle,
  Eye
} from 'lucide-react';

export default function IndustryDashboard() {
  const { user, showToast } = useApp();
  const [applications, setApplications] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: '',
    company: user?.companyName || 'Apex Global Tech',
    location: 'Hybrid / Remote',
    type: 'Full Time',
    domain: 'software-engineering',
    stipend: '$85,000 / yr',
    description: '',
    requiredSkillsInput: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/industry/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const skills = jobForm.requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...jobForm, requiredSkills: skills })
      });
      const data = await res.json();
      if (data.success) {
        showToast("New Job Opening Posted to SkillBridge Network!", "success");
        setShowJobModal(false);
        setJobForm({
          title: '', company: user?.companyName || 'Apex Global Tech',
          location: 'Hybrid / Remote', type: 'Full Time', domain: 'software-engineering',
          stipend: '$85,000 / yr', description: '', requiredSkillsInput: ''
        });
      }
    } catch (err) {
      showToast("Error posting job", "error");
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await fetch('/api/industry/applications/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Candidate status updated to: ${newStatus}`, "info");
        fetchApplications();
      }
    } catch (err) {
      showToast("Error updating application status", "error");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Dashboard Top Header */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge-tag badge-ineligible">Industry Recruiter Dashboard</span>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{user?.companyName || 'Apex Global Tech'}</span>
            </div>
            <h1 style={{ fontSize: '1.7rem', color: 'var(--text-main)' }}>
              Talent Acquisition & Verified Applicant Pool
            </h1>
          </div>

          <button 
            onClick={() => setShowJobModal(true)}
            className="btn-primary"
          >
            <Plus size={18} /> Post New Job / Internship Opening
          </button>
        </div>
      </div>

      {/* Applicant Pool Metrics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Applicants</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{applications.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>Industry Verified Candidates</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
            {applications.filter(a => a.eligible).length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>Avg Skill Match Score</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#06b6d4', fontFamily: 'Outfit' }}>
            {applications.length > 0 ? Math.round(applications.reduce((acc, a) => acc + (a.matchScore || 0), 0) / applications.length) : 82}%
          </div>
        </div>
      </div>

      {/* Candidate Pipeline Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} color="#06b6d4" /> Applicant Queue & Competency Match Breakdown
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.8rem' }}>Candidate</th>
                <th style={{ padding: '0.8rem' }}>Applied Position</th>
                <th style={{ padding: '0.8rem' }}>Match Score</th>
                <th style={{ padding: '0.8rem' }}>Assessment Gate</th>
                <th style={{ padding: '0.8rem' }}>Current Status</th>
                <th style={{ padding: '0.8rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.8rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.studentName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.studentEmail}</div>
                  </td>

                  <td style={{ padding: '0.8rem', color: '#cbd5e1' }}>
                    {app.jobTitle || 'Junior Full Stack Engineer'}
                  </td>

                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#06b6d4', background: 'rgba(6, 182, 212, 0.15)', padding: '2px 8px', borderRadius: '8px' }}>
                      {app.matchScore}% Match
                    </span>
                  </td>

                  <td style={{ padding: '0.8rem' }}>
                    {app.eligible ? (
                      <span className="badge-tag badge-eligible">
                        <Award size={12} /> Verified ({app.assessmentScore || 80}%)
                      </span>
                    ) : (
                      <span className="badge-tag badge-ineligible">
                        Pending Assessment
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '0.8rem' }}>
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 600, padding: '3px 10px', borderRadius: '12px',
                      background: app.status === 'Shortlisted' ? 'rgba(16, 185, 129, 0.2)' : (app.status === 'Rejected' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'),
                      color: app.status === 'Shortlisted' ? '#34d399' : (app.status === 'Rejected' ? '#fda4af' : '#fbbf24')
                    }}>
                      {app.status}
                    </span>
                  </td>

                  <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                        style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', border: 'none', color: '#34d399', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Shortlist
                      </button>

                      <button 
                        onClick={() => handleUpdateStatus(app.id, 'Interviewing')}
                        style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.2)', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Interview
                      </button>

                      <button 
                        onClick={() => setSelectedApplicant(app)}
                        style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        View Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="#f59e0b" /> Post Industry Job Opening
            </h3>

            <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Job Title</label>
                <input 
                  type="text" className="form-input" placeholder="e.g. Senior Frontend Engineer"
                  value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Domain</label>
                  <select className="form-input" value={jobForm.domain} onChange={e => setJobForm({ ...jobForm, domain: e.target.value })}>
                    <option value="software-engineering">Software Engineering</option>
                    <option value="data-science-ai">Data Science & AI</option>
                    <option value="cloud-devops">Cloud & DevOps</option>
                    <option value="cyber-security">Cyber Security</option>
                    <option value="management-analytics">Management & Tech</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Salary / Stipend</label>
                  <input type="text" className="form-input" placeholder="e.g. $90,000 / yr" value={jobForm.stipend} onChange={e => setJobForm({ ...jobForm, stipend: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Required Skills (Comma Separated)</label>
                <input type="text" className="form-input" placeholder="e.g. System Design, React, Node.js" value={jobForm.requiredSkillsInput} onChange={e => setJobForm({ ...jobForm, requiredSkillsInput: e.target.value })} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Job Description</label>
                <textarea className="form-input" rows={3} placeholder="Describe role requirements..." value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowJobModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Publish Job Opening</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicant Profile View Modal */}
      {selectedApplicant && (
        <div className="modal-overlay" onClick={() => setSelectedApplicant(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Candidate Overview: {selectedApplicant.studentName}
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Applied for: {selectedApplicant.jobTitle || 'Software Engineer'}
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Skill Match Score: <strong style={{ color: '#06b6d4' }}>{selectedApplicant.matchScore}%</strong>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Eligibility Badge: <strong>{selectedApplicant.eligible ? '✓ Verified (Passed Gate)' : 'Pending'}</strong>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                Email: {selectedApplicant.studentEmail}
              </div>
            </div>

            <button onClick={() => setSelectedApplicant(null)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close Candidate Profile
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
