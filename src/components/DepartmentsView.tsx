import React, { useState } from 'react';
import {
  Building2,
  Users,
  BedDouble,
  UserCheck,
  MapPin,
  ChevronRight,
  Shield,
  Stethoscope,
  X,
} from 'lucide-react';
import { Department, Patient, Staff } from '../types/hospital';

interface DepartmentsViewProps {
  departments: Department[];
  patients: Patient[];
  staffList: Staff[];
  onSelectPatient: (patient: Patient) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  departments,
  patients,
  staffList,
  onSelectPatient,
}) => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const deptPatients = selectedDept
    ? patients.filter((p) => p.currentDepartmentId === selectedDept.id && p.status !== 'Discharged')
    : [];

  const deptStaff = selectedDept
    ? staffList.filter((s) => s.departmentId === selectedDept.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hospital Departments & Clinical Units
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Structural clinical departments, specialized wards, intensive care units, and diagnostic services at Ndola Teaching Hospital.
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
          <strong>11 Departments</strong> · 265 Total Bed Capacity
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const activeAdmitted = patients.filter(
            (p) => p.currentDepartmentId === dept.id && p.status !== 'Discharged'
          ).length;
          const assignedStaffCount = staffList.filter((s) => s.departmentId === dept.id).length;
          const occupancyRate =
            dept.totalBeds > 0 ? Math.round((dept.occupiedBeds / dept.totalBeds) * 100) : 0;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-sm"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {dept.code}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {dept.type}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      dept.type === 'Clinical' || dept.type === 'Inpatient'
                        ? 'bg-blue-50 text-blue-700'
                        : dept.type === 'Diagnostic'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {dept.type}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{dept.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {dept.description}
                </p>

                {/* HOD & Location */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      <strong>HOD:</strong> {dept.headOfDepartment}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{dept.location}</span>
                  </div>
                </div>

                {/* Wards list if any */}
                {dept.wards && dept.wards.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[11px] font-medium text-slate-500 mb-1">
                      Wards & Suites:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dept.wards.map((w, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom stats and action */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                {dept.totalBeds > 0 ? (
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                      <span>Bed Capacity</span>
                      <span className="font-semibold text-slate-900">
                        {dept.occupiedBeds} / {dept.totalBeds} beds ({occupancyRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancyRate > 80
                            ? 'bg-rose-500'
                            : occupancyRate > 60
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, occupancyRate)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic">
                    Diagnostic / Support Services (No overnight beds)
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <strong>{activeAdmitted}</strong> patients
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <strong>{assignedStaffCount}</strong> staff
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedDept(dept)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Detail Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                    {selectedDept.code}
                  </span>
                  <span className="text-xs text-slate-400">{selectedDept.type} Department</span>
                </div>
                <h2 className="text-xl font-bold">{selectedDept.name}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  HOD: {selectedDept.headOfDepartment} · {selectedDept.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Admitted Patients in Department */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Currently Admitted Inpatients ({deptPatients.length})
                </h3>
                {deptPatients.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                    No active inpatients currently assigned to this department.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {deptPatients.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => {
                          setSelectedDept(null);
                          onSelectPatient(patient);
                        }}
                        className="p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {patient.fullName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {patient.id} · NRC: {patient.nrcNumber} · Bed: {patient.bedNumber || 'Triage'}
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded font-semibold ${
                            patient.triageLevel === 'Emergency'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {patient.triageLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Healthcare Staff */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Department Staff ({deptStaff.length})
                </h3>
                {deptStaff.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                    No staff currently assigned directly to this department.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {deptStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            {staff.fullName}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              staff.onDuty ? 'bg-emerald-600' : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <div className="text-xs text-emerald-700 font-medium">
                          {staff.cadre}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">
                          {staff.licenseNumber} · {staff.phoneNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedDept(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
