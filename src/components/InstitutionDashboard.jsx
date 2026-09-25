import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend as ChartLegend 
} from 'chart.js';
import { 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  Megaphone, 
  CheckCircle2, 
  Users, 
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  ChartLegend
);

export default function InstitutionDashboard() {
  const { user, showToast } = useApp();
  const [analytics, setAnalytics] = useState(null);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'New Cloud Architecture & Docker Sandbox Access', date: '2026-09-22', content: 'All CS students granted 50 free AWS sandbox credits to practice microservices.' },
    { id: 2, title: 'System Design Bootcamp Announced', date: '2026-09-18', content: 'Addressing top skill gap in System Architecture with 3-week intensive webinar.' }
  ]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/institution/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to fetch institution metrics", err);
    }
  };

  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText) return;

    const newAnn = {
      id: Date.now(),
      title: announcementText,
      date: new Date().toISOString().split('T')[0],
      content: "Broadcasted to all enrolled students on SkillBridge."
    };

    setAnnouncements([newAnn, ...announcements]);
    setAnnouncementText('');
    showToast("Academic Announcement Broadcasted to Cohort!", "success");
  };

  if (!analytics) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Institution Cohort Analytics...</p>
      </div>
    );
  }

  // Domain Breakdown Bar Chart
  const barData = {
    labels: analytics.domainBreakdown.map(d => d.domain),
    datasets: [
      {
        label: 'Total Enrolled Students',
        data: analytics.domainBreakdown.map(d => d.studentCount),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderRadius: 8
      },
      {
        label: 'Recruitment Eligible (Verified)',
        data: analytics.domainBreakdown.map(d => d.verifiedEligibleCount),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f8fafc', font: { family: 'Outfit' } } }
    },
    scales: {
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
      y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
    }
  };

  // Readiness Doughnut Chart
  const doughnutData = {
    labels: ['Placement Ready (Eligible)', 'Gap Reduction In Progress', 'Action Required'],
    datasets: [
      {
        data: [302, 88, 30],
        backgroundColor: ['#10b981', '#06b6d4', '#f43f5e'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Institution Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.9) 0%, rgba(16, 185, 129, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge-tag badge-eligible">Academic Institution Portal</span>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{user?.institutionName || "Apex Institute of Technology"}</span>
            </div>
            <h1 style={{ fontSize: '1.7rem', color: 'var(--text-main)' }}>
              Student Cohort Placement Readiness & Skill Metrics
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '0.8rem 1.25rem', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 700 }}>Readiness Index</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
                {analytics.placementReadinessPercentage}%
              </div>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '0.8rem 1.25rem', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700 }}>Total Cohort</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', fontFamily: 'Outfit' }}>
                {analytics.totalStudents}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Domain Distribution Bar Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#06b6d4" /> Student Enrollment & Eligibility by Domain
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Readiness Doughnut Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#34d399" /> Overall Placement Eligibility Ratio
          </h3>
          <div style={{ height: '260px', width: '260px' }}>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } } }} />
          </div>
        </div>

      </div>

      {/* Top Skill Deficiencies & Curriculum Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Top Skill Deficiencies Alert Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#f43f5e" /> Identified Cohort Skill Deficiencies
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Aggregated skill gaps detected across student transcript assessments:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {analytics.topDeficientSkills.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', padding: '0.8rem 1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.skill}</span>
                  <span style={{ color: '#f43f5e', fontWeight: 700 }}>
                    {item.missingCount} Students ({item.percentage}%)
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div style={{ height: '100%', width: `${item.percentage}%`, background: 'var(--accent-rose)', borderRadius: '999px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast Course Upgrade / Announcement */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={20} color="#fbbf24" /> Broadcast Curriculum Announcement
          </h3>

          <form onSubmit={handleBroadcastAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Announcement title / Course upgrade..."
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
              Broadcast to Student Dashboards
            </button>
          </form>

          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>Recent Broadcasts:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {announcements.map((ann) => (
              <div key={ann.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{ann.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{ann.content} • {ann.date}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
