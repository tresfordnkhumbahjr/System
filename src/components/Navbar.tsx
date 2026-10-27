import React, { useState, useEffect } from 'react';
import {
  Building2,
  Clock,
  UserPlus,
  ShieldCheck,
  Search,
  Activity,
  HeartPulse,
} from 'lucide-react';

interface NavbarProps {
  onOpenRegisterPatient: () => void;
  onOpenRegisterStaff: () => void;
  onSearchGlobal: (query: string) => void;
  activeEmergenciesCount: number;
  onNavigateToEmergencies: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegisterPatient,
  onOpenRegisterStaff,
  onSearchGlobal,
  activeEmergenciesCount,
  onNavigateToEmergencies,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as CAT (Central Africa Time UTC+2)
      setCurrentTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-400/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">
                Ndola Teaching Hospital
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                MOH Zambia
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Hospital Management System · Copperbelt Referral Center
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient by name, NTH-ID, NRC (e.g. 294812/11/1)..."
              onChange={(e) => onSearchGlobal(e.target.value)}
              className="w-full bg-slate-800/80 text-sm text-slate-100 placeholder-slate-400 rounded-lg pl-9 pr-3 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center gap-3">
          {/* Central Africa Time indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">{currentTime || '12:00:00'}</span>
            <span className="text-[10px] text-slate-400 ml-0.5">CAT (UTC+2)</span>
          </div>

          {/* Emergency Alert indicator */}
          {activeEmergenciesCount > 0 && (
            <button
              onClick={onNavigateToEmergencies}
              aria-label="View active emergencies"
              className="flex items-center gap-1.5 bg-rose-950/80 text-rose-300 border border-rose-800/80 hover:bg-rose-900/90 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{activeEmergenciesCount} Emergency Cases</span>
            </button>
          )}

          {/* NHIMA verified badge */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NHIMA Accredited</span>
          </div>

          {/* Primary Quick Actions */}
          <button
            onClick={onOpenRegisterPatient}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>
    </header>
  );
};
