import { Patient, Staff, Department, TriageLevel, Vitals } from '../types/hospital';

/**
 * Generates a standard Ndola Teaching Hospital patient ID
 * Format: NTH-YYYY-XXXX (e.g. NTH-2026-0042)
 */
export function generatePatientId(existingCount: number, year: number = 2026): string {
  const sequential = String(existingCount + 1).padStart(4, '0');
  return `NTH-${year}-${sequential}`;
}

/**
 * Generates an NTH healthcare staff registration code
 * Format: NTH-STF-XXX
 */
export function generateStaffId(prefix: string = 'STF', existingCount: number): string {
  const cleanPrefix = prefix.replace(/[^A-Z]/gi, '').toUpperCase().slice(0, 3) || 'STF';
  const sequential = String(existingCount + 1).padStart(3, '0');
  return `NTH-${cleanPrefix}-${sequential}`;
}

/**
 * Formats or cleans a Zambian National Registration Card (NRC) number
 * Format: XXXXXX/XX/X (6 digits / district code 2 digits / category digit 1, e.g., 294812/11/1)
 */
export function formatZambianNRC(input: string): string {
  if (!input) return '';
  const clean = input.trim();
  // If already formatted like 123456/11/1
  if (/^\d{6}\/\d{2}\/\d{1}$/.test(clean)) {
    return clean;
  }
  // If provided as raw digits like 123456111
  const digitsOnly = clean.replace(/\D/g, '');
  if (digitsOnly.length === 9) {
    return `${digitsOnly.slice(0, 6)}/${digitsOnly.slice(6, 8)}/${digitsOnly.slice(8, 9)}`;
  }
  return clean;
}

/**
 * Validates Zambian NRC format
 */
export function isValidNRC(nrc: string): boolean {
  return /^\d{6}\/\d{2}\/\d{1}$/.test(nrc);
}

/**
 * Validates Zambian phone number format (Airtel, MTN, Zamtel)
 * Format: +260... or 09... or 07...
 */
export function formatZambianPhone(phone: string): string {
  const clean = phone.replace(/[\s-]/g, '').trim();
  if (clean.startsWith('0')) {
    return `+260${clean.slice(1)}`;
  }
  if (!clean.startsWith('+') && clean.startsWith('260')) {
    return `+${clean}`;
  }
  return clean;
}

/**
 * Computes clinical triage priority based on vital signs according to
 * hospital triage guidelines (Emergency, Priority, Urgent, Routine).
 */
