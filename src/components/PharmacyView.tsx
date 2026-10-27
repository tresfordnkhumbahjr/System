import React, { useState } from 'react';
import {
  Pill,
  CheckCircle,
  Clock,
  Search,
  PackageCheck,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { Prescription, Patient } from '../types/hospital';

interface PharmacyViewProps {
  prescriptions: Prescription[];
  patients: Patient[];
  onDispensePrescription: (prescriptionId: string, dispensedBy: string) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  prescriptions,
  patients,
  onDispensePrescription,
  onSelectPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'dispensed'>('all');

  const filtered = prescriptions.filter((rx) => {
    const isDispensed = rx.medications.every((m) => m.status === 'Dispensed');
    if (statusFilter === 'pending' && isDispensed) return false;
    if (statusFilter === 'dispensed' && !isDispensed) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchPatient = rx.patientName.toLowerCase().includes(q);
      const matchDoc = rx.doctorName.toLowerCase().includes(q);
      const matchMed = rx.medications.some((m) => m.name.toLowerCase().includes(q));
      if (!matchPatient && !matchDoc && !matchMed) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pharmacy & Dispensary Services
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Clinical drug dispensing, prescription verification, and stock audit for Ndola Teaching Hospital.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
          <strong>Chief Pharmacist:</strong> Pharm. Charity Bwalya, BPharm, MSc
        </div>
      </div>

      {/* Stock Monitor Widget */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Essential Medicines Formulary & Stock Level
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 font-medium">IV Artesunate 60mg</div>
            <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">850 vials</div>
            <div className="text-[10px] text-slate-400">Malaria Protocol</div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 font-medium">IV Ceftriaxone 1g</div>
            <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">1,240 vials</div>
            <div className="text-[10px] text-slate-400">Broad-Spectrum</div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 font-medium">Aspirin 75mg</div>
            <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">4,800 tabs</div>
            <div className="text-[10px] text-slate-400">Cardiology Stock</div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 font-medium">Paracetamol IV</div>
            <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">920 bottles</div>
            <div className="text-[10px] text-slate-400">Analgesic / Antipyretic</div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 font-medium">Normal Saline 0.9%</div>
            <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">2,100 bags</div>
            <div className="text-[10px] text-slate-400">Resuscitation Fluids</div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 font-medium">Amlodipine 10mg</div>
            <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">3,200 tabs</div>
            <div className="text-[10px] text-slate-400">OPD Chronic Care</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prescription by patient, prescriber doctor, or medication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Prescriptions
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Awaiting Dispense
          </button>
          <button
            onClick={() => setStatusFilter('dispensed')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'dispensed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filtered.map((rx) => {
          const matchedPatient = patients.find((p) => p.id === rx.patientId);
          const allDispensed = rx.medications.every((m) => m.status === 'Dispensed');

          return (
            <div
              key={rx.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {rx.patientName}
                    </h3>
                    <span className="font-mono text-xs text-slate-500">
                      {rx.patientId}
                    </span>
                    {allDispensed ? (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Dispensed</span>
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Pending Dispensation</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Prescribed by: <strong>{rx.doctorName}</strong> ({rx.departmentName}) · {rx.prescribedAt}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {matchedPatient && (
                    <button
                      onClick={() => onSelectPatient(matchedPatient)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      View Patient EHR
                    </button>
                  )}

                  {!allDispensed && (
                    <button
                      onClick={() => onDispensePrescription(rx.id, 'Pharm. Charity Bwalya')}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>Dispense All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Medication Table */}
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Medication</th>
                      <th className="py-2 px-3">Dosage</th>
                      <th className="py-2 px-3">Frequency</th>
                      <th className="py-2 px-3">Duration</th>
                      <th className="py-2 px-3">Route</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rx.medications.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {med.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono">{med.dosage}</td>
                        <td className="py-2.5 px-3">{med.frequency}</td>
                        <td className="py-2.5 px-3">{med.duration}</td>
                        <td className="py-2.5 px-3">{med.route}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              med.status === 'Dispensed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {med.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rx.dispensedBy && (
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                  <span>
                    Verified & Dispensed by: <strong>{rx.dispensedBy}</strong>
                  </span>
                  <span className="font-mono text-slate-400">{rx.dispensedAt}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
