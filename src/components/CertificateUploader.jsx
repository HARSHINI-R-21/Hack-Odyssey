import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, FileCheck, Trash2, Award, FolderGit2, BookOpen, Plus, CheckCircle } from 'lucide-react';

export default function CertificateUploader() {
  const { user, addCredential, deleteCredential, t } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'certification',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    skillsInput: ''
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      if (!formData.title) setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      if (!formData.title) setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    let parsedSkills = formData.skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (parsedSkills.length === 0) {
      if (formData.type === 'certification') parsedSkills = ["System Design & Architecture", "Backend APIs & Databases (Node/SQL)"];
      else if (formData.type === 'project') parsedSkills = ["Frontend Development (React/CSS)", "Git Version Control & CI/CD"];
      else parsedSkills = ["Data Structures & Algorithms"];
    }

    addCredential({
      title: formData.title,
      type: formData.type,
      issuer: formData.issuer || (formData.type === 'project' ? 'GitHub' : 'University Portal'),
      date: formData.date,
      skillsExtracted: parsedSkills
    });

    setFormData({ title: '', type: 'certification', issuer: '', date: new Date().toISOString().split('T')[0], skillsInput: '' });
    setUploadedFile(null);
    setShowModal(false);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'certification': return <Award size={18} color="#818cf8" />;
      case 'project': return <FolderGit2 size={18} color="#38bdf8" />;
      case 'coursework': return <BookOpen size={18} color="#34d399" />;
      default: return <Award size={18} color="#818cf8" />;
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={20} color="#06b6d4" />
            {t('portfolioTitle')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {t('portfolioDesc')}
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          <Plus size={16} /> {t('uploadBtn')}
        </button>
      </div>

      {/* List of Student Credentials */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {(user?.credentials || []).map((cred) => (
          <div 
            key={cred.id}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)' }}>
                    {getTypeIcon(cred.type)}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{cred.type}</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.3' }}>{cred.title}</h4>
                  </div>
                </div>

                <button 
                  onClick={() => deleteCredential(cred.id)}
                  style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', opacity: 0.7 }}
                  title="Remove credential"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                {t('issuer')}: <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{cred.issuer}</span> • {cred.date}
              </div>

              {/* Skills Extracted */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(cred.skillsExtracted || []).map((skill, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={10} /> {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {user?.credentials?.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--border-glass)' }}>
            <Award size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('noCredentials')}</p>
          </div>
        )}
      </div>

      {/* Upload Credential Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={20} color="#06b6d4" /> {t('uploadModalTitle')}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>{t('credentialCategory')}</label>
                <select 
                  className="form-input" 
                  value={formData.type} 
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="certification">Industry Certification (e.g. AWS, Meta, Coursera)</option>
                  <option value="project">Completed Technical Project (GitHub / Capstone)</option>
                  <option value="coursework">Academic Coursework & Transcripts</option>
                </select>
              </div>

              {/* Drag and drop upload zone */}
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? '#06b6d4' : 'rgba(255, 255, 255, 0.15)'}`,
                  background: dragActive ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <Upload size={32} color={dragActive ? '#06b6d4' : '#94a3b8'} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {uploadedFile ? `File attached: ${uploadedFile.name}` : t('dragDropText')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                  {t('supportsText')}
                </div>
                <input 
                  id="file-upload-input" 
                  type="file" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>{t('certTitleLabel')}</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. AWS Certified Solutions Architect or Microservices E-Commerce"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>{t('issuerLabel')}</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Coursera, GitHub, University"
                    value={formData.issuer}
                    onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>{t('dateLabel')}</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>{t('extractedSkillsLabel')}</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. System Design & Architecture, Backend APIs & Databases (Node/SQL), Docker"
                  value={formData.skillsInput}
                  onChange={e => setFormData({ ...formData, skillsInput: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>{t('cancelBtn')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{t('saveVerifyBtn')}</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
