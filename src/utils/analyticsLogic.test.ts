import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAdmissionsTrendData,
  getBedOccupancyTrendData,
  getMonthlyReportVolumeData,
  calculateAcuityDistribution,
} from './analyticsLogic';
import { Patient } from '../types/hospital';

test('getAdmissionsTrendData returns 7 or 14 day records with totals', () => {
  const week = getAdmissionsTrendData(7);
  assert.equal(week.length, 7);
  assert.ok(week[0].total > 0);
  assert.equal(week[0].total, week[0].emergency + week[0].inpatient + week[0].outpatient);

  const fortnight = getAdmissionsTrendData(14);
  assert.equal(fortnight.length, 14);
});

test('getBedOccupancyTrendData contains all critical wards', () => {
  const beds = getBedOccupancyTrendData();
  assert.equal(beds.length, 7);
  assert.ok(beds[0].icu > 0 && beds[0].icu <= 100);
  assert.ok(beds[0].internalMedicine > 0);
  assert.ok(beds[0].surgery > 0);
});

test('getMonthlyReportVolumeData tracks NHIMA claims and lab volumes', () => {
  const reports = getMonthlyReportVolumeData();
  assert.equal(reports.length, 6);
  assert.ok(reports[reports.length - 1].nhimaClaims > reports[0].nhimaClaims);
});

test('calculateAcuityDistribution groups patients by triage level', () => {
  const sample = [
    { triageLevel: 'Emergency' },
    { triageLevel: 'Emergency' },
    { triageLevel: 'Priority' },
    { triageLevel: 'Routine' },
  ] as Patient[];

  const distribution = calculateAcuityDistribution(sample);
  assert.equal(distribution.find((d) => d.name.includes('Emergency'))?.value, 2);
  assert.equal(distribution.find((d) => d.name.includes('Priority'))?.value, 1);
  assert.equal(distribution.find((d) => d.name.includes('Routine'))?.value, 1);
  assert.equal(distribution.find((d) => d.name.includes('Urgent'))?.value, 0);
});
