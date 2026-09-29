import React from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  User,
  Plus
} from 'lucide-react';

interface HeaderProps {
  onOpenCreate: () => void;
  onRunDemoLoop: () => void;
  onResetDemo: () => void;
  currentRole: string;
  onChangeRole: (role: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreate,
  onRunDemoLoop,
  onResetDemo,
  currentRole,
  onChangeRole,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="h-14 bg-slate-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
      {/* Left Title / Tagline */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-300 hidden md:inline">
          <span className="text-slate-400 font-medium">Memory Forge:</span> "Turn Security Incidents Into Organizational Memory."
        </span>
      </div>

      {/* Center Search / Memory Query */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search incidents, root causes, controls, or Hindsight memories..."
            aria-label="Search incidents, root causes, controls, or Hindsight memories"
            className="w-full bg-slate-900/90 border border-slate-800 rounded-md py-1.5 pl-3 pr-8 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2">
        {/* Role Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-md px-2 py-1 text-xs">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value)}
            aria-label="Select security role"
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            <option value="Security Analyst" className="bg-slate-900 text-slate-200">Security Analyst</option>
            <option value="Security Engineer" className="bg-slate-900 text-slate-200">Security Engineer</option>
            <option value="Security Lead" className="bg-slate-900 text-slate-200">Security Lead</option>
            <option value="Compliance Analyst" className="bg-slate-900 text-slate-200">Compliance Analyst</option>
            <option value="Auditor" className="bg-slate-900 text-slate-200">Auditor</option>
          </select>
        </div>

        {/* Demo Preset Trigger */}
        <button
          onClick={onRunDemoLoop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer"
          title="Executes the full 5-minute showcase script: INC-1024 commit, then INC-1038 recall"
        >
          <Play className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
          <span className="hidden sm:inline">Demo Script</span>
        </button>

        {/* Reset Demo Button */}
        <button
          onClick={onResetDemo}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
          title="Reset to clean initial baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Create Incident CTA */}
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-900/30 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Incident</span>
        </button>
      </div>
    </header>
  );
};
