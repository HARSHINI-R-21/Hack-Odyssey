import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, GraduationCap, Building2, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { setUser, setActiveTab, showToast } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('student'); // 'student' | 'institution' | 'industry'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    companyName: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { ...formData, role } : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        showToast(`Successfully logged in as ${data.user.name} (${data.user.role.toUpperCase()})`, 'success');
        
        // Redirect according to role
        if (data.user.role === 'student') setActiveTab('gap-analysis');
        else if (data.user.role === 'institution') setActiveTab('institution');
        else if (data.user.role === 'industry') setActiveTab('industry');

        onClose();
      } else {
        showToast(data.message || "Authentication failed", 'error');
      }
    } catch (err) {
      showToast("Network error during login", 'error');
    }
  };

  const handleQuickLogin = (demoRole) => {
    if (demoRole === 'student') {
      setFormData({ email: 'alex.student@skillbridge.edu', password: 'password123', name: 'Alex Rivera' });
      setRole('student');
    } else if (demoRole === 'institution') {
      setFormData({ email: 'mit.admin@university.edu', password: 'password123', name: 'Apex Institute of Technology' });
      setRole('institution');
    } else if (demoRole === 'industry') {
      setFormData({ email: 'recruiter@techcorp.com', password: 'password123', name: 'Apex Global Tech' });
      setRole('industry');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles color="#6366f1" size={24} />
            <h2 style={{ fontSize: '1.4rem' }}>{isRegister ? "Create SkillBridge Account" : "Welcome Back to SkillBridge"}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>SELECT YOUR ROLE</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button 
              type="button"
              onClick={() => setRole('student')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 0.5rem',
                borderRadius: '12px', background: role === 'student' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${role === 'student' ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                color: role === 'student' ? '#818cf8' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <User size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Student</span>
            </button>

            <button 
              type="button"
              onClick={() => setRole('institution')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 0.5rem',
                borderRadius: '12px', background: role === 'institution' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${role === 'institution' ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                color: role === 'institution' ? '#34d399' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <GraduationCap size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Institution</span>
            </button>

            <button 
              type="button"
              onClick={() => setRole('industry')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 0.5rem',
                borderRadius: '12px', background: role === 'industry' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${role === 'industry' ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
                color: role === 'industry' ? '#fbbf24' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Building2 size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Industry</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Pre-fill Bar */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px border-glass', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem' }}>⚡ Quick Demo Credentials (Click to Autofill):</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => handleQuickLogin('student')} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', cursor: 'pointer' }}>
              Student (Alex)
            </button>
            <button type="button" onClick={() => handleQuickLogin('institution')} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', cursor: 'pointer' }}>
              Institution (Apex Tech)
            </button>
            <button type="button" onClick={() => handleQuickLogin('industry')} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', cursor: 'pointer' }}>
              Recruiter (Apex Global)
            </button>
          </div>
        </div>

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                Full Name / Entity Name
              </label>
              <input 
                type="text" 
                className="form-input"
                placeholder={role === 'student' ? 'e.g. Alex Rivera' : (role === 'institution' ? 'e.g. Stanford University' : 'e.g. Microsoft Recruitment')}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-input"
                placeholder="name@organization.edu"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Password</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}>
            {isRegister ? `Register as ${role.toUpperCase()}` : `Login to ${role.toUpperCase()} Dashboard`}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          {isRegister ? "Already have an account?" : "Don't have a SkillBridge account yet?"}{' '}
          <span 
            onClick={() => setIsRegister(!isRegister)} 
            style={{ color: '#06b6d4', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? "Login Here" : "Register Now"}
          </span>
        </div>

      </div>
    </div>
  );
}
