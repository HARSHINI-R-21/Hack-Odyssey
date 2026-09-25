import React, { useEffect, useState } from 'react';
import { roadmapService } from '../services/api';
import { Roadmap, RoadmapItem } from '../types';
import { TrendingUp, CheckCircle2, Play, BookOpen, Clock, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

export const AdaptiveRoadmapPage: React.FC = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(
    "Your roadmap was automatically updated based on recent Recruiter Feedback for REST API & Backend Deployment."
  );
  const [completingId, setCompletingId] = useState<number | null>(null);

  const fetchRoadmap = async () => {
    try {
      const data = await roadmapService.getRoadmap();
      setRoadmap(data);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleMarkComplete = async (itemId: number) => {
    setCompletingId(itemId);
    try {
      const res = await roadmapService.completeItem(itemId);
      setNotification(`🎉 Task Completed! Created verified evidence for ${res.skill_name}. Overall Readiness updated to ${res.updated_readiness_score}%!`);
      await fetchRoadmap();
    } catch (err) {
      console.error("Failed to complete task:", err);
    } finally {
      setCompletingId(null);
    }
  };

  const defaultPhases = [
    {
      phase: 'PHASE 1',
      title: 'REST API Fundamentals',
      skill: 'REST API',
      priority: 'HIGH',
      hours: 12,
      resource: 'REST API Fundamentals & Design (FreeCodeCamp)',
      status: 'IN_PROGRESS',
      action: 'Complete REST API Fundamentals & HTTP Verbs module',
      id: 1
    },
    {
      phase: 'PHASE 2',
      title: 'Build Production REST API Project',
      skill: 'REST API',
      priority: 'HIGH',
      hours: 18,
      resource: 'Building Production REST APIs with Django REST Framework',
      status: 'NOT_STARTED',
      action: 'Build CRUD API Microservice with authentication & deploy repository',
      id: 2
    },
    {
      phase: 'PHASE 3',
      title: 'Django REST Framework Integration',
      skill: 'Django',
      priority: 'MEDIUM',
      hours: 15,
      resource: 'Django Web Development Mastery (Coursera)',
      status: 'NOT_STARTED',
      action: 'Implement ViewSets and Serializers in Django',
      id: 3
    },
    {
      phase: 'PHASE 4',
      title: 'Backend Assessment Verification',
      skill: 'REST API',
      priority: 'HIGH',
      hours: 4,
      resource: 'SkillBridge Backend Diagnostic Test',
      status: 'NOT_STARTED',
      action: 'Pass REST API timed diagnostic quiz to upgrade passport confidence',
      id: 4
    },
    {
      phase: 'PHASE 5',
      title: 'Add Verified Evidence to Skill Passport',
      skill: 'REST API',
      priority: 'MEDIUM',
      hours: 2,
      resource: 'SkillBridge Automated Verifier',
      status: 'NOT_STARTED',
      action: 'Sync GitHub repository evidence to Skill Passport',
      id: 5
    }
  ];

  const items = roadmap?.items && roadmap.items.length > 0 ? roadmap.items : defaultPhases;
  const currentReadiness = roadmap?.readiness_score || 76.0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">My Adaptive Learning Roadmap</h1>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                Live Calibrated
              </span>
            </div>
            <p className="text-xs text-slate-400">Dynamically adapts learning tasks based on evidence progression & recruiter feedback</p>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-blue-500/30 bg-slate-900/90 text-center min-w-[150px]">
          <span className="text-[10px] uppercase font-bold text-slate-400">Current Readiness</span>
          <div className="text-3xl font-extrabold text-emerald-400">{currentReadiness}%</div>
          <span className="text-[10px] text-slate-400">Updated Live</span>
        </div>
      </div>

      {/* Recruiter Feedback Notification Banner */}
      {notification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 text-xs text-blue-200 flex items-start justify-between gap-3 animate-fade-in shadow-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold text-white block mb-0.5">Recruiter Feedback Engine Notification</span>
              <p>{notification}</p>
            </div>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Phases Timeline List */}
      <div className="space-y-4">
        {items.map((item: any, idx: number) => {
          const isCompleted = item.status === 'COMPLETED';
          const isInProgress = item.status === 'IN_PROGRESS';
          const isHighPrio = item.priority === 'HIGH' || item.priority === 'High';

          return (
            <div
              key={item.id || idx}
              className={`glass-card p-6 rounded-2xl border transition-all ${
                isCompleted
                  ? 'border-emerald-500/30 bg-slate-900/40 opacity-80'
                  : (isInProgress
                      ? 'border-blue-500/50 bg-slate-900/90 shadow-xl shadow-blue-500/10'
                      : 'border-slate-800 bg-slate-900/60')
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700">
                      PHASE {idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isHighPrio ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {item.priority} PRIORITY
                    </span>
                    <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.resource?.estimated_hours || item.hours || 10} Hours
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {item.skill_name || item.skill}: {item.recommended_action || item.action || item.title}
                  </h3>

                  <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>Recommended Resource: <strong className="text-slate-200">{item.resource?.title || item.resource || 'SkillBridge Course'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isCompleted ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Completed & Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkComplete(item.id)}
                      disabled={completingId === item.id}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {completingId === item.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Updating DB & Readiness...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Complete</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
