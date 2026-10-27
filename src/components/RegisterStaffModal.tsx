import React, { useState } from 'react';
import { X, UserCheck, AlertCircle, Building2, ShieldCheck } from 'lucide-react';
import { Staff, StaffCadre, Department } from '../types/hospital';
import { generateStaffId, formatZambianPhone } from '../utils/hospitalLogic';

interface RegisterStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  existingStaffCount: number;
  onStaffRegistered: (staff: Staff) => void;
}

export const RegisterStaffModal: React.FC<RegisterStaffModalProps> = ({
  isOpen,
  onClose,
  departments,
  existingStaffCount,
  onStaffRegistered,
}) => {
  const [fullName, setFullName] = useState('');
  const [cadre, setCadre] = useState<StaffCadre>('Medical Officer');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dep-emerg');
  const [qualification, setQualification] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('0977');
  const [email, setEmail] = useState('');
  const [shift, setShift] = useState<Staff['shift']>('Morning (07:00 - 15:00)');
  const [onDuty, setOnDuty] = useState(true);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Staff member full name is required');
      return;
    }

    if (!qualification.trim()) {
      setFormError('Academic qualification / medical degree is required');
      return;
    }

    if (!licenseNumber.trim()) {
      setFormError('Professional council license number (HPCZ or GNCZ) is required');
      return;
    }

    const dept = departments.find((d) => d.id === departmentId);
    const staffId = generateStaffId(
      cadre.includes('Surgeon') || cadre.includes('Physician') || cadre.includes('Officer') ? 'MD' : 'STF',
      existingStaffCount
    );

    const now = new Date();
    const joinDate = now.toISOString().split('T')[0];

    const cleanEmail = email.trim() || `${fullName.toLowerCase().replace(/[^a-z]/g, '.')}@nth.gov.zm`;

    const newStaff: Staff = {
      id: staffId,
      fullName: fullName.trim(),
      cadre,
      departmentId,
      departmentName: dept?.name || 'Ndola Teaching Hospital',
      qualification: qualification.trim(),
      licenseNumber: licenseNumber.trim().toUpperCase(),
      phoneNumber: formatZambianPhone(phoneNumber),
      email: cleanEmail,
      onDuty,
      shift,
      joinDate,
    };

    onStaffRegistered(newStaff);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Register Healthcare Staff
              </h2>
              <p className="text-xs text-slate-400">
                Ndola Teaching Hospital Medical Personnel & Council Credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name & Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Mwila Chileshe or Sister Bupe Banda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Clinical Cadre / Professional Role *
              </label>
              <select
                value={cadre}
                onChange={(e) => setCadre(e.target.value as StaffCadre)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Consultant Physician">Consultant Physician</option>
                <option value="Consultant Surgeon">Consultant Surgeon</option>
                <option value="Medical Officer">Medical Officer (Doctor)</option>
                <option value="Registrar">Registrar</option>
                <option value="Clinical Officer">Clinical Officer</option>
                <option value="Senior Nursing Officer">Senior Nursing Officer</option>
                <option value="Registered Nurse">Registered Nurse</option>
                <option value="Chief Pharmacist">Chief Pharmacist</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Senior Lab Scientist">Senior Lab Scientist</option>
                <option value="Laboratory Technologist">Laboratory Technologist</option>
                <option value="Radiographer">Radiographer</option>
                <option value="Administrative Officer">Administrative Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Assigned Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                License / Council Registration (HPCZ / GNCZ) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HPCZ-MD-4091 or GNCZ-RN-2810"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full text-sm font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Academic Qualifications & Degrees *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MBChB (UNZA), MMed Surgery, FCS (ECSA)"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Contact (Zambia)
              </label>
              <input
                type="text"
                placeholder="0977 123456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Official NTH Email Address
              </label>
              <input
                type="email"
                placeholder="name@nth.gov.zm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Active Shift Schedule
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Morning (07:00 - 15:00)">Morning (07:00 - 15:00)</option>
                <option value="Afternoon (14:30 - 22:30)">Afternoon (14:30 - 22:30)</option>
                <option value="Night (22:00 - 07:30)">Night (22:00 - 07:30)</option>
                <option value="On-Call">On-Call (24hr Emergency Coverage)</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onDuty}
                  onChange={(e) => setOnDuty(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  Currently On Duty (Show on Active Roster)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Register & Add to Staff Directory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
