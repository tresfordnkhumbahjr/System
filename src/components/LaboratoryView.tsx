import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle,
  Clock,
  Search,
  Plus,
  AlertCircle,
  FileCheck,
  X,
} from 'lucide-react';
import { LabOrder, Patient } from '../types/hospital';

interface LaboratoryViewProps {
  labOrders: LabOrder[];
  patients: Patient[];
  onCompleteLabOrder: (orderId: string, resultData: { results: string; referenceRange: string; remarks: string }) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const LaboratoryView: React.FC<LaboratoryViewProps> = ({
  labOrders,
  patients,
  onCompleteLabOrder,
  onSelectPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Record Result Modal State
  const [activeOrder, setActiveOrder] = useState<LabOrder | null>(null);
  const [resultInput, setResultInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [remarksInput, setRemarksInput] = useState('');

  const filteredOrders = labOrders.filter((order) => {
    if (categoryFilter !== 'all' && order.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchPatient = order.patientName.toLowerCase().includes(q);
      const matchTest = order.testName.toLowerCase().includes(q);
      const matchDoc = order.requestedBy.toLowerCase().includes(q);
      if (!matchPatient && !matchTest && !matchDoc) return false;
    }
    return true;
  });

  const handleOpenResultModal = (order: LabOrder) => {
    setActiveOrder(order);
    setResultInput(order.results || '');
    setReferenceInput(order.referenceRange || '');
    setRemarksInput(order.remarks || '');
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    onCompleteLabOrder(activeOrder.id, {
      results: resultInput.trim(),
      referenceRange: referenceInput.trim(),
      remarks: remarksInput.trim(),
    });
    setActiveOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pathology & Laboratory Diagnostic Services
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Diagnostic specimens, malaria microscopy, GeneXpert TB, haematology and biochemistry at Ndola Teaching Hospital.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
          <strong>Lab Director:</strong> Dr. Clement Chileshe, FRCPath
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search test by patient, test name, requesting doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
        >
          <option value="all">All Disciplines</option>
          <option value="Haematology">Haematology</option>
          <option value="Biochemistry">Biochemistry</option>
          <option value="Parasitology">Parasitology (Malaria / Stool)</option>
          <option value="Microbiology">Microbiology (TB GeneXpert)</option>
          <option value="Radiology">Radiology</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Lab Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const matchedPatient = patients.find((p) => p.id === order.patientId);
          const isCompleted = order.status === 'Completed';

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {order.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {order.testName}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        order.priority === 'Stat (Emergency)'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.priority}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Patient: <strong>{order.patientName}</strong> ({order.patientId}) · Requested by:{' '}
                    <strong>{order.requestedBy}</strong> ({order.requestedAt})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {matchedPatient && (
                    <button
                      onClick={() => onSelectPatient(matchedPatient)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Patient Dossier
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenResultModal(order)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                      isCompleted
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isCompleted ? 'Edit Results' : 'Enter Test Result'}
                  </button>
                </div>
              </div>

              {/* Result Details */}
              {order.results ? (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-slate-400 font-medium text-[11px]">
                        Diagnostic Findings:
                      </div>
                      <div className="text-slate-900 font-bold font-mono mt-0.5">
                        {order.results}
                      </div>
                    </div>
                    {order.referenceRange && (
                      <div className="text-right shrink-0">
                        <div className="text-slate-400 font-medium text-[11px]">
                          Reference Range:
                        </div>
                        <div className="text-slate-600 font-mono mt-0.5">
                          {order.referenceRange}
                        </div>
                      </div>
                    )}
                  </div>
                  {order.remarks && (
                    <div className="text-slate-600 pt-1 border-t border-slate-200">
                      <strong>Pathologist Remarks:</strong> {order.remarks}
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>Reported by: {order.reportedBy || 'Mr. Clement Chileshe'}</span>
                    <span>{order.reportedAt}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Specimen processed in lab analyzer batch. Awaiting validation.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enter Result Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold">Record Diagnostic Test Result</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeOrder.testName} · {activeOrder.patientName}
                </p>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Test Results / Quantified Values *
                </label>
                <textarea
                  required
                  rows={2}
                  value={resultInput}
                  onChange={(e) => setResultInput(e.target.value)}
                  placeholder="e.g. Hb: 12.8 g/dL, WBC: 14.2 x 10^9/L, Platelets: 210 x 10^9/L"
                  className="w-full text-xs p-2 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Standard Reference Interval
                </label>
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value)}
                  placeholder="e.g. WBC: 4.0 - 11.0 x 10^9/L"
                  className="w-full text-xs p-2 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Clinical Pathologist Remarks / Interpretation
                </label>
                <input
                  type="text"
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder="e.g. Consistent with acute bacterial infection."
                  className="w-full text-xs p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveOrder(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Submit & Authorize Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
