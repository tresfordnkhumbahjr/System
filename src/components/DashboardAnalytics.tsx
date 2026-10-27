import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  BedDouble,
  FileText,
  Activity,
  AlertTriangle,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { Patient, Department } from '../types/hospital';
import {
  getAdmissionsTrendData,
  getBedOccupancyTrendData,
  getMonthlyReportVolumeData,
  calculateAcuityDistribution,
} from '../utils/analyticsLogic';

interface DashboardAnalyticsProps {
  patients: Patient[];
  departments: Department[];
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  patients,
  departments,
}) => {
  const [admissionsTimeframe, setAdmissionsTimeframe] = useState<7 | 14>(7);
  const [activeWardFilter, setActiveWardFilter] = useState<'all' | 'icu' | 'med' | 'surg'>('all');

  const admissionsData = getAdmissionsTrendData(admissionsTimeframe);
  const bedOccupancyData = getBedOccupancyTrendData();
  const monthlyReportsData = getMonthlyReportVolumeData();
  const acuityDistribution = calculateAcuityDistribution(patients);

  // Compute total volume summary
  const latestAdmissionTotal = admissionsData[admissionsData.length - 1]?.total || 0;
  const avgDailyAdmissions = Math.round(
    admissionsData.reduce((acc, curr) => acc + curr.total, 0) / admissionsData.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Analytics & Performance Metrics
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
              Live Clinical Intelligence
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Data visualization of patient admission trajectories, ward bed occupancy trends, and monthly medical reporting at Ndola Teaching Hospital.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Copperbelt Region · Q4 Surveillance</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Daily Intake</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgDailyAdmissions}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Peak intake: {Math.max(...admissionsData.map((d) => d.total))} on Friday
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">ICU Peak Utilization</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">92%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Critical capacity threshold: 85%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">NHIMA Claims (Oct)</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">980</div>
          <div className="text-[11px] text-slate-500 mt-1">
            +6.5% month-over-month increase
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Lab Volume</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">2,120</div>
          <div className="text-[11px] text-slate-500 mt-1">
            GeneXpert, Haematology & Malaria
          </div>
        </div>
      </div>

      {/* METRIC 1: Patient Admissions Trends */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Patient Admissions & Triage Influx Trends
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily patient volume stratified by Emergency Resuscitation, Inpatient Ward Admissions, and Outpatient Consultations.
            </p>
          </div>

          {/* Timeframe Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setAdmissionsTimeframe(7)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                admissionsTimeframe === 7
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setAdmissionsTimeframe(14)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                admissionsTimeframe === 14
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 14 Days
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={admissionsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorInpatient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorOutpatient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="emergency"
                name="Emergency (Red / Resuscitation)"
                stroke="#e11d48"
                fillOpacity={1}
                fill="url(#colorEmergency)"
              />
              <Area
                type="monotone"
                dataKey="inpatient"
                name="Inpatient Ward Admissions"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#colorInpatient)"
              />
              <Area
                type="monotone"
                dataKey="outpatient"
                name="Outpatient Consultations"
                stroke="#059669"
                fillOpacity={1}
                fill="url(#colorOutpatient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* METRIC 2 & METRIC 4: Bed Occupancy Over Time + Acuity Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Bed Occupancy Rates Over Time (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Department Bed Occupancy Trajectory (%)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring critical ward capacity against the 85% MOH contingency warning threshold.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Threshold: 85%</span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bedOccupancyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" stroke="#cbd5e1" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Occupancy']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="plainline" />
                {/* 85% Warning line */}
                <ReferenceLine
                  y={85}
                  stroke="#e11d48"
                  strokeDasharray="4 4"
                  label={{ value: '85% Capacity Alert', position: 'top', fill: '#e11d48', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="icu"
                  name="Intensive Care Unit (ICU)"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="internalMedicine"
                  name="Internal Medicine"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="surgery"
                  name="General Surgery"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="paediatrics"
                  name="Paediatrics"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="maternity"
                  name="Maternity & Labour"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Patient Triage Acuity (1 col) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Patient Triage Distribution
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-3">
              Real-time clinical acuity classification of currently registered hospital patients.
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={acuityDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {acuityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-3 border-t border-slate-100">
            {acuityDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* METRIC 3: Monthly Medical Report & Insurance Claims Volume */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">
                Monthly Medical Report & NHIMA Claim Volume
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited throughput of insurance claims, formal discharge dossiers, diagnostic lab outputs, and theatre records.
            </p>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            Cumulative 2026 Reporting Cycles
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyReportsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar
                dataKey="nhimaClaims"
                name="NHIMA Insurance Claims"
                fill="#0d9488"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="dischargeSummaries"
                name="Inpatient Discharge Summaries"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="labReports"
                name="Pathology & Lab Diagnostics"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="theatreProcedures"
                name="Surgical Operations"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
