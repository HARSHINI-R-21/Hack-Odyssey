import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full glass-panel border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span className="font-bold text-slate-300">SkillBridge</span> – Academia–Industry Portal &copy; 2026
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Smart India Hackathon 2026</span>
          <span>•</span>
          <span>PS ID: PS26044</span>
          <span>•</span>
          <span className="text-blue-400 font-medium">Team Brainbolt</span>
        </div>
      </div>
    </footer>
  );
};
