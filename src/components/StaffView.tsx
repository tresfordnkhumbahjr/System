import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Staff, Department } from '../types/hospital';
import { filterStaff } from '../utils/hospitalLogic';

interface StaffViewProps {
  staffList: Staff[];
  departments: Department[];
  onOpenRegisterModal: () => void;
  onToggleDuty: (staffId: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffList,
  departments,
  onOpenRegisterModal,
  onToggleDuty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [cadreFilter, setCadreFilter] = useState('all');
  const [onDutyOnly, setOnDutyOnly] = useState(false);

  const filteredStaff = filterStaff(staffList, {
    search: searchTerm,
    departmentId: deptFilter,
    cadre: cadreFilter,
    onDutyOnly,
  });

  const onDutyCount = staffList.filter((s) => s.onDuty).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Healthcare Personnel & Staff Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Registered doctors, surgeons, nursing officers, pharmacists and allied health workers at Ndola Teaching Hospital.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Healthcare Staff</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search staff by name, staff ID, license number (HPCZ/GNCZ)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={cadreFilter}
            onChange={(e) => setCadreFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Cadres / Roles</option>
            <option value="Consultant Physician">Consultant Physician</option>
            <option value="Consultant Surgeon">Consultant Surgeon</option>
            <option value="Medical Officer">Medical Officer</option>
            <option value="Senior Nursing Officer">Senior Nursing Officer</option>
            <option value="Registered Nurse">Registered Nurse</option>
            <option value="Chief Pharmacist">Chief Pharmacist</option>
            <option value="Senior Lab Scientist">Senior Lab Scientist</option>
            <option value="Radiographer">Radiographer</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 px-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onDutyOnly}
              onChange={(e) => setOnDutyOnly(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span>On-Duty Only ({onDutyCount})</span>
          </label>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{filteredStaff.length}</strong> of <strong>{staffList.length}</strong> medical staff
          </span>
          {(searchTerm || deptFilter !== 'all' || cadreFilter !== 'all' || onDutyOnly) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDeptFilter('all');
                setCadreFilter('all');
                setOnDutyOnly(false);
              }}
              className="text-emerald-700 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              {/* Header card with ID and status */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{staff.fullName}</h3>
                  <div className="text-xs font-medium text-emerald-700 mt-0.5">
                    {staff.cadre}
                  </div>
                </div>
                <button
                  onClick={() => onToggleDuty(staff.id)}
                  title="Click to toggle on-duty status"
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-colors ${
                    staff.onDuty
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      staff.onDuty ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span>{staff.onDuty ? 'On Duty' : 'Off Duty'}</span>
                </button>
              </div>

              {/* Department & Qualifications */}
              <div className="space-y-1.5 text-xs text-slate-600 my-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Department:</span>
                  <span className="font-semibold text-slate-800">{staff.departmentName}</span>
                </div>
                <div className="text-slate-500 text-[11px] leading-relaxed">
                  {staff.qualification}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>License: {staff.licenseNumber}</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Shift and Contacts */}
            <div className="pt-3 border-t border-slate-100 mt-2 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Shift:</span>
                <span className="font-medium text-slate-700">{staff.shift}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{staff.phoneNumber}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {staff.id}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
