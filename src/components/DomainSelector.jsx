import React from 'react';
import { useApp } from '../context/AppContext';
import { Code2, BrainCircuit, ShieldAlert, Cloud, Cpu, Briefcase, Check } from 'lucide-react';

export default function DomainSelector() {
  const { domains, user, updateTargetDomain, t } = useApp();

  const getDomainIcon = (iconName) => {
    switch (iconName) {
      case 'Code2': return <Code2 size={24} color="#818cf8" />;
      case 'BrainCircuit': return <BrainCircuit size={24} color="#38bdf8" />;
      case 'ShieldAlert': return <ShieldAlert size={24} color="#f43f5e" />;
      case 'Cloud': return <Cloud size={24} color="#a78bfa" />;
      case 'Cpu': return <Cpu size={24} color="#34d399" />;
      case 'Briefcase': return <Briefcase size={24} color="#fbbf24" />;
      default: return <Code2 size={24} color="#818cf8" />;
    }
  };

  const currentDomain = domains.find(d => d.id === (user?.targetDomain || 'software-engineering'));

  return (
    <div style={{ marginBottom: '2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{t('selectDomainTitle')}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {t('selectDomainDesc')}
          </p>
        </div>

        {currentDomain && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t('activeDomain')}:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#818cf8' }}>{currentDomain.name}</span>
          </div>
        )}
      </div>

      {/* Grid of Domain Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {domains.map(domain => {
          const isSelected = domain.id === (user?.targetDomain || 'software-engineering');

          return (
            <div 
              key={domain.id}
              onClick={() => updateTargetDomain(domain.id)}
              className={`glass-card glass-card-interactive ${isSelected ? 'selected-domain' : ''}`}
              style={{
                borderColor: isSelected ? 'var(--primary-cyan)' : 'var(--border-glass)',
                background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'var(--gradient-main)', width: '24px', height: '24px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={14} color="#ffffff" />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <div style={{
                  padding: '0.6rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {getDomainIcon(domain.icon)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{domain.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{domain.standards.length} {t('competencies')}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '1rem' }}>
                {domain.description}
              </p>

              {/* Sample standard tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {domain.standards.slice(0, 3).map((std, idx) => (
                  <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '6px', color: '#cbd5e1' }}>
                    {std.name}
                  </span>
                ))}
                {domain.standards.length > 3 && (
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>+{domain.standards.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
