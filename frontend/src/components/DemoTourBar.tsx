import React from 'react';
import { useDemo } from '../context/DemoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, ChevronLeft, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const DemoTourBar: React.FC = () => {
  const { isDemoActive, currentStepIndex, currentStep, nextStep, prevStep, stopDemo, goToStep, DEMO_STEPS } = useDemo();
  const { user, quickLogin } = useAuth();
  const navigate = useNavigate();

  if (!isDemoActive) return null;

  const handleNext = async () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < DEMO_STEPS.length) {
      const targetStep = DEMO_STEPS[nextIdx];
      if (user?.role !== targetStep.userRole) {
        await quickLogin(targetStep.userRole);
      }
      nextStep();
      navigate(targetStep.path);
    }
  };

  const handlePrev = async () => {
    const prevIdx = currentStepIndex - 1;
    if (prevIdx >= 0) {
      const targetStep = DEMO_STEPS[prevIdx];
      if (user?.role !== targetStep.userRole) {
        await quickLogin(targetStep.userRole);
      }
      prevStep();
      navigate(targetStep.path);
    }
  };

  const handleSelectStep = async (idx: number) => {
    const targetStep = DEMO_STEPS[idx];
    if (user?.role !== targetStep.userRole) {
      await quickLogin(targetStep.userRole);
    }
    goToStep(idx);
    navigate(targetStep.path);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-4 shadow-2xl text-slate-100 animate-slide-up">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">SIH 2026 Judge Demo</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Step {currentStepIndex + 1} of {DEMO_STEPS.length}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">{currentStep.title}</h4>
            <p className="text-xs text-slate-300 hidden sm:block max-w-xl">{currentStep.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={currentStepIndex}
            onChange={(e) => handleSelectStep(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 max-w-[140px] truncate"
          >
            {DEMO_STEPS.map((s, idx) => (
              <option key={s.id} value={idx}>
                {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-300"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === DEMO_STEPS.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={stopDemo}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 ml-2"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
