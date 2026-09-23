import React from 'react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-[#0f172a] text-white px-4 py-1 text-xs flex items-center justify-between z-30 relative select-none border-b border-slate-800">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold tracking-wide text-slate-200">
          SUPER D
        </span>
        <span className="text-slate-500 hidden sm:inline">•</span>
        <span className="text-slate-300 hidden sm:inline">
          Centralized Multi-Branch Hospital Management Platform (Trichy, Chennai, Madurai, Pudukkottai)
        </span>
      </div>

    </div>
  );
};
