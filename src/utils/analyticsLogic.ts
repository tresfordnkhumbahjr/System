import { Patient, Department } from '../types/hospital';

export interface AdmissionTrendPoint {
  date: string;
  emergency: number;
  inpatient: number;
  outpatient: number;
  total: number;
}

export interface BedOccupancyTrendPoint {
  date: string;
  icu: number;
  internalMedicine: number;
  surgery: number;
  paediatrics: number;
  maternity: number;
}

export interface MonthlyReportPoint {
  month: string;
  nhimaClaims: number;
  dischargeSummaries: number;
  labReports: number;
  theatreProcedures: number;
}

/**
 * Returns 7-day or 30-day realistic historical & current patient admission trends
 * for Ndola Teaching Hospital.
 */
export function getAdmissionsTrendData(days: 7 | 14 | 30 = 7): AdmissionTrendPoint[] {
  const base = [
    { date: 'Oct 21', emergency: 8, inpatient: 14, outpatient: 42, total: 64 },
    { date: 'Oct 22', emergency: 12, inpatient: 18, outpatient: 50, total: 80 },
    { date: 'Oct 23', emergency: 9, inpatient: 15, outpatient: 48, total: 72 },
    { date: 'Oct 24', emergency: 14, inpatient: 20, outpatient: 55, total: 89 },
    { date: 'Oct 25', emergency: 11, inpatient: 16, outpatient: 49, total: 76 },
    { date: 'Oct 26', emergency: 15, inpatient: 22, outpatient: 62, total: 99 },
    { date: 'Oct 27 (Today)', emergency: 13, inpatient: 19, outpatient: 58, total: 90 },
  ];

  if (days === 7) return base;

  // If 14 days requested
  const extended: AdmissionTrendPoint[] = [
    { date: 'Oct 14', emergency: 7, inpatient: 12, outpatient: 38, total: 57 },
    { date: 'Oct 15', emergency: 10, inpatient: 15, outpatient: 45, total: 70 },
    { date: 'Oct 16', emergency: 11, inpatient: 16, outpatient: 46, total: 73 },
    { date: 'Oct 17', emergency: 8, inpatient: 14, outpatient: 40, total: 62 },
    { date: 'Oct 18', emergency: 13, inpatient: 19, outpatient: 54, total: 86 },
    { date: 'Oct 19', emergency: 12, inpatient: 17, outpatient: 51, total: 80 },
    { date: 'Oct 20', emergency: 9, inpatient: 13, outpatient: 44, total: 66 },
    ...base,
  ];

  return extended;
}

/**
 * Returns bed occupancy percentage over time by department
 */
export function getBedOccupancyTrendData(): BedOccupancyTrendPoint[] {
  return [
    { date: 'Mon', icu: 75, internalMedicine: 82, surgery: 71, paediatrics: 68, maternity: 74 },
    { date: 'Tue', icu: 83, internalMedicine: 85, surgery: 76, paediatrics: 72, maternity: 78 },
    { date: 'Wed', icu: 92, internalMedicine: 88, surgery: 78, paediatrics: 75, maternity: 80 },
    { date: 'Thu', icu: 83, internalMedicine: 83, surgery: 74, paediatrics: 70, maternity: 76 },
    { date: 'Fri', icu: 75, internalMedicine: 80, surgery: 73, paediatrics: 69, maternity: 72 },
    { date: 'Sat', icu: 83, internalMedicine: 79, surgery: 75, paediatrics: 71, maternity: 75 },
    { date: 'Sun (Today)', icu: 75, internalMedicine: 80, surgery: 76, paediatrics: 73, maternity: 76 },
  ];
}

/**
 * Returns monthly volume of medical reports, discharge papers, NHIMA insurance claims, and lab reports
 */
export function getMonthlyReportVolumeData(): MonthlyReportPoint[] {
  return [
    { month: 'May 2026', nhimaClaims: 640, dischargeSummaries: 510, labReports: 1420, theatreProcedures: 180 },
    { month: 'Jun 2026', nhimaClaims: 710, dischargeSummaries: 580, labReports: 1560, theatreProcedures: 210 },
    { month: 'Jul 2026', nhimaClaims: 790, dischargeSummaries: 620, labReports: 1680, theatreProcedures: 195 },
    { month: 'Aug 2026', nhimaClaims: 850, dischargeSummaries: 690, labReports: 1810, theatreProcedures: 230 },
    { month: 'Sep 2026', nhimaClaims: 920, dischargeSummaries: 740, labReports: 1950, theatreProcedures: 245 },
    { month: 'Oct 2026 (YTD)', nhimaClaims: 980, dischargeSummaries: 810, labReports: 2120, theatreProcedures: 260 },
  ];
}

/**
 * Computes patient triage breakdown from live patient records
 */
export function calculateAcuityDistribution(patients: Patient[]) {
  const counts = {
    Emergency: 0,
    Priority: 0,
    Urgent: 0,
    Routine: 0,
  };

  patients.forEach((p) => {
    if (counts[p.triageLevel] !== undefined) {
      counts[p.triageLevel]++;
    }
  });

  return [
    { name: 'Emergency (Red)', value: counts.Emergency, color: '#e11d48' },
    { name: 'Priority (Orange)', value: counts.Priority, color: '#f59e0b' },
    { name: 'Urgent (Yellow)', value: counts.Urgent, color: '#eab308' },
    { name: 'Routine (Green)', value: counts.Routine, color: '#10b981' },
  ];
}