export function calculateTriageLevel(vitals: Partial<Vitals>): {
  level: TriageLevel;
  rationale: string;
  badgeClass: string;
} {
  const { systolicBP, heartRate, temperature, spo2, respiratoryRate } = vitals;

  // Emergency (Red) - Immediate resuscitation
  if (
    (spo2 !== undefined && spo2 < 90) ||
    (systolicBP !== undefined && (systolicBP < 85 || systolicBP > 210)) ||
    (heartRate !== undefined && (heartRate > 135 || heartRate < 42)) ||
    (respiratoryRate !== undefined && (respiratoryRate > 32 || respiratoryRate < 8)) ||
    (temperature !== undefined && temperature > 40.0)
  ) {
    const reasons: string[] = [];
    if (spo2 !== undefined && spo2 < 90) reasons.push(`Severe Hypoxia (${spo2}%)`);
    if (systolicBP !== undefined && (systolicBP < 85 || systolicBP > 210))
      reasons.push(`Critical BP (${systolicBP} mmHg)`);
    if (heartRate !== undefined && (heartRate > 135 || heartRate < 42))
      reasons.push(`Unstable HR (${heartRate} bpm)`);
    if (respiratoryRate !== undefined && (respiratoryRate > 32 || respiratoryRate < 8))
      reasons.push(`Abnormal RR (${respiratoryRate} bpm)`);
    if (temperature !== undefined && temperature > 40.0)
      reasons.push(`Hyperpyrexia (${temperature}°C)`);

    return {
      level: 'Emergency',
      rationale: `Critical vital signs: ${reasons.join(', ')}. Requires immediate resuscitation.`,
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-200',
    };
  }

  // Priority (Orange) - Very urgent, review within 10-15 mins
  if (
    (spo2 !== undefined && spo2 >= 90 && spo2 <= 93) ||
    (systolicBP !== undefined && (systolicBP < 95 || systolicBP >= 180)) ||
    (heartRate !== undefined && (heartRate > 115 || heartRate < 50)) ||
    (respiratoryRate !== undefined && respiratoryRate >= 26) ||
    (temperature !== undefined && (temperature >= 39.0 || temperature < 35.5))
  ) {
    return {
      level: 'Priority',
      rationale: 'High-risk vitals present. Fast-track for urgent medical officer review.',
      badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  }

  // Urgent (Yellow) - Moderate illness, review within 60 mins
  if (
    (heartRate !== undefined && heartRate > 95) ||
    (respiratoryRate !== undefined && respiratoryRate >= 21) ||
    (temperature !== undefined && temperature >= 37.8) ||
    (systolicBP !== undefined && (systolicBP >= 140 || systolicBP <= 100))
  ) {
    return {
      level: 'Urgent',
      rationale: 'Abnormal vitals noted. Scheduled for timely clinical consultation.',
      badgeClass: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    };
  }

  // Routine (Green) - Stable vitals
  return {
    level: 'Routine',
    rationale: 'Vitals within normal physiological thresholds.',
    badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  };
}

/**
 * Filter patients by search term, department, status, and triage
 */
export function filterPatients(
  patients: Patient[],
  filters: {
    search?: string;
    departmentId?: string;
    status?: string;
    triageLevel?: string;
  }
): Patient[] {
  const searchLower = (filters.search || '').trim().toLowerCase();

  return patients.filter((patient) => {
    if (searchLower) {
      const matchName = patient.fullName.toLowerCase().includes(searchLower);
      const matchId = patient.id.toLowerCase().includes(searchLower);
      const matchNRC = patient.nrcNumber.toLowerCase().includes(searchLower);
      const matchPhone = patient.phoneNumber.toLowerCase().includes(searchLower);
      const matchAddress = patient.residentialAddress.toLowerCase().includes(searchLower);
      const matchComplaint = patient.chiefComplaint.toLowerCase().includes(searchLower);
      if (!matchName && !matchId && !matchNRC && !matchPhone && !matchAddress && !matchComplaint) {
        return false;
      }
    }

    if (filters.departmentId && filters.departmentId !== 'all') {
      if (patient.currentDepartmentId !== filters.departmentId) return false;
    }

    if (filters.status && filters.status !== 'all') {
      if (patient.status !== filters.status) return false;
    }

    if (filters.triageLevel && filters.triageLevel !== 'all') {
      if (patient.triageLevel !== filters.triageLevel) return false;
    }

    return true;
  });
}

/**
 * Filter staff directory by query, department, role cadre, and duty status
 */
export function filterStaff(
  staffList: Staff[],
  filters: {
    search?: string;
    departmentId?: string;
    cadre?: string;
    onDutyOnly?: boolean;
  }
): Staff[] {
  const searchLower = (filters.search || '').trim().toLowerCase();

  return staffList.filter((member) => {
    if (searchLower) {
      const matchName = member.fullName.toLowerCase().includes(searchLower);
      const matchId = member.id.toLowerCase().includes(searchLower);
      const matchLicense = member.licenseNumber.toLowerCase().includes(searchLower);
      const matchCadre = member.cadre.toLowerCase().includes(searchLower);
      if (!matchName && !matchId && !matchLicense && !matchCadre) return false;
    }

    if (filters.departmentId && filters.departmentId !== 'all') {
      if (member.departmentId !== filters.departmentId) return false;
    }

    if (filters.cadre && filters.cadre !== 'all') {
      if (member.cadre !== filters.cadre) return false;
    }

    if (filters.onDutyOnly && !member.onDuty) {
      return false;
    }

    return true;
  });
}

/**
 * Computes high-level aggregated hospital statistics
 */
export function calculateHospitalStats(
  patients: Patient[],
  staffList: Staff[],
  departments: Department[]
) {
  const totalPatients = patients.length;
  const admittedInpatients = patients.filter((p) => p.status === 'Admitted').length;
  const outpatientsToday = patients.filter((p) => p.status === 'Outpatient').length;
  const inObservation = patients.filter((p) => p.status === 'In Observation').length;
  const activeEmergencies = patients.filter((p) => p.triageLevel === 'Emergency' && p.status !== 'Discharged').length;

  const totalBeds = departments.reduce((acc, dep) => acc + dep.totalBeds, 0);
  const occupiedBeds = departments.reduce((acc, dep) => acc + dep.occupiedBeds, 0);
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const onDutyStaff = staffList.filter((s) => s.onDuty).length;
  const nhimaCovered = patients.filter((p) => p.insuranceScheme === 'NHIMA').length;
  const nhimaCoveragePercentage = totalPatients > 0 ? Math.round((nhimaCovered / totalPatients) * 100) : 0;

  return {
    totalPatients,
    admittedInpatients,
    outpatientsToday,
    inObservation,
    activeEmergencies,
    totalBeds,
    occupiedBeds,
    availableBeds: Math.max(0, totalBeds - occupiedBeds),
    occupancyPercentage,
    onDutyStaff,
    totalStaff: staffList.length,
    nhimaCovered,
    nhimaCoveragePercentage,
  };
}
