import React, { useState } from 'react';
import {
  X,
  FileText,
  Activity,
  Pill,
  FlaskConical,
  HeartPulse,
  UserCheck,
  Plus,
  AlertTriangle,
  Printer,
  ShieldCheck,
  Clock,
  BedDouble,
  CheckCircle,
} from 'lucide-react';
import { Patient, Vitals, ClinicalNote, Department, Bed } from '../types/hospital';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  beds: Bed[];
  onUpdatePatient: (updated: Patient) => void;
  onOpenReportModal: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  departments,
  beds,
  onUpdatePatient,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'notes' | 'prescriptions' | 'discharge'>('overview');

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('Dr. Mwansa Chanda');
  const [newNoteCategory, setNewNoteCategory] = useState<ClinicalNote['category']>('Progress');
  const [showAddNote, setShowAddNote] = useState(false);

  // New Vitals state
  const [showAddVitals, setShowAddVitals] = useState(false);
  const [newSystolic, setNewSystolic] = useState(120);
  const [newDiastolic, setNewDiastolic] = useState(80);
  const [newHR, setNewHR] = useState(76);
  const [newTemp, setNewTemp] = useState(36.8);
  const [newSpO2, setNewSpO2] = useState(98);
  const [newRR, setNewRR] = useState(18);

  // Department / Bed Transfer
  const [selectedDeptId, setSelectedDeptId] = useState(patient?.currentDepartmentId || '');
  const [selectedBed, setSelectedBed] = useState(patient?.bedNumber || '');

  // Discharge diagnosis & instructions
  const [dischargeDiagnosis, setDischargeDiagnosis] = useState(patient?.primaryDiagnosis || '');
  const [dischargeInstructions, setDischargeInstructions] = useState('');

  if (!isOpen || !patient) return null;

  const currentDept = departments.find((d) => d.id === patient.currentDepartmentId);
  const latestVitals = patient.vitalsHistory[patient.vitalsHistory.length - 1];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newNote: ClinicalNote = {
      id: `note-${Date.now()}`,
      date: dateStr,
      author: newNoteAuthor,
      authorRole: 'Attending Clinician',
      category: newNoteCategory,
      note: newNoteText.trim(),
    };

    const updated: Patient = {
      ...patient,
      clinicalNotes: [newNote, ...patient.clinicalNotes],
    };

    onUpdatePatient(updated);
    setNewNoteText('');
    setShowAddNote(false);
  };

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const vitalsRecord: Vitals = {
      systolicBP: newSystolic,
      diastolicBP: newDiastolic,
      heartRate: newHR,
      temperature: newTemp,
      spo2: newSpO2,
      respiratoryRate: newRR,
      recordedAt: dateStr,
      recordedBy: 'Ward Nurse',
    };

    const updated: Patient = {
      ...patient,
      vitalsHistory: [...patient.vitalsHistory, vitalsRecord],
    };

    onUpdatePatient(updated);
    setShowAddVitals(false);
  };

  const handleTransfer = () => {
    const updated: Patient = {
      ...patient,
      currentDepartmentId: selectedDeptId || patient.currentDepartmentId,
      bedNumber: selectedBed || patient.bedNumber,
      currentWardId: selectedBed ? `Ward for ${selectedBed}` : patient.currentWardId,
    };
    onUpdatePatient(updated);
  };

  const handleDischargePatient = () => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const dischargeNote: ClinicalNote = {
      id: `disc-note-${Date.now()}`,
      date: dateStr,
      author: 'Attending Consultant',
      authorRole: 'Discharge Authority',
      category: 'Discharge',
      note: `Formal discharge authorized. Final Diagnosis: ${dischargeDiagnosis || patient.primaryDiagnosis || 'Condition Resolved'}. Discharge instructions given: ${dischargeInstructions || 'Routine follow-up in 2 weeks at NTH Outpatient Clinic.'}`,
    };

    const updated: Patient = {
      ...patient,
      status: 'Discharged',
      primaryDiagnosis: dischargeDiagnosis || patient.primaryDiagnosis,
      clinicalNotes: [dischargeNote, ...patient.clinicalNotes],
    };

    onUpdatePatient(updated);
    onOpenReportModal(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-4xl w-full overflow-hidden my-6">
        {/* Header with patient quick banner */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {patient.fullName}
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {patient.id}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                    patient.triageLevel === 'Emergency'
                      ? 'bg-rose-600 text-white'
                      : patient.triageLevel === 'Priority'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {patient.triageLevel} Priority
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                    patient.status === 'Admitted'
                      ? 'bg-blue-600 text-white'
                      : patient.status === 'Discharged'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  {patient.status}
                </span>
              </div>

              {/* Subtitle details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-2">
                <span>NRC: <strong className="font-mono text-white">{patient.nrcNumber}</strong></span>
                <span>Age: <strong className="text-white">{patient.age} yrs</strong> ({patient.gender})</span>
                <span>Blood: <strong className="text-emerald-300">{patient.bloodGroup}</strong></span>
                <span>Phone: <strong className="text-white">{patient.phoneNumber}</strong></span>
                <span>Scheme: <strong className="text-teal-300">{patient.insuranceScheme}</strong> {patient.nhimaNumber && `(${patient.nhimaNumber})`}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenReportModal(patient)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Discharge Summary</span>
              </button>
              <button
                onClick={onClose}
                aria-label="Close dossier"
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Location & Allergies bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <BedDouble className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>{currentDept?.name || 'Department'}</strong> ·{' '}
                {patient.currentWardId || 'Inpatient Unit'} ·{' '}
                <span className="font-mono text-emerald-300 font-semibold">
                  {patient.bedNumber || 'No Bed Assigned'}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300">
                Allergies:{' '}
                <span className="text-amber-300 font-medium">
                  {patient.allergies.join(', ') || 'None reported'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Dossier Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical Overview
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'vitals'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Vitals Flowsheet ({patient.vitalsHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical Notes ({patient.clinicalNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('discharge')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'discharge'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Transfer & Discharge
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Chief Complaint & Primary Diagnosis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Chief Complaint at Admission
                  </div>
                  <p className="text-sm text-slate-900 font-medium">
                    {patient.chiefComplaint}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Admitted: {patient.registeredDate}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                    Primary Clinical Diagnosis
                  </div>
                  <p className="text-sm text-slate-900 font-bold">
                    {patient.primaryDiagnosis || 'Pending differential review by attending physician'}
                  </p>
                  <div className="text-[11px] text-emerald-700 mt-2">
                    Attending: {patient.attendingDoctorName || 'Dr. Mwansa Chanda (Internal Medicine)'}
                  </div>
                </div>
              </div>

              {/* Latest Vitals Snapshot */}
              {latestVitals && (
                <div className="p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Latest Measured Vital Signs
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400">
                      Recorded: {latestVitals.recordedAt} by {latestVitals.recordedBy}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-lg text-center">
                      <div className="text-[11px] text-slate-500">Blood Pressure</div>
                      <div className="text-base font-bold text-slate-900 font-mono">
                        {latestVitals.systolicBP}/{latestVitals.diastolicBP}
                      </div>
                      <div className="text-[10px] text-slate-400">mmHg</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg text-center">
                      <div className="text-[11px] text-slate-500">Heart Rate</div>
                      <div className="text-base font-bold text-slate-900 font-mono">
                        {latestVitals.heartRate}
                      </div>
                      <div className="text-[10px] text-slate-400">bpm</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg text-center">
                      <div className="text-[11px] text-slate-500">Temperature</div>
                      <div className="text-base font-bold text-slate-900 font-mono">
                        {latestVitals.temperature}°C
                      </div>
                      <div className="text-[10px] text-slate-400">Axillary</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg text-center">
                      <div className="text-[11px] text-slate-500">SpO2 (Pulse Ox)</div>
                      <div className={`text-base font-bold font-mono ${latestVitals.spo2 < 92 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {latestVitals.spo2}%
                      </div>
                      <div className="text-[10px] text-slate-400">Room air</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg text-center">
                      <div className="text-[11px] text-slate-500">Resp Rate</div>
                      <div className="text-base font-bold text-slate-900 font-mono">
                        {latestVitals.respiratoryRate}
                      </div>
                      <div className="text-[10px] text-slate-400">breaths/min</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg text-center">
                      <div className="text-[11px] text-slate-500">Triage Level</div>
                      <div className="text-xs font-bold text-emerald-700 mt-1">
                        {patient.triageLevel}
                      </div>
                      <div className="text-[10px] text-slate-400">Protocol</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Contacts & Next of Kin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Residential & Emergency Contact</h4>
                  <div className="space-y-1.5 text-slate-600">
                    <div>Address: <span className="text-slate-900 font-medium">{patient.residentialAddress}</span></div>
                    <div>Patient Phone: <span className="text-slate-900 font-medium">{patient.phoneNumber}</span></div>
                    <div>Admission Status: <span className="text-slate-900 font-medium">{patient.status}</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Next of Kin Details</h4>
                  <div className="space-y-1.5 text-slate-600">
                    <div>Name: <span className="text-slate-900 font-medium">{patient.nextOfKinName}</span></div>
                    <div>Relationship: <span className="text-slate-900 font-medium">{patient.nextOfKinRelationship}</span></div>
                    <div>Contact Phone: <span className="text-slate-900 font-medium">{patient.nextOfKinPhone}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VITALS FLOWSHEET */}
          {activeTab === 'vitals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Serial Vital Signs Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Monitored at bedside by ward nursing and clinical officers
                  </p>
                </div>
                <button
                  onClick={() => setShowAddVitals(!showAddVitals)}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record New Vitals</span>
                </button>
              </div>

              {showAddVitals && (
                <form
                  onSubmit={handleAddVitals}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                >
                  <h4 className="text-xs font-semibold text-slate-700">Enter Bedside Reading</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500">Systolic</label>
                      <input
                        type="number"
                        value={newSystolic}
                        onChange={(e) => setNewSystolic(Number(e.target.value))}
                        className="w-full text-xs p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Diastolic</label>
                      <input
                        type="number"
                        value={newDiastolic}
                        onChange={(e) => setNewDiastolic(Number(e.target.value))}
                        className="w-full text-xs p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Pulse (bpm)</label>
                      <input
                        type="number"
                        value={newHR}
                        onChange={(e) => setNewHR(Number(e.target.value))}
                        className="w-full text-xs p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Temp (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newTemp}
                        onChange={(e) => setNewTemp(Number(e.target.value))}
                        className="w-full text-xs p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">SpO2 (%)</label>
                      <input
                        type="number"
                        value={newSpO2}
                        onChange={(e) => setNewSpO2(Number(e.target.value))}
                        className="w-full text-xs p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Resp Rate</label>
                      <input
                        type="number"
                        value={newRR}
                        onChange={(e) => setNewRR(Number(e.target.value))}
                        className="w-full text-xs p-1.5 border rounded bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddVitals(false)}
                      className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded"
                    >
                      Save Vitals
                    </button>
                  </div>
                </form>
              )}

              {/* Vitals Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">BP (mmHg)</th>
                      <th className="py-2.5 px-3">Pulse</th>
                      <th className="py-2.5 px-3">Temp</th>
                      <th className="py-2.5 px-3">SpO2</th>
                      <th className="py-2.5 px-3">Resp</th>
                      <th className="py-2.5 px-3">Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...patient.vitalsHistory].reverse().map((v, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-600">{v.recordedAt}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {v.systolicBP}/{v.diastolicBP}
                        </td>
                        <td className="py-2.5 px-3">{v.heartRate} bpm</td>
                        <td className="py-2.5 px-3">{v.temperature}°C</td>
                        <td className={`py-2.5 px-3 font-medium ${v.spo2 < 92 ? 'text-rose-600 font-bold' : ''}`}>
                          {v.spo2}%
                        </td>
                        <td className="py-2.5 px-3">{v.respiratoryRate}/min</td>
                        <td className="py-2.5 px-3 text-slate-500">{v.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CLINICAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Clinical Progress & Ward Round Notes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chronological medical entries by attending physicians, surgeons and nursing officers
                  </p>
                </div>
                <button
                  onClick={() => setShowAddNote(!showAddNote)}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Clinical Note</span>
                </button>
              </div>

              {showAddNote && (
                <form
                  onSubmit={handleAddNote}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">
                        Author Clinician
                      </label>
                      <input
                        type="text"
                        value={newNoteAuthor}
                        onChange={(e) => setNewNoteAuthor(e.target.value)}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">
                        Note Category
                      </label>
                      <select
                        value={newNoteCategory}
                        onChange={(e) => setNewNoteCategory(e.target.value as any)}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      >
                        <option value="Progress">Ward Round / Progress Note</option>
                        <option value="Consultation">Specialist Consultation</option>
                        <option value="Nursing">Nursing Assessment</option>
                        <option value="Admission">Admission History</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">
                      Clinical Observations & Management Plan
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Document physical exam findings, investigation results, changes in medication, fluid balance..."
                      className="w-full text-xs p-2 border rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddNote(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                    >
                      Append Note
                    </button>
                  </div>
                </form>
              )}

              {/* Notes Timeline */}
              <div className="space-y-3">
                {patient.clinicalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{note.author}</span>
                        <span className="text-slate-500 font-medium">({note.authorRole})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {note.category}
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{note.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {note.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TRANSFER & DISCHARGE */}
          {activeTab === 'discharge' && (
            <div className="space-y-6">
              {/* Ward & Bed Transfer */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Ward Transfer & Bed Reallocation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Target Department</label>
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full text-xs p-2 border rounded-lg bg-white"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Ward Bed Number</label>
                    <input
                      type="text"
                      placeholder="e.g. MMW-04 or ICU-01"
                      value={selectedBed}
                      onChange={(e) => setSelectedBed(e.target.value)}
                      className="w-full text-xs p-2 border rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleTransfer}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Update Bed / Ward Location
                  </button>
                </div>
              </div>

              {/* Discharge Section */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Discharge from Hospital
                    </h4>
                    <p className="text-xs text-slate-500">
                      Authorizes release, updates status to Discharged, and prepares NHIMA claim summary
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Final Discharge Diagnosis
                  </label>
                  <input
                    type="text"
                    value={dischargeDiagnosis}
                    onChange={(e) => setDischargeDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Appendicitis (Status post laparoscopic appendectomy)"
                    className="w-full text-xs p-2 border rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Discharge Instructions & Take-Home Medications
                  </label>
                  <textarea
                    rows={2}
                    value={dischargeInstructions}
                    onChange={(e) => setDischargeInstructions(e.target.value)}
                    placeholder="Take-home Amoxicillin 500mg TDS for 5 days. Return to NTH Surgical Clinic in 10 days for wound check..."
                    className="w-full text-xs p-2 border rounded-lg bg-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Will generate official discharge summary on completion
                  </span>
                  <button
                    type="button"
                    onClick={handleDischargePatient}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
                  >
                    Authorize Discharge & Generate Summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Ndola Teaching Hospital Electronic Health Record</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
