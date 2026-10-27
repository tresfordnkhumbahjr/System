import React from 'react';
import { X, Printer, Building2, ShieldCheck, Download } from 'lucide-react';
import { Patient, Department } from '../types/hospital';

interface MedicalReportModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
}

export const MedicalReportModal: React.FC<MedicalReportModalProps> = ({
  patient,
  isOpen,
  onClose,
  departments,
}) => {
  if (!isOpen || !patient) return null;

  const dept = departments.find((d) => d.id === patient.currentDepartmentId);
  const latestVitals = patient.vitalsHistory[patient.vitalsHistory.length - 1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden my-8">
        {/* Modal Top Actions */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium">
              Official Medical Summary & NHIMA Claim Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 space-y-6 text-slate-800 bg-white">
          {/* Official Letterhead Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Republic of Zambia · Ministry of Health
            </div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
              Ndola Teaching Hospital
            </h1>
            <div className="text-xs text-slate-600 font-medium">
              Copperbelt Provincial Referral & University Teaching Center · P.O. Box 70110, Ndola
            </div>
            <div className="inline-block mt-2 px-3 py-0.5 rounded border border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-900">
              Official Inpatient Clinical Summary & NHIMA Insurance Claim
            </div>
          </div>

          {/* Reference row */}
          <div className="flex justify-between text-xs text-slate-600 font-mono">
            <div>
              Case Ref: <strong className="text-slate-900">{patient.id}</strong>
            </div>
            <div>
              Date Generated:{' '}
              <strong className="text-slate-900">
                {new Date().toISOString().split('T')[0]}
              </strong>
            </div>
          </div>

          {/* Patient Demographic Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-100 px-3 py-1.5 font-bold uppercase text-[10px] text-slate-700 tracking-wider">
              Patient Identification & Demographic Data
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-white">
              <div>
                <span className="text-slate-500 block text-[10px]">Patient Name:</span>
                <span className="font-bold text-slate-900">{patient.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Zambian NRC:</span>
                <span className="font-mono font-bold text-slate-900">{patient.nrcNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Age / Gender:</span>
                <span className="font-medium text-slate-900">{patient.age} yrs / {patient.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Blood Group:</span>
                <span className="font-bold text-slate-900">{patient.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Residential Address:</span>
                <span className="text-slate-900">{patient.residentialAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Phone Number:</span>
                <span className="text-slate-900">{patient.phoneNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Insurance Scheme:</span>
                <span className="font-bold text-slate-900">{patient.insuranceScheme}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">NHIMA Member No:</span>
                <span className="font-mono text-slate-900">{patient.nhimaNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Admission & Discharge Dates */}
          <div className="grid grid-cols-3 gap-3 text-xs p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">Admission Date:</span>
              <span className="font-medium text-slate-900">{patient.registeredDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Discharging Unit:</span>
              <span className="font-medium text-slate-900">{dept?.name || 'General Ward'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Discharge Status:</span>
              <span className="font-bold text-slate-900">{patient.status}</span>
            </div>
          </div>

          {/* Diagnoses */}
          <div className="space-y-2 text-xs">
            <div className="font-bold uppercase text-[11px] text-slate-900 tracking-wider">
              Clinical Diagnoses & Presenting Illness
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 mb-1">
                Primary Diagnosis: {patient.primaryDiagnosis || patient.chiefComplaint}
              </div>
              <div className="text-slate-600">
                <strong>Chief Complaint:</strong> {patient.chiefComplaint}
              </div>
              <div className="text-slate-600 mt-1">
                <strong>Known Allergies:</strong> {patient.allergies.join(', ')}
              </div>
            </div>
          </div>

          {/* Clinical Discharge Notes */}
          <div className="space-y-2 text-xs">
            <div className="font-bold uppercase text-[11px] text-slate-900 tracking-wider">
              Summary of Hospital Course & Management
            </div>
            <div className="p-3 border border-slate-200 rounded-lg space-y-2 text-slate-700 leading-relaxed">
              {patient.clinicalNotes.slice(0, 3).map((note, idx) => (
                <div key={idx} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-900 mb-0.5">
                    <span>{note.author} ({note.category})</span>
                    <span className="text-slate-400 font-mono text-[10px]">{note.date}</span>
                  </div>
                  <p>{note.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Discharge Vitals */}
          {latestVitals && (
            <div className="text-xs">
              <div className="font-bold uppercase text-[10px] text-slate-500 tracking-wider mb-1">
                Discharge Vital Signs Stability
              </div>
              <div className="grid grid-cols-5 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center font-mono">
                <div>BP: {latestVitals.systolicBP}/{latestVitals.diastolicBP}</div>
                <div>HR: {latestVitals.heartRate} bpm</div>
                <div>Temp: {latestVitals.temperature}°C</div>
                <div>SpO2: {latestVitals.spo2}%</div>
                <div>RR: {latestVitals.respiratoryRate}/min</div>
              </div>
            </div>
          )}

          {/* Official Doctor Signature and Stamp Block */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-xs mt-6">
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-900">
                {patient.attendingDoctorName || 'Dr. Mwansa Chanda, FCP (ECSA)'}
              </div>
              <div className="text-slate-500">
                Attending Consultant Physician / Surgeon
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                HPCZ License: HPCZ-MD-1290 / Ndola Teaching Hospital
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-2 border-dashed border-slate-300 rounded-lg p-3 text-center w-48">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Official NTH Stamp
                </div>
                <div className="text-[10px] text-slate-400 mt-2">
                  Verified for NHIMA Claim
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
