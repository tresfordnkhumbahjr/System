/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { StaffView } from './components/StaffView';
import { DepartmentsView } from './components/DepartmentsView';
import { BedsView } from './components/BedsView';
import { PharmacyView } from './components/PharmacyView';
import { LaboratoryView } from './components/LaboratoryView';
import { RegisterPatientModal } from './components/RegisterPatientModal';
import { RegisterStaffModal } from './components/RegisterStaffModal';
import { PatientDetailModal } from './components/PatientDetailModal';
import { MedicalReportModal } from './components/MedicalReportModal';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import {
  INITIAL_PATIENTS,
  INITIAL_STAFF,
  INITIAL_DEPARTMENTS,
  INITIAL_BEDS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_ORDERS,
} from './data/mockData';
import { Patient, Staff, Department, Bed, Prescription, LabOrder } from './types/hospital';

export default function App() {
  // Persistent State with Fallbacks
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('nth_patients_data');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [staffList, setStaffList] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem('nth_staff_data');
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem('nth_departments_data');
      return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    try {
      const saved = localStorage.getItem('nth_beds_data');
      return saved ? JSON.parse(saved) : INITIAL_BEDS;
    } catch {
      return INITIAL_BEDS;
    }
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem('nth_prescriptions_data');
      return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  const [labOrders, setLabOrders] = useState<LabOrder[]>(() => {
    try {
      const saved = localStorage.getItem('nth_lab_data');
      return saved ? JSON.parse(saved) : INITIAL_LAB_ORDERS;
    } catch {
      return INITIAL_LAB_ORDERS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nth_patients_data', JSON.stringify(patients));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('nth_staff_data', JSON.stringify(staffList));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [staffList]);

  useEffect(() => {
    try {
      localStorage.setItem('nth_beds_data', JSON.stringify(beds));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [beds]);

  useEffect(() => {
    try {
      localStorage.setItem('nth_prescriptions_data', JSON.stringify(prescriptions));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [prescriptions]);

  useEffect(() => {
    try {
      localStorage.setItem('nth_lab_data', JSON.stringify(labOrders));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [labOrders]);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isRegisterPatientOpen, setIsRegisterPatientOpen] = useState(false);
  const [isRegisterStaffOpen, setIsRegisterStaffOpen] = useState(false);
  const [reportPatient, setReportPatient] = useState<Patient | null>(null);

  // Global search trigger
  const handleGlobalSearch = (query: string) => {
    setGlobalSearch(query);
    if (query.trim() && activeTab !== 'patients') {
      setActiveTab('patients');
    }
  };

  // Register New Patient Handler
  const handlePatientRegistered = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);

    // If admitted to a bed, update bed status if bed allocated
    if (newPatient.bedNumber) {
      setBeds((prev) =>
        prev.map((b) =>
          b.bedNumber === newPatient.bedNumber
            ? {
                ...b,
                status: 'Occupied',
                patientId: newPatient.id,
                patientName: newPatient.fullName,
                admittedDate: newPatient.registeredDate.split(' ')[0],
              }
            : b
        )
      );
    }

    // Update department counts
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === newPatient.currentDepartmentId
          ? {
              ...d,
              occupiedBeds: newPatient.status === 'Admitted' ? d.occupiedBeds + 1 : d.occupiedBeds,
              activePatientCount: d.activePatientCount + 1,
            }
          : d
      )
    );
  };

  // Register New Staff Handler
  const handleStaffRegistered = (newStaff: Staff) => {
    setStaffList((prev) => [newStaff, ...prev]);
    // Update department on-duty staff count if onDuty
    if (newStaff.onDuty) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === newStaff.departmentId
            ? { ...d, onDutyStaffCount: d.onDutyStaffCount + 1 }
            : d
        )
      );
    }
  };

  // Toggle Staff Duty
  const handleToggleStaffDuty = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const nextState = !s.onDuty;
          // Update department count
          setDepartments((depts) =>
            depts.map((d) =>
              d.id === s.departmentId
                ? {
                    ...d,
                    onDutyStaffCount: Math.max(
                      0,
                      d.onDutyStaffCount + (nextState ? 1 : -1)
                    ),
                  }
                : d
            )
          );
          return { ...s, onDuty: nextState };
        }
        return s;
      })
    );
  };

  // Update Patient Record
  const handleUpdatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedPatient(updated);
  };

  // Update Bed Status
  const handleUpdateBedStatus = (bedId: string, status: Bed['status']) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status,
              patientId: status === 'Available' ? undefined : b.patientId,
              patientName: status === 'Available' ? undefined : b.patientName,
            }
          : b
      )
    );
  };

  // Dispense Medication
  const handleDispensePrescription = (prescriptionId: string, dispensedBy: string) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === prescriptionId
          ? {
              ...rx,
              dispensedAt: dateStr,
              dispensedBy,
              medications: rx.medications.map((m) => ({ ...m, status: 'Dispensed' })),
            }
          : rx
      )
    );
  };

  // Complete Lab Order
  const handleCompleteLabOrder = (
    orderId: string,
    resultData: { results: string; referenceRange: string; remarks: string }
  ) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    setLabOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'Completed',
              results: resultData.results,
              referenceRange: resultData.referenceRange,
              remarks: resultData.remarks,
              reportedBy: 'Mr. Clement Chileshe',
              reportedAt: dateStr,
            }
          : order
      )
    );
  };

  const activeEmergenciesCount = patients.filter(
    (p) => p.status !== 'Discharged' && p.triageLevel === 'Emergency'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-200">
      {/* Top Navigation */}
      <Navbar
        onOpenRegisterPatient={() => setIsRegisterPatientOpen(true)}
        onOpenRegisterStaff={() => setIsRegisterStaffOpen(true)}
        onSearchGlobal={handleGlobalSearch}
        activeEmergenciesCount={activeEmergenciesCount}
        onNavigateToEmergencies={() => {
          setActiveTab('patients');
        }}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          counts={{
            patients: patients.length,
            staff: staffList.length,
            departments: departments.length,
            bedsOccupied: beds.filter((b) => b.status === 'Occupied').length,
            prescriptions: prescriptions.length,
            labOrders: labOrders.length,
          }}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-6 md:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              staff={staffList}
              departments={departments}
              onSelectPatient={(p) => setSelectedPatient(p)}
              onOpenRegisterPatient={() => setIsRegisterPatientOpen(true)}
              onOpenRegisterStaff={() => setIsRegisterStaffOpen(true)}
              onNavigateToTab={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === 'analytics' && (
            <DashboardAnalytics
              patients={patients}
              departments={departments}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              departments={departments}
              onSelectPatient={(p) => setSelectedPatient(p)}
              onOpenRegisterModal={() => setIsRegisterPatientOpen(true)}
              onOpenReportModal={(p) => setReportPatient(p)}
              initialSearch={globalSearch}
            />
          )}

          {activeTab === 'staff' && (
            <StaffView
              staffList={staffList}
              departments={departments}
              onOpenRegisterModal={() => setIsRegisterStaffOpen(true)}
              onToggleDuty={handleToggleStaffDuty}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentsView
              departments={departments}
              patients={patients}
              staffList={staffList}
              onSelectPatient={(p) => setSelectedPatient(p)}
            />
          )}

          {activeTab === 'beds' && (
            <BedsView
              beds={beds}
              patients={patients}
              departments={departments}
              onSelectPatient={(p) => setSelectedPatient(p)}
              onUpdateBedStatus={handleUpdateBedStatus}
            />
          )}

          {activeTab === 'pharmacy' && (
            <PharmacyView
              prescriptions={prescriptions}
              patients={patients}
              onDispensePrescription={handleDispensePrescription}
              onSelectPatient={(p) => setSelectedPatient(p)}
            />
          )}

          {activeTab === 'laboratory' && (
            <LaboratoryView
              labOrders={labOrders}
              patients={patients}
              onCompleteLabOrder={handleCompleteLabOrder}
              onSelectPatient={(p) => setSelectedPatient(p)}
            />
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Medical Discharge Summaries & NHIMA Claims
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Generate official Ministry of Health documents, insurance claim forms, and patient discharge papers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{p.fullName}</h3>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {p.id} · NRC: {p.nrcNumber}
                        </div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                        {p.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 my-3">
                      <div>
                        Scheme: <strong className="text-teal-700">{p.insuranceScheme}</strong>
                      </div>
                      <div className="truncate mt-1">
                        Diagnosis: {p.primaryDiagnosis || p.chiefComplaint}
                      </div>
                    </div>

                    <button
                      onClick={() => setReportPatient(p)}
                      className="w-full py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors text-center"
                    >
                      Generate Official Clinical Summary &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <RegisterPatientModal
        isOpen={isRegisterPatientOpen}
        onClose={() => setIsRegisterPatientOpen(false)}
        departments={departments}
        existingPatientCount={patients.length}
        onPatientRegistered={handlePatientRegistered}
      />

      <RegisterStaffModal
        isOpen={isRegisterStaffOpen}
        onClose={() => setIsRegisterStaffOpen(false)}
        departments={departments}
        existingStaffCount={staffList.length}
        onStaffRegistered={handleStaffRegistered}
      />

      <PatientDetailModal
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        departments={departments}
        beds={beds}
        onUpdatePatient={handleUpdatePatient}
        onOpenReportModal={(p) => setReportPatient(p)}
      />

      <MedicalReportModal
        patient={reportPatient}
        isOpen={!!reportPatient}
        onClose={() => setReportPatient(null)}
        departments={departments}
      />
    </div>
  );
}
