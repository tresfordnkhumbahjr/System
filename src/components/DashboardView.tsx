import React from 'react';
import {
  Users,
  BedDouble,
  UserCheck,
  HeartPulse,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Clock,
  PlusCircle,
  BarChart3,
} from 'lucide-react';
import { Patient, Staff, Department } from '../types/hospital';
import { calculateHospitalStats } from '../utils/hospitalLogic';

interface DashboardViewProps {
  patients: Patient[];
  staff: Staff[];
  departments: Department[];
  onSelectPatient: (patient: Patient) => void;
  onOpenRegisterPatient: () => void;
  onOpenRegisterStaff: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  staff,
  departments,
  onSelectPatient,
  onOpenRegisterPatient,
  onOpenRegisterStaff,
  onNavigateToTab,
}) => {
  const stats = calculateHospitalStats(patients, staff, departments);

  // Active emergencies & priority patients
  const urgentQueue = patients
    .filter((p) => p.status !== 'Discharged' && (p.triageLevel === 'Emergency' || p.triageLevel === 'Priority'))
    .slice(0, 4);

  // Recent admissions
  const recentPatients = [...patients]
    .sort((a, b) => b.registeredDate.localeCompare(a.registeredDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header section with hospital brief */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hospital Operations Command Center
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time census, triage prioritization, clinical wards and staff roster for Ndola Teaching Hospital.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('analytics')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Analytics & Trends</span>
          </button>
          <button
            onClick={onOpenRegisterStaff}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            + Register Staff
          </button>
          <button
            onClick={onOpenRegisterPatient}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Admit / Register Patient</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Patients */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Patients</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalPatients}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active electronic files</div>
        </div>

        {/* Admitted Inpatients */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Inpatients</span>
            <BedDouble className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.admittedInpatients}</div>
          <div className="text-[11px] text-slate-500 mt-1">Occupying ward beds</div>
        </div>

        {/* Bed Occupancy */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Bed Occupancy</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.occupancyPercentage}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.occupiedBeds} / {stats.totalBeds} total beds
          </div>
        </div>

        {/* Staff on Duty */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">On-Duty Staff</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.onDutyStaff}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            of {stats.totalStaff} medical staff
          </div>
        </div>

        {/* Emergency Triage Cases */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Emergencies</span>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{stats.activeEmergencies}</div>
          <div className="text-[11px] text-rose-600/80 mt-1 font-medium">Critical resuscitation</div>
        </div>

        {/* NHIMA Coverage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">NHIMA Ratio</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.nhimaCoveragePercentage}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{stats.nhimaCovered} insured patients</div>
        </div>
      </div>

      {/* Emergency Triage Watchlist & Critical Alerts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Active High-Acuity Clinical Triage
              </h2>
              <p className="text-xs text-slate-500">
                Patients requiring immediate resuscitation or prompt medical officer review
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('patients')}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>All Patients</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {urgentQueue.map((patient) => {
            const latestVitals = patient.vitalsHistory[patient.vitalsHistory.length - 1];
            const isRed = patient.triageLevel === 'Emergency';

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  isRed
                    ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50/80'
                    : 'border-amber-300 bg-amber-50/40 hover:bg-amber-50/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {patient.fullName}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        {patient.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {patient.age} yrs · {patient.gender} · NRC: {patient.nrcNumber}
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded font-semibold ${
                      isRed
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-amber-500 text-white shadow-xs'
                    }`}
                  >
                    {patient.triageLevel}
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium mb-3">
                  <span className="text-slate-500 font-normal">Complaint: </span>
                  {patient.chiefComplaint}
                </div>

                {latestVitals && (
                  <div className="grid grid-cols-4 gap-2 py-2 px-3 bg-white/80 rounded-lg border border-slate-200/80 text-[11px] mb-3">
                    <div>
                      <div className="text-slate-400">BP</div>
                      <div className="font-semibold text-slate-800">
                        {latestVitals.systolicBP}/{latestVitals.diastolicBP}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Pulse</div>
                      <div className="font-semibold text-slate-800">
                        {latestVitals.heartRate} bpm
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">SpO2</div>
                      <div
                        className={`font-semibold ${
                          latestVitals.spo2 < 92 ? 'text-rose-600 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {latestVitals.spo2}%
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Temp</div>
                      <div className="font-semibold text-slate-800">
                        {latestVitals.temperature}°C
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5 truncate">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {patient.attendingDoctorName || 'Duty Medical Officer'}
                    </span>
                  </div>
                  <span className="font-medium text-emerald-700 hover:underline">
                    View EHR &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Hospital Departments Census & Recent Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clinical Departments Census */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Departmental Bed Census & Workload
              </h2>
              <p className="text-xs text-slate-500">
                Bed occupancy and on-duty staffing across major wards
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('departments')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all 11 departments &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {departments.slice(0, 6).map((dep) => {
              const bedRatio = dep.totalBeds > 0 ? (dep.occupiedBeds / dep.totalBeds) * 100 : 0;
              return (
                <div key={dep.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-400">
                        {dep.code}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {dep.name}
                      </h4>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      HOD: {dep.headOfDepartment} · {dep.location}
                    </div>
                  </div>

                  <div className="text-right shrink-0 w-36">
                    {dep.totalBeds > 0 ? (
                      <>
                        <div className="text-xs font-medium text-slate-700">
                          {dep.occupiedBeds} / {dep.totalBeds} beds ({Math.round(bedRatio)}%)
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              bedRatio > 85 ? 'bg-rose-500' : bedRatio > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, bedRatio)}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-500 font-medium">Diagnostic / Support</div>
                    )}
                    <div className="text-[11px] text-slate-400 mt-1">
                      {dep.onDutyStaffCount} staff on duty
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Admissions & Registrations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Recent Registrations
            </h2>
            <button
              onClick={() => onNavigateToTab('patients')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              Directory &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {patient.fullName}
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                      patient.status === 'Admitted'
                        ? 'bg-blue-50 text-blue-700'
                        : patient.status === 'Discharged'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                  <span>NRC: {patient.nrcNumber}</span>
                  <span className="font-mono">{patient.registeredDate.split(' ')[1] || ''}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1 truncate">
                  {patient.primaryDiagnosis || patient.chiefComplaint}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenRegisterPatient}
              className="w-full py-2 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors text-center"
            >
              + Register New Inpatient / Outpatient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
