export type TriageLevel = 'Emergency' | 'Priority' | 'Urgent' | 'Routine';

export type PatientStatus = 'Outpatient' | 'Admitted' | 'In Observation' | 'Discharged';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Vitals {
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  heartRate: number; // bpm
  temperature: number; // °C
  spo2: number; // %
  respiratoryRate: number; // breaths/min
  weight?: number; // kg
  recordedAt: string;
  recordedBy: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  author: string;
  authorRole: string;
  note: string;
  category: 'Progress' | 'Admission' | 'Consultation' | 'Nursing' | 'Discharge';
}

export interface Patient {
  id: string; // e.g. NTH-2026-0104
  fullName: string;
  nrcNumber: string; // Zambian National Registration Card e.g. 234123/11/1
  dateOfBirth: string;
  age: number;
  gender: Gender;
  phoneNumber: string;
  residentialAddress: string; // e.g. Kansenshi, Ndola
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies: string[];
  insuranceScheme: 'NHIMA' | 'MoH Standard' | 'Private Insurance' | 'Self Pay';
  nhimaNumber?: string;
  registeredDate: string;
  status: PatientStatus;
  currentDepartmentId: string;
  currentWardId?: string;
  bedNumber?: string;
  primaryDiagnosis?: string;
  triageLevel: TriageLevel;
  chiefComplaint: string;
  vitalsHistory: Vitals[];
  clinicalNotes: ClinicalNote[];
  attendingDoctorId?: string;
  attendingDoctorName?: string;
}

export type StaffCadre =
  | 'Consultant Physician'
  | 'Consultant Surgeon'
  | 'Medical Officer'
  | 'Registrar'
  | 'Clinical Officer'
  | 'Senior Nursing Officer'
  | 'Registered Nurse'
  | 'Chief Pharmacist'
  | 'Pharmacist'
  | 'Senior Lab Scientist'
  | 'Laboratory Technologist'
  | 'Radiographer'
  | 'Administrative Officer';

export interface Staff {
  id: string; // e.g. NTH-STF-023
  fullName: string;
  cadre: StaffCadre;
  departmentId: string;
  departmentName: string;
  qualification: string;
  licenseNumber: string; // e.g. HPCZ-2021-998 or GNCZ-1456
  phoneNumber: string;
  email: string;
  onDuty: boolean;
  shift: 'Morning (07:00 - 15:00)' | 'Afternoon (14:30 - 22:30)' | 'Night (22:00 - 07:30)' | 'On-Call';
  joinDate: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  type: 'Clinical' | 'Inpatient' | 'Diagnostic' | 'Support';
  headOfDepartment: string;
  location: string;
  description: string;
  totalBeds: number;
  occupiedBeds: number;
  onDutyStaffCount: number;
  activePatientCount: number;
  wards?: string[];
}

export interface Bed {
  id: string;
  wardId: string;
  wardName: string;
  departmentId: string;
  bedNumber: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  patientId?: string;
  patientName?: string;
  admittedDate?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "TDS (3x daily)"
  duration: string; // e.g. "5 days"
  route: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhalation';
  status: 'Prescribed' | 'Dispensed' | 'Out of Stock';
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  prescribedAt: string;
  medications: MedicationItem[];
  dispensedAt?: string;
  dispensedBy?: string;
  notes?: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: 'Haematology' | 'Biochemistry' | 'Parasitology' | 'Microbiology' | 'Radiology';
  requestedBy: string;
  requestedAt: string;
  priority: 'Routine' | 'Urgent' | 'Stat (Emergency)';
  status: 'Pending' | 'Sample Collected' | 'In Progress' | 'Completed';
  results?: string;
  referenceRange?: string;
  reportedBy?: string;
  reportedAt?: string;
  remarks?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  departmentId: string;
  departmentName: string;
  doctorName: string;
  dateTime: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Consultation';
}
