import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePatientId,
  generateStaffId,
  formatZambianNRC,
  isValidNRC,
  formatZambianPhone,
  calculateTriageLevel,
  calculateHospitalStats,
  filterPatients,
  filterStaff,
} from './hospitalLogic';
import { Patient, Staff, Department } from '../types/hospital';

test('generatePatientId creates formatted hospital ID', () => {
  assert.equal(generatePatientId(0, 2026), 'NTH-2026-0001');
  assert.equal(generatePatientId(41, 2026), 'NTH-2026-0042');
  assert.equal(generatePatientId(999, 2026), 'NTH-2026-1000');
});

test('generateStaffId generates prefixed staff code', () => {
  assert.equal(generateStaffId('DOC', 0), 'NTH-DOC-001');
  assert.equal(generateStaffId('NUR', 14), 'NTH-NUR-015');
});

test('formatZambianNRC correctly parses 9 raw digits into standard format', () => {
  assert.equal(formatZambianNRC('294812111'), '294812/11/1');
  assert.equal(formatZambianNRC('294812/11/1'), '294812/11/1');
  assert.equal(isValidNRC('294812/11/1'), true);
  assert.equal(isValidNRC('294812111'), false);
});

test('formatZambianPhone standardizes local cell numbers to +260 format', () => {
  assert.equal(formatZambianPhone('0977123456'), '+260977123456');
  assert.equal(formatZambianPhone('0966987654'), '+260966987654');
  assert.equal(formatZambianPhone('260955112233'), '+260955112233');
  assert.equal(formatZambianPhone('+260971234567'), '+260971234567');
});

test('calculateTriageLevel identifies Emergency for severe hypoxemia or hypotension', () => {
  const severeHypoxia = calculateTriageLevel({ spo2: 86, systolicBP: 120, heartRate: 80, respiratoryRate: 18 });
  assert.equal(severeHypoxia.level, 'Emergency');

  const septicShock = calculateTriageLevel({ systolicBP: 78, heartRate: 140, temperature: 40.2 });
  assert.equal(septicShock.level, 'Emergency');
});

test('calculateTriageLevel identifies Priority and Routine correctly', () => {
  const priorityPatient = calculateTriageLevel({ spo2: 92, systolicBP: 110, heartRate: 85, respiratoryRate: 20 });
  assert.equal(priorityPatient.level, 'Priority');

  const normalPatient = calculateTriageLevel({ spo2: 98, systolicBP: 118, heartRate: 72, respiratoryRate: 16, temperature: 36.6 });
  assert.equal(normalPatient.level, 'Routine');
});

test('calculateHospitalStats aggregates clinical totals and bed occupancy correctly', () => {
  const mockPatients = [
    { id: '1', status: 'Admitted', triageLevel: 'Emergency', insuranceScheme: 'NHIMA' },
    { id: '2', status: 'Admitted', triageLevel: 'Priority', insuranceScheme: 'NHIMA' },
    { id: '3', status: 'Outpatient', triageLevel: 'Routine', insuranceScheme: 'MoH Standard' },
    { id: '4', status: 'In Observation', triageLevel: 'Urgent', insuranceScheme: 'Self Pay' },
  ] as Patient[];

  const mockStaff = [
    { id: 's1', onDuty: true },
    { id: 's2', onDuty: false },
    { id: 's3', onDuty: true },
  ] as Staff[];

  const mockDepartments = [
    { id: 'd1', totalBeds: 20, occupiedBeds: 15 },
    { id: 'd2', totalBeds: 30, occupiedBeds: 10 },
  ] as Department[];

  const stats = calculateHospitalStats(mockPatients, mockStaff, mockDepartments);

  assert.equal(stats.totalPatients, 4);
  assert.equal(stats.admittedInpatients, 2);
  assert.equal(stats.outpatientsToday, 1);
  assert.equal(stats.totalBeds, 50);
  assert.equal(stats.occupiedBeds, 25);
  assert.equal(stats.availableBeds, 25);
  assert.equal(stats.occupancyPercentage, 50);
  assert.equal(stats.onDutyStaff, 2);
  assert.equal(stats.nhimaCoveragePercentage, 50);
});

test('filterPatients matches search query across name, NRC and chief complaint', () => {
  const samplePatients = [
    { id: 'NTH-2026-0001', fullName: 'Chileshe Mulenga', nrcNumber: '112233/11/1', phoneNumber: '+260977111222', residentialAddress: 'Kansenshi', chiefComplaint: 'Acute chest pain', currentDepartmentId: 'dep-emerg', status: 'Admitted', triageLevel: 'Emergency' },
    { id: 'NTH-2026-0002', fullName: 'Mutale Mwape', nrcNumber: '998877/11/1', phoneNumber: '+260966333444', residentialAddress: 'Ndeke', chiefComplaint: 'Persistent cough', currentDepartmentId: 'dep-opd', status: 'Outpatient', triageLevel: 'Routine' },
  ] as Patient[];

  const searchByName = filterPatients(samplePatients, { search: 'chileshe' });
  assert.equal(searchByName.length, 1);
  assert.equal(searchByName[0].fullName, 'Chileshe Mulenga');

  const searchByComplaint = filterPatients(samplePatients, { search: 'cough' });
  assert.equal(searchByComplaint.length, 1);
  assert.equal(searchByComplaint[0].fullName, 'Mutale Mwape');

  const filterByDept = filterPatients(samplePatients, { departmentId: 'dep-emerg' });
  assert.equal(filterByDept.length, 1);
  assert.equal(filterByDept[0].id, 'NTH-2026-0001');
});
