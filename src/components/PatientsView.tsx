import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  FileText,
  BedDouble,
  HeartPulse,
  Clock,
} from 'lucide-react';
import { Patient, Department } from '../types/hospital';
import { filterPatients } from '../utils/hospitalLogic';

interface PatientsViewProps {
  patients: Patient[];
  departments: Department[];
  onSelectPatient: (patient: Patient) => void;
  onOpenRegisterModal: () => void;
  onOpenReportModal: (patient: Patient) => void;
  initialSearch?: string;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  departments,
  onSelectPatient,
  onOpenRegisterModal,
  onOpenReportModal,
  initialSearch = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [triageFilter, setTriageFilter] = useState('all');

  const filteredPatients = filterPatients(patients, {
    search: searchTerm,
    departmentId: departmentFilter,
    status: statusFilter,
    triageLevel: triageFilter,
  });

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Patient Registry & Records
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete electronic medical dossiers, admissions, and NRC records for Ndola Teaching Hospital.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, NTH ID (e.g. NTH-2026-0001), Zambian NRC, phone, town..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Departments (11)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="In Observation">In Observation</option>
            <option value="Outpatient">Outpatient</option>
            <option value="Discharged">Discharged</option>
          </select>

          {/* Triage Filter */}
          <select
            value={triageFilter}
            onChange={(e) => setTriageFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Triage Levels</option>
            <option value="Emergency">Emergency (Red)</option>
            <option value="Priority">Priority (Orange)</option>
            <option value="Urgent">Urgent (Yellow)</option>
            <option value="Routine">Routine (Green)</option>
          </select>
        </div>

        {/* Results summary text */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{filteredPatients.length}</strong> of{' '}
            <strong>{patients.length}</strong> registered patients
          </span>
          {(searchTerm || departmentFilter !== 'all' || statusFilter !== 'all' || triageFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('all');
                setStatusFilter('all');
                setTriageFilter('all');
              }}
              className="text-emerald-700 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">No patient records found matching your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try searching a different name, NRC, or clearing filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Patient Name & ID</th>
                  <th className="py-3 px-3 font-semibold">Zambian NRC</th>
                  <th className="py-3 px-3 font-semibold">Age / Sex</th>
                  <th className="py-3 px-3 font-semibold">Scheme</th>
                  <th className="py-3 px-3 font-semibold">Department & Ward</th>
                  <th className="py-3 px-3 font-semibold">Triage Acuity</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => {
                  const dept = departments.find((d) => d.id === patient.currentDepartmentId);
                  const isRed = patient.triageLevel === 'Emergency';
                  const isOrange = patient.triageLevel === 'Priority';

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => onSelectPatient(patient)}
                    >
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700">
                          {patient.fullName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {patient.id}
                        </div>
                      </td>

                      {/* NRC */}
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">
                        {patient.nrcNumber}
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3 px-3 text-slate-600">
                        {patient.age} yrs · {patient.gender}
                      </td>

                      {/* Insurance Scheme */}
                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-medium">
                          {patient.insuranceScheme}
                        </span>
                        {patient.nhimaNumber && (
                          <div className="text-[10px] text-teal-700 font-mono">
                            {patient.nhimaNumber}
                          </div>
                        )}
                      </td>

                      {/* Department & Ward */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 truncate max-w-[150px]">
                          {dept?.name || 'Department'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {patient.bedNumber ? `Bed: ${patient.bedNumber}` : 'OPD / Triage'}
                        </div>
                      </td>

                      {/* Triage */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isRed
                              ? 'bg-rose-100 text-rose-800'
                              : isOrange
                              ? 'bg-amber-100 text-amber-800'
                              : patient.triageLevel === 'Urgent'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {patient.triageLevel}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            patient.status === 'Admitted'
                              ? 'bg-blue-50 text-blue-700'
                              : patient.status === 'Discharged'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectPatient(patient)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Open Electronic Health Record"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenReportModal(patient)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Generate Summary / Claim"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
