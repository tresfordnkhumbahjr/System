import React, { useState } from 'react';
import {
  BedDouble,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  Users,
  Building,
} from 'lucide-react';
import { Bed, Patient, Department } from '../types/hospital';

interface BedsViewProps {
  beds: Bed[];
  patients: Patient[];
  departments: Department[];
  onSelectPatient: (patient: Patient) => void;
  onUpdateBedStatus: (bedId: string, status: Bed['status']) => void;
}

export const BedsView: React.FC<BedsViewProps> = ({
  beds,
  patients,
  departments,
  onSelectPatient,
  onUpdateBedStatus,
}) => {
  const [selectedWard, setSelectedWard] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const uniqueWards = Array.from(new Set(beds.map((b) => b.wardName)));

  const filteredBeds = beds.filter((b) => {
    if (selectedWard !== 'all' && b.wardName !== selectedWard) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  const totalBeds = beds.length;
  const occupiedCount = beds.filter((b) => b.status === 'Occupied').length;
  const availableCount = beds.filter((b) => b.status === 'Available').length;
  const maintenanceCount = beds.filter((b) => b.status === 'Maintenance').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedCount / totalBeds) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ward & Bed Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time inpatient bed allocation across Intensive Care, Surgical, Medical, Maternity, and Paediatric wards.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700">Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-700">Occupied ({occupiedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-slate-700">Maintenance ({maintenanceCount})</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-700">Filter Ward:</label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">All Wards ({uniqueWards.length})</option>
            {uniqueWards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-700">Bed Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-500">
          Occupancy: <strong>{occupancyRate}%</strong>
        </div>
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const matchedPatient = bed.patientId
            ? patients.find((p) => p.id === bed.patientId)
            : null;

          const isOccupied = bed.status === 'Occupied';
          const isAvailable = bed.status === 'Available';
          const isMaintenance = bed.status === 'Maintenance';

          return (
            <div
              key={bed.id}
              className={`p-4 rounded-xl border transition-all ${
                isOccupied
                  ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                  : isAvailable
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <BedDouble
                      className={`w-4 h-4 ${
                        isOccupied
                          ? 'text-blue-600'
                          : isAvailable
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    />
                    <h3 className="text-sm font-mono font-bold text-slate-900">
                      {bed.bedNumber}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{bed.wardName}</div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                    isOccupied
                      ? 'bg-blue-600 text-white'
                      : isAvailable
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-400 text-white'
                  }`}
                >
                  {bed.status}
                </span>
              </div>

              {/* Patient info if occupied */}
              {isOccupied && (
                <div className="mt-3 pt-2 border-t border-blue-100 text-xs">
                  <div className="font-semibold text-slate-900 truncate">
                    {bed.patientName || matchedPatient?.fullName || 'Admitted Patient'}
                  </div>
                  {matchedPatient && (
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {matchedPatient.id} · NRC: {matchedPatient.nrcNumber}
                    </div>
                  )}
                  {bed.admittedDate && (
                    <div className="text-[10px] text-slate-400 mt-1">
                      Admitted: {bed.admittedDate}
                    </div>
                  )}

                  {matchedPatient && (
                    <button
                      onClick={() => onSelectPatient(matchedPatient)}
                      className="mt-2 text-xs font-medium text-blue-700 hover:underline block"
                    >
                      Open Patient Dossier &rarr;
                    </button>
                  )}
                </div>
              )}

              {/* Available actions */}
              {isAvailable && (
                <div className="mt-3 pt-2 border-t border-emerald-100 text-xs">
                  <div className="text-emerald-800 font-medium">Ready for admission</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Sanitized & prepared by ward housekeeping
                  </div>
                  <button
                    onClick={() => onUpdateBedStatus(bed.id, 'Maintenance')}
                    className="mt-2 text-[11px] text-slate-500 hover:text-slate-700 underline"
                  >
                    Flag Maintenance
                  </button>
                </div>
              )}

              {/* Maintenance actions */}
              {isMaintenance && (
                <div className="mt-3 pt-2 border-t border-slate-200 text-xs">
                  <div className="text-slate-600 flex items-center gap-1 font-medium">
                    <Wrench className="w-3 h-3 text-slate-400" />
                    <span>Under Maintenance</span>
                  </div>
                  <button
                    onClick={() => onUpdateBedStatus(bed.id, 'Available')}
                    className="mt-2 text-[11px] text-emerald-700 hover:underline font-medium"
                  >
                    Mark Available
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
