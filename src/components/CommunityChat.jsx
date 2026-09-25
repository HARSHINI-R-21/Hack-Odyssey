import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  Bot, 
  Hash, 
  Sparkles, 
  Info,
  BookOpen,
  User,
  CheckCircle2,
  XCircle,
  ShieldAlert
} from 'lucide-react';

export default function CommunityChat() {
  const { user, showToast, t } = useApp();
  const [channelId, setChannelId] = useState('software-engineering');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [moderationLogs, setModerationLogs] = useState([]);
  const [showModLogs, setShowModLogs] = useState(false);
  const chatBottomRef = useRef(null);

  const channels = [
    { id: 'software-engineering', name: 'Software Engineering Study Group' },
    { id: 'data-science-ai', name: 'Data Science & AI Discussion' },
    { id: 'cyber-security', name: 'Cyber Security & SOC Prep' },
    { id: 'cloud-devops', name: 'Cloud & Kubernetes Forum' },
    { id: 'management-prep', name: 'Product Management Study Circle' }
  ];

  useEffect(() => {
    fetchMessages(channelId);
  }, [channelId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (cid) => {
    try {
      const res = await fetch(`/api/chat/messages/${cid}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load chat messages", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId,
          senderName: user?.name || 'Student Peer',
          senderRole: user?.role || 'student',
          senderAvatar: user?.avatar || '👤',
          content: textToSend
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, data.message]);
      } else if (data.blocked) {
        // Message was blocked by academic moderation filter!
        const logEntry = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          user: user?.name || 'Student Peer',
          attemptedText: textToSend,
          reason: data.reason,
          matchedTerms: data.matchedTerms || []
        };

        setModerationLogs(prev => [logEntry, ...prev]);

        showToast(
          `⛔ ${t('modAlertBlocked')}: ${data.reason}`,
          'error'
        );
      }
    } catch (err) {
      showToast("Error sending message", "error");
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.25rem', height: 'calc(100vh - 150px)', minHeight: '600px' }}>
      
      {/* Channels Sidebar */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MessageSquare size={16} color="#818cf8" /> Peer Study Rooms
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setChannelId(ch.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 0.8rem',
                borderRadius: '10px', background: channelId === ch.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: channelId === ch.id ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
                color: channelId === ch.id ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', fontWeight: channelId === ch.id ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              <Hash size={16} color={channelId === ch.id ? '#818cf8' : '#64748b'} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.name}</span>
            </button>
          ))}
        </div>

        {/* Moderation Engine Status Box */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem', borderRadius: '12px', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            <ShieldCheck size={14} /> {t('modActive')}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
            {t('modDesc')}
          </p>

          <button 
            onClick={() => setShowModLogs(!showModLogs)}
            style={{ fontSize: '0.7rem', color: '#06b6d4', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.4rem' }}
          >
            {showModLogs ? 'Hide Moderation Log' : `${t('modLogToggle')} (${moderationLogs.length})`}
          </button>
        </div>

      </div>

      {/* Main Chat Area */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
        
        {/* Chat Room Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hash size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>
              {channels.find(c => c.id === channelId)?.name}
            </h3>
          </div>

          <span style={{ fontSize: '0.78rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> {t('chatTitle')}
          </span>
        </div>

        {/* Moderation Logs Drawer Toggle */}
        {showModLogs && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.85rem', borderRadius: '12px', marginBottom: '1rem', maxHeight: '180px', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fda4af', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={16} /> Real-Time Multilingual Moderation Log (Blocked Non-Academic Traffic)
            </div>

            {moderationLogs.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                No blocked messages recorded in this session. Try sending off-topic terms (e.g., "valorant match", "பப்ஜி மேட்ச்", "casino", "free money") to test the filter!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {moderationLogs.map(log => (
                  <div key={log.id} style={{ fontSize: '0.75rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    <span style={{ color: '#fda4af', fontWeight: 600 }}>[{log.timestamp}] {log.user}:</span> "{log.attemptedText}" ➔ <span style={{ color: '#f43f5e' }}>{log.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
          {messages.map((msg) => {
            const isSelf = msg.sender === user?.name;
            const isSystem = msg.role === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', padding: '4px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} style={{ display: 'flex', gap: '0.75rem', flexDirection: isSelf ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                {typeof msg.avatar === 'string' && msg.avatar.startsWith('http') ? (
                  <img src={msg.avatar} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    {msg.avatar || '👤'}
                  </div>
                )}

                <div style={{ maxWidth: '70%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', justifyContent: isSelf ? 'flex-end' : 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isSelf ? '#38bdf8' : 'var(--text-main)' }}>{msg.sender}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                  </div>

                  <div style={{
                    background: isSelf ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(15, 23, 42, 0.8)',
                    border: isSelf ? 'none' : '1px solid var(--border-glass)',
                    color: '#ffffff',
                    padding: '0.8rem 1rem',
                    borderRadius: isSelf ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Form with Academic Moderation notice */}
        <form onSubmit={handleSendMessage} style={{ position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="form-input"
              placeholder={t('typeMessagePlaceholder')}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              style={{ paddingRight: '3rem' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
              <Send size={16} /> {t('sendBtn')}
            </button>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Info size={12} /> {t('chatSubtitle')}
          </div>
        </form>

      </div>

    </div>
  );
}
