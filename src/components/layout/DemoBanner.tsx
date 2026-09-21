import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export const DemoBanner: React.FC = () => {
  const { resetDemoData } = useAuth();

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
          Centralized Multi-Branch Hospital Management Platform (Trichy, Chennai, Madurai, Pudukottai)
        </span>
      </div>

      <button
        onClick={() => {
          if (
            window.confirm(
              'Reset all demo records back to clean baseline state? Any new additions or edits will be restored.'
            )
          ) {
            resetDemoData();
          }
        }}
        className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700 text-[11px]"
        title="Reset all modifications back to clean initial seed data"
      >
        <RotateCcw className="w-3 h-3 text-slate-400" />
        <span>Reset Demo Data</span>
      </button>
    </div>
  );
};
