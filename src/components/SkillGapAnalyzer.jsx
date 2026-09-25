import React from 'react';
import { useApp } from '../context/AppContext';
import { Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  MapPin, 
  ExternalLink, 
  Award,
  Sparkles,
  Zap
} from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SkillGapAnalyzer() {
  const { gapAnalysis, user, setActiveTab, t } = useApp();

  if (!gapAnalysis) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Analyzing competency matrix...</p>
      </div>
    );
  }

  const { skillMatchPercentage, skillGapPercentage, standardsComparison, acquiredSkills, missingSkills, roadmap, recommendedCourses, isEligible } = gapAnalysis;

  // Radar Chart Configuration
  const radarData = {
    labels: standardsComparison.map(s => s.skillName),
    datasets: [
      {
        label: 'Industry Benchmark Standard',
        data: standardsComparison.map(s => s.reqLevel),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Student Verified Level',
        data: standardsComparison.map(s => s.studentLevel),
        backgroundColor: 'rgba(6, 182, 212, 0.35)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointBackgroundColor: '#06b6d4',
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: {
          color: '#cbd5e1',
          font: { size: 11, family: 'Inter' }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#64748b',
          stepSize: 20
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        labels: { color: '#f8fafc', font: { family: 'Outfit', weight: '600' } }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner: Skill Gap & Match Metrics */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge-tag badge-role">{gapAnalysis.domainName}</span>
              {isEligible ? (
                <span className="badge-tag badge-eligible pulse-glow">
                  <Award size={14} /> {t('recruitmentEligible')}
                </span>
              ) : (
                <span className="badge-tag badge-ineligible">
                  <AlertTriangle size={14} /> {t('assessmentPending')}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              {t('analysisTitle')}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t('analysisDesc')} <strong>{gapAnalysis.domainName}</strong>.
            </p>
          </div>

          {/* Skill Gap & Match Percentage Display */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{
              flex: 1, background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '16px', padding: '1.25rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>{t('matchScore')}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', color: '#06b6d4' }}>
                {skillMatchPercentage}%
              </div>
              <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
                <div className="progress-bar-fill" style={{ width: `${skillMatchPercentage}%` }}></div>
              </div>
            </div>

            <div style={{
              flex: 1, background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '16px', padding: '1.25rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fda4af', textTransform: 'uppercase' }}>{t('gapPercentage')}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', color: '#f43f5e' }}>
                {skillGapPercentage}%
              </div>
              <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
                <div style={{ height: '100%', width: `${skillGapPercentage}%`, background: 'var(--accent-rose)', borderRadius: '999px' }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Radar Chart & Competency Standard Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        
        {/* Radar Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#06b6d4" /> {t('radarTitle')}
          </h3>
          <div style={{ height: '340px', width: '100%', position: 'relative' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Detailed Competency Table */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#818cf8" /> {t('breakdownTitle')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {standardsComparison.map((item, idx) => {
              const percentage = Math.round((item.studentLevel / item.reqLevel) * 100);

              return (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', padding: '0.8rem 1rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.skillName}</span>
                    <span style={{ color: item.studentLevel >= item.reqLevel ? '#34d399' : (item.studentLevel > 0 ? '#fbbf24' : '#f43f5e'), fontWeight: 700 }}>
                      {item.studentLevel} / {item.reqLevel} req
                    </span>
                  </div>

                  <div className="progress-bar-bg">
                    <div 
                      className={`progress-bar-fill ${item.studentLevel >= item.reqLevel ? 'progress-bar-fill-emerald' : ''}`}
                      style={{ 
                        width: `${Math.min(100, percentage)}%`,
                        background: item.studentLevel >= item.reqLevel ? 'var(--gradient-emerald)' : (item.studentLevel > 0 ? 'var(--gradient-main)' : 'var(--accent-rose)')
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Personalized Learning Roadmap */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="#34d399" /> {t('roadmapTitle')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {t('roadmapDesc')}
            </p>
          </div>

          <button 
            onClick={() => setActiveTab('assessment')} 
            className="btn-emerald"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            {t('takeAssessmentGate')} <Sparkles size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {roadmap.map((step) => (
            <div key={step.step} style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.2rem',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--gradient-main)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem'
                }}>
                  {step.step}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{step.skill}</h4>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                🎯 <strong>Goal:</strong> {step.targetGoal}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.5rem' }}>
                <span>⏱️ Est Duration: {step.recommendedDuration}</span>
                <span style={{ color: '#06b6d4', fontWeight: 600 }}>Priority Action</span>
              </div>
            </div>
          ))}

          {roadmap.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '1.5rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#34d399' }}>
              🎉 Incredible job! You have zero skill gaps in this domain and match all industry benchmarks!
            </div>
          )}
        </div>
      </div>

      {/* Tailored Course Recommendations */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="#fbbf24" /> {t('coursesTitle')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {recommendedCourses.map((course) => (
            <div key={course.id} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    {course.platform}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.duration}</span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{course.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                  Target Skill: <strong style={{ color: '#cbd5e1' }}>{course.skillCovered}</strong>
                </p>
              </div>

              <button 
                onClick={() => window.open(course.link || '#', '_blank')}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '0.5rem' }}
              >
                {t('enrollBtn')} <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
