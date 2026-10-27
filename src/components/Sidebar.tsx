import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserCheck,
  Building,
  BedDouble,
  Pill,
  FlaskConical,
  FileText,
  HeartPulse,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'analytics'
  | 'patients'
  | 'staff'
  | 'departments'
  | 'beds'
  | 'pharmacy'
  | 'laboratory'
  | 'reports';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  counts: {
    patients: number;
    staff: number;
    departments: number;
    bedsOccupied: number;
    prescriptions: number;
    labOrders: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  counts,
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    kicker: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: LayoutDashboard,
      kicker: 'Overview & Triage',
    },
    {
      id: 'analytics',
      label: 'Analytics & Trends',
      icon: BarChart3,
      kicker: 'Admissions & Beds',
    },
    {
      id: 'patients',
      label: 'Patients & Records',
      icon: Users,
      count: counts.patients,
      kicker: 'Registration & EHR',
    },
    {
      id: 'staff',
      label: 'Healthcare Staff',
      icon: UserCheck,
      count: counts.staff,
      kicker: 'Cadres & Duty Roster',
    },
    {
      id: 'departments',
      label: 'Hospital Departments',
      icon: Building,
      count: counts.departments,
      kicker: 'Clinical & Inpatient',
    },
    {
      id: 'beds',
      label: 'Wards & Beds',
      icon: BedDouble,
      count: counts.bedsOccupied,
      kicker: 'Occupancy & Allocation',
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy & Dispensary',
      icon: Pill,
      count: counts.prescriptions,
      kicker: 'Medications & Prescriptions',
    },
    {
      id: 'laboratory',
      label: 'Pathology & Lab',
      icon: FlaskConical,
      count: counts.labOrders,
      kicker: 'Diagnostics & Results',
    },
    {
      id: 'reports',
      label: 'Discharge & Claims',
      icon: FileText,
      kicker: 'NHIMA Reports & Sheets',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation menu */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Clinical Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-normal'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-sm truncate">{item.label}</div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {item.kicker}
                  </div>
                </div>
              </div>

              {item.count !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-medium shrink-0 ml-2 ${
                    isActive
                      ? 'bg-emerald-700/80 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Hospital Footer status */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-900/60">
        <div className="flex items-center gap-2 mb-1 text-slate-300 font-medium">
          <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ndola Teaching Hospital</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Copperbelt Province, Zambia
          <br />
          Affiliated with CBU SOM & MOH
        </p>
      </div>
    </aside>
  );
};
