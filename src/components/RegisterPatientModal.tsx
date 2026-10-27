import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, HeartPulse, ShieldCheck } from 'lucide-react';
import { Patient, Department, Gender, TriageLevel } from '../types/hospital';
import {
  generatePatientId,
  formatZambianNRC,
  formatZambianPhone,
  calculateTriageLevel,
} from '../utils/hospitalLogic';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  existingPatientCount: number;
  onPatientRegistered: (patient: Patient) => void;
}

export const RegisterPatientModal: React.FC<RegisterPatientModalProps> = ({
  isOpen,
  onClose,
  departments,
  existingPatientCount,
  onPatientRegistered,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [nrcNumber, setNrcNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1995-05-15');
  const [gender, setGender] = useState<Gender>('Male');
  const [phoneNumber, setPhoneNumber] = useState('0977');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [nextOfKinName, setNextOfKinName] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('097');
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState('Spouse');
  const [bloodGroup, setBloodGroup] = useState<Patient['bloodGroup']>('O+');
  const [allergiesText, setAllergiesText] = useState('None known');
  const [insuranceScheme, setInsuranceScheme] = useState<Patient['insuranceScheme']>('NHIMA');
  const [nhimaNumber, setNhimaNumber] = useState('');
  const [currentDepartmentId, setCurrentDepartmentId] = useState('dep-emerg');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [status, setStatus] = useState<Patient['status']>('Admitted');

  // Vitals
  const [systolicBP, setSystolicBP] = useState<number>(120);
  const [diastolicBP, setDiastolicBP] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(75);
  const [temperature, setTemperature] = useState<number>(36.8);
  const [spo2, setSpo2] = useState<number>(98);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(18);

  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  // Compute live triage preview
  const triageAssessment = calculateTriageLevel({
    systolicBP,
    diastolicBP,
    heartRate,
    temperature,
    spo2,
    respiratoryRate,
  });

  // Calculate approximate age
  const calculateAge = (dob: string): number => {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - birthYear);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Patient full name is required');
      return;
    }

    if (!nrcNumber.trim()) {
      setFormError('Zambian National Registration Card (NRC) or ID number is required');
      return;
    }

    if (!chiefComplaint.trim()) {
      setFormError('Please enter the chief clinical complaint or reason for presentation');
      return;
    }

    const patientId = generatePatientId(existingPatientCount, 2026);
    const age = calculateAge(dateOfBirth);
    const formattedNRC = formatZambianNRC(nrcNumber);
    const formattedPhone = formatZambianPhone(phoneNumber);
    const formattedKinPhone = formatZambianPhone(nextOfKinPhone);

    const allergies = allergiesText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const now = new Date();
    const registeredDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newPatient: Patient = {
      id: patientId,
      fullName: fullName.trim(),
      nrcNumber: formattedNRC,
      dateOfBirth,
      age,
      gender,
      phoneNumber: formattedPhone,
      residentialAddress: residentialAddress.trim() || 'Ndola Urban',
      nextOfKinName: nextOfKinName.trim() || 'Not specified',
      nextOfKinPhone: formattedKinPhone,
      nextOfKinRelationship,
      bloodGroup,
      allergies: allergies.length > 0 ? allergies : ['None reported'],
      insuranceScheme,
      nhimaNumber: insuranceScheme === 'NHIMA' ? nhimaNumber.trim() || `NHIMA-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      registeredDate,
      status,
      currentDepartmentId,
      triageLevel: triageAssessment.level,
      chiefComplaint: chiefComplaint.trim(),
      vitalsHistory: [
        {
          systolicBP,
          diastolicBP,
          heartRate,
          temperature,
          spo2,
          respiratoryRate,
          recordedAt: registeredDate,
          recordedBy: 'Intake Triage Nurse',
        },
      ],
      clinicalNotes: [
        {
          id: `note-${Date.now()}`,
          date: registeredDate,
          author: 'Intake Clinical Officer',
          authorRole: 'Admissions Officer',
          category: 'Admission',
          note: `Patient registered at NTH Admissions Desk. Chief complaint: "${chiefComplaint}". Triage evaluated as ${triageAssessment.level} priority. Allocated to ${departments.find(d => d.id === currentDepartmentId)?.name || 'General Unit'}.`,
        },
      ],
    };

    onPatientRegistered(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Register New Patient
              </h2>
              <p className="text-xs text-slate-400">
                Ndola Teaching Hospital Electronic Health Records (EHR) Intake
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Demographics */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              1. Patient Demographics & Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mwamba Mulenga"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  National Registration Card (NRC) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="294812/11/1"
                  value={nrcNumber}
                  onChange={(e) => setNrcNumber(e.target.value)}
                  onBlur={(e) => setNrcNumber(formatZambianNRC(e.target.value))}
                  className="w-full text-sm font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Patient Phone Number
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
                  Residential Address (Ndola Area)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kansenshi / Ndeke / Mushili"
                  value={residentialAddress}
                  onChange={(e) => setResidentialAddress(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Next of Kin & Medical Background */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              2. Next of Kin & Medical Background
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Next of Kin Name
                </label>
                <input
                  type="text"
                  placeholder="Mary Mulenga"
                  value={nextOfKinName}
                  onChange={(e) => setNextOfKinName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Next of Kin Relationship
                </label>
                <select
                  value={nextOfKinRelationship}
                  onChange={(e) => setNextOfKinRelationship(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Next of Kin Phone
                </label>
                <input
                  type="text"
                  placeholder="0977 654321"
                  value={nextOfKinPhone}
                  onChange={(e) => setNextOfKinPhone(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as any)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Insurance / Scheme
                </label>
                <select
                  value={insuranceScheme}
                  onChange={(e) => setInsuranceScheme(e.target.value as any)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="NHIMA">NHIMA (National Health Insurance)</option>
                  <option value="MoH Standard">MoH Standard (Universal Care)</option>
                  <option value="Private Insurance">Private Corporate Insurance</option>
                  <option value="Self Pay">Self Pay / Cash</option>
                </select>
              </div>

              {insuranceScheme === 'NHIMA' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    NHIMA Card / Member Number
                  </label>
                  <input
                    type="text"
                    placeholder="NHIMA-8812-4412"
                    value={nhimaNumber}
                    onChange={(e) => setNhimaNumber(e.target.value)}
                    className="w-full text-sm font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Known Drug Allergies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Aspirin, Sulphonamides or None"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Clinical Intake & Vitals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                3. Clinical Intake & Initial Triage Vitals
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Calculated Triage:</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                    triageAssessment.level === 'Emergency'
                      ? 'bg-rose-600 text-white'
                      : triageAssessment.level === 'Priority'
                      ? 'bg-amber-500 text-white'
                      : triageAssessment.level === 'Urgent'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {triageAssessment.level}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Systolic BP
                </label>
                <input
                  type="number"
                  value={systolicBP}
                  onChange={(e) => setSystolicBP(Number(e.target.value))}
                  className="w-full text-sm px-2 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Diastolic BP
                </label>
                <input
                  type="number"
                  value={diastolicBP}
                  onChange={(e) => setDiastolicBP(Number(e.target.value))}
                  className="w-full text-sm px-2 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full text-sm px-2 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full text-sm px-2 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full text-sm px-2 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Resp Rate (/min)
                </label>
                <input
                  type="number"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                  className="w-full text-sm px-2 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Chief Complaint / Reason for Presentation *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Severe chest pain for 2 hours, shortness of breath, sudden collapse..."
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department Assignment
                  </label>
                  <select
                    value={currentDepartmentId}
                    onChange={(e) => setCurrentDepartmentId(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Initial Admission Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Admitted">Admitted (Inpatient Ward)</option>
                    <option value="In Observation">In Observation (Casualty Bay)</option>
                    <option value="Outpatient">Outpatient (OPD Clinic Consultation)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
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
              Complete Registration & Admit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
