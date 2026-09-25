import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle, 
  Sparkles,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export default function AssessmentQuiz() {
  const { user, submitAssessment, setActiveTab, showToast } = useApp();
  const domainId = user?.targetDomain || 'software-engineering';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minute countdown
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch questions for active domain
  useEffect(() => {
    fetchQuestions();
  }, [domainId]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, loading]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assessments/${domainId}`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
        setSelectedAnswers({});
        setCurrentQIndex(0);
        setTimeLeft(300);
        setIsSubmitted(false);
        setResult(null);
      }
    } catch (err) {
      showToast("Error loading assessment questions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleAutoSubmit = async () => {
    if (isSubmitted) return;
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    
    const resData = await submitAssessment(domainId, selectedAnswers);
    if (resData && resData.success) {
      setResult(resData);
      if (resData.isEligible) {
        // Trigger celebratory confetti animation!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast("🎉 Congratulations! You scored over 50% and unlocked Recruitment Eligibility!", "success");
      } else {
        showToast("Assessment score below 50%. Review recommended courses and retake anytime.", "info");
      }
    }
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading assessment portal...</p>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Quiz Header */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge-tag badge-role">Domain Assessment Gate</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>50%+ Passing Score Threshold</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
              {domainId.replace('-', ' ').toUpperCase()} ELIGIBILITY EXAM
            </h2>
          </div>

          {!isSubmitted ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.5rem 1rem', borderRadius: '12px', color: '#fbbf24', fontWeight: 700
            }}>
              <Clock size={18} />
              <span>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
            </div>
          ) : (
            <button onClick={fetchQuestions} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              <RotateCcw size={16} /> Retake Assessment
            </button>
          )}
        </div>
      </div>

      {/* Quiz Results Screen */}
      {isSubmitted && result ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
          
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: result.isEligible ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
            border: `2px solid ${result.isEligible ? '#10b981' : '#f43f5e'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            {result.isEligible ? (
              <ShieldCheck size={44} color="#34d399" />
            ) : (
              <XCircle size={44} color="#f43f5e" />
            )}
          </div>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {result.isEligible ? "Congratulations! You are Industry Verified!" : "Score Below 50% Threshold"}
          </h2>

          <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Outfit', color: result.isEligible ? '#34d399' : '#f43f5e', marginBottom: '0.5rem' }}>
            {result.scorePercentage}%
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
            {result.isEligible ? (
              <>You answered <strong>{result.correctCount} out of {result.totalCount}</strong> questions correctly. Your profile has been updated with the <strong>Industry Verified & Recruitment Eligible</strong> badge!</>
            ) : (
              <>You answered <strong>{result.correctCount} out of {result.totalCount}</strong> questions correctly. You need at least 50% score to unlock direct job recruitment matching.</>
            )}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={fetchQuestions} className="btn-secondary">
              <RotateCcw size={16} /> Try Assessment Again
            </button>

            {result.isEligible && (
              <button onClick={() => setActiveTab('jobs')} className="btn-emerald">
                <Briefcase size={16} /> View Matching Eligible Jobs
              </button>
            )}
          </div>

          {/* Detailed Question Review */}
          <div style={{ marginTop: '2.5rem', textAlign: 'left', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Detailed Answer Review:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={q.id} style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                    borderRadius: '12px', padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.5rem' }}>
                      {isCorrect ? <CheckCircle2 size={18} color="#34d399" /> : <XCircle size={18} color="#f43f5e" />}
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        Q{idx + 1}: {q.question}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '1.75rem', marginBottom: '0.4rem' }}>
                      Your Answer: <span style={{ color: isCorrect ? '#34d399' : '#f43f5e', fontWeight: 600 }}>{userAns !== undefined ? q.options[userAns] : 'Not answered'}</span>
                    </div>

                    {!isCorrect && (
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginLeft: '1.75rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px' }}>
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* Active Question Card */
        currentQ && (
          <div className="glass-card">
            
            {/* Progress header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#06b6d4' }}>
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {answeredCount} Answered
              </span>
            </div>

            <div className="progress-bar-bg" style={{ marginBottom: '1.5rem' }}>
              <div className="progress-bar-fill" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}></div>
            </div>

            {/* Question Text */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '1.5rem' }}>
              {currentQ.question}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === oIdx;

                return (
                  <div
                    key={oIdx}
                    onClick={() => handleOptionSelect(currentQ.id, oIdx)}
                    style={{
                      background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      border: `1px solid ${isSelected ? '#06b6d4' : 'var(--border-glass)'}`,
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#06b6d4' : 'rgba(255, 255, 255, 0.3)'}`,
                      background: isSelected ? '#06b6d4' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: '#fff'
                    }}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    <span style={{ fontSize: '0.95rem' }}>{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Pagination & Submit Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
              <button 
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                className="btn-secondary"
                disabled={currentQIndex === 0}
                style={{ opacity: currentQIndex === 0 ? 0.5 : 1 }}
              >
                Previous
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="btn-primary"
                >
                  Next Question <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="btn-emerald"
                  style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                >
                  Submit & Grade Assessment <Sparkles size={16} />
                </button>
              )}
            </div>

          </div>
        )
      )}

    </div>
  );
}
