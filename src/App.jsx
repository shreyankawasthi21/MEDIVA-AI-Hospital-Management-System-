import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  Stethoscope, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Building2, 
  Phone, 
  Mail, 
  HeartPulse,
  Pill,
  AlertTriangle,
  Package,
  FileText,
  Send,
  Check,
  ShieldAlert,
  RotateCcw,
  X,
  ArrowRight,
  ShieldCheck,
  LogOut
} from 'lucide-react';

const INITIAL_DOCTORS = [
  { 
    id: 1, 
    name: 'Dr. Shourya Soni', 
    spec: 'Chief Cardiologist', 
    dept: 'Cardiology', 
    email: 'shourya.soni@mediva.care', 
    phone: '+91 7470301106' 
  },
  { 
    id: 2, 
    name: 'Dr. Sarvesh Garg', 
    spec: 'Consultant Dentist', 
    dept: 'Dentist', 
    email: 'sarvesh.garg@mediva.care', 
    phone: '+91 9179676499' 
  },
  { 
    id: 3, 
    name: 'Dr. Aryan Saxena', 
    spec: 'Senior Neurologist', 
    dept: 'Neurology', 
    email: 'aryan.saxena@mediva.care', 
    phone: '+91 98765 43210' 
  }
];

const INITIAL_PATIENTS = [
  { 
    id: 'p1', 
    name: 'Shreyank Awasthi', 
    dob: '2006-12-01', 
    gender: 'Male', 
    blood: 'B+', 
    contact: '+91 98765 00001',
    allergies: 'Penicillin (Mild)',
    vitals: { bp: '120/80', pulse: '72 bpm', weight: '68 kg' },
    prescriptions: [
      {
        id: 'rx-101',
        medName: 'Atorvastatin 20mg',
        dosage: '1 Tab at bedtime',
        duration: '30 Days',
        qty: 30,
        doctor: 'Dr. Shourya Soni',
        date: '2026-09-28',
        status: 'Sent to Patient Portal'
      }
    ]
  },
  { 
    id: 'p2', 
    name: 'Aarav Sharma', 
    dob: '1995-04-12', 
    gender: 'Male', 
    blood: 'O+', 
    contact: '+91 91234 56789',
    allergies: 'None recorded',
    vitals: { bp: '118/76', pulse: '68 bpm', weight: '74 kg' },
    prescriptions: []
  },
  { 
    id: 'p3', 
    name: 'Priya Patel', 
    dob: '2001-09-21', 
    gender: 'Female', 
    blood: 'B+', 
    contact: '+91 92345 67890',
    allergies: 'Sulfa Drugs',
    vitals: { bp: '110/70', pulse: '75 bpm', weight: '54 kg' },
    prescriptions: []
  }
];

const INITIAL_APPOINTMENTS = [
  { id: 'a1', patient: 'Shreyank Awasthi', doctor: 'Dr. Shourya Soni', dept: 'Cardiology', date: '2026-10-01', time: '10:00 AM', status: 'Scheduled' },
  { id: 'a2', patient: 'Aarav Sharma', doctor: 'Dr. Sarvesh Garg', dept: 'Dentist', date: '2026-10-01', time: '11:30 AM', status: 'Scheduled' }
];

const INITIAL_MEDICINES = [
  { id: 'm1', name: 'Amoxicillin 500mg', batch: 'BX-2024-91', category: 'Antibiotic', stock: 120, unit: 'Capsules', expiry: '2027-04-15' },
  { id: 'm2', name: 'Atorvastatin 20mg', batch: 'AT-8812', category: 'Cardiology', stock: 24, unit: 'Tablets', expiry: '2026-10-18' },
  { id: 'm3', name: 'Paracetamol IV 100ml', batch: 'PC-4041', category: 'Analgesic', stock: 45, unit: 'Vials', expiry: '2026-08-30' },
  { id: 'm4', name: 'Metformin 500mg', batch: 'MF-1092', category: 'Diabetic Care', stock: 210, unit: 'Tablets', expiry: '2027-11-01' },
  { id: 'm5', name: 'Lidocaine 2% Injection', batch: 'LC-7731', category: 'Dental Anesthetic', stock: 11, unit: 'Ampoules', expiry: '2026-10-08' },
];

// Helper: Generate 10-minute interval slots from 09:00 AM to 05:00 PM
const generate10MinSlots = () => {
  const slots = [];
  const startHour = 9;  // 9 AM
  const endHour = 17;   // 5 PM
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (h === endHour && m > 0) break; // Stop at 05:00 PM
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hourStr = hour12 < 10 ? `0${hour12}` : `${hour12}`;
      const minStr = m < 10 ? `0${m}` : `${m}`;
      slots.push(`${hourStr}:${minStr} ${ampm}`);
    }
  }
  return slots;
};

// Helper: Ascending sort by expiry date
const sortMedsByAscendingExpiry = (list) => {
  return [...list].sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
};

export default function App() {
  // Navigation & Screen Gate States
  const [hasEntered, setHasEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const allTimeSlots = useMemo(() => generate10MinSlots(), []);

  // Persistent States
  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('mediva_live_doctors_v5');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('mediva_live_patients_v6');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('mediva_live_appointments_v6');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('mediva_live_medicines_v6');
    const data = saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    return sortMedsByAscendingExpiry(data);
  });

  useEffect(() => {
    localStorage.setItem('mediva_live_doctors_v5', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('mediva_live_patients_v6', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('mediva_live_appointments_v6', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('mediva_live_medicines_v6', JSON.stringify(medicines));
  }, [medicines]);

  // Modal States
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  
  // EHR Dossier State
  const [activeEhrPatient, setActiveEhrPatient] = useState(null);
  const [dispatchAlert, setDispatchAlert] = useState('');
  const [medToast, setMedToast] = useState('');

  // Prescription Form States
  const [prescribeMed, setPrescribeMed] = useState('');
  const [prescribeDosage, setPrescribeDosage] = useState('');
  const [prescribeDuration, setPrescribeDuration] = useState('');
  const [prescribeQty, setPrescribeQty] = useState('10');
  const [prescribeDoctor, setPrescribeDoctor] = useState('Dr. Shourya Soni');

  // Appointment Form States
  const [patientName, setPatientName] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [aptTime, setAptTime] = useState('');
  const [reason, setReason] = useState('');

  // Doctor Form States
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docDept, setDocDept] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPhone, setDocPhone] = useState('');

  // Patient Form States
  const [newPtName, setNewPtName] = useState('');
  const [newPtDob, setNewPtDob] = useState('');
  const [newPtGender, setNewPtGender] = useState('Male');
  const [newPtBlood, setNewPtBlood] = useState('O+');
  const [newPtContact, setNewPtContact] = useState('');

  // Medicine Form States
  const [medMode, setMedMode] = useState('existing'); // 'existing' | 'new'
  const [medName, setMedName] = useState('');
  const [medBatch, setMedBatch] = useState('');
  const [medCategory, setMedCategory] = useState('');
  const [medStock, setMedStock] = useState('');
  const [medUnit, setMedUnit] = useState('Tablets');
  const [medExpiry, setMedExpiry] = useState('');

  // Extract unique medicine names for catalog selection
  const uniqueMedNames = useMemo(() => {
    return Array.from(new Set(medicines.map(m => m.name.trim())));
  }, [medicines]);

  // Pre-fill category & unit when selecting an existing drug
  const handleSelectExistingMed = (selectedName) => {
    setMedName(selectedName);
    const existing = medicines.find(m => m.name.trim().toLowerCase() === selectedName.trim().toLowerCase());
    if (existing) {
      setMedCategory(existing.category || '');
      setMedUnit(existing.unit || 'Tablets');
    }
  };

  // Calculate dynamically available 10-min slots for chosen doctor & date
  const availableSlots = useMemo(() => {
    if (!selectedDoc || !aptDate) return allTimeSlots;
    const bookedTimes = appointments
      .filter(a => a.doctor === selectedDoc && a.date === aptDate)
      .map(a => a.time);
    return allTimeSlots.filter(slot => !bookedTimes.includes(slot));
  }, [allTimeSlots, appointments, selectedDoc, aptDate]);

  // Toggle Appointment Status (Scheduled <-> Completed)
  const toggleAppointmentStatus = (id) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Completed' ? 'Scheduled' : 'Completed';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Expiry Calculation Helper
  const checkExpiryStatus = (expiryDateStr) => {
    const today = new Date();
    const exp = new Date(expiryDateStr);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'Expired', badge: 'bg-red-50 text-red-700 border-red-200', subtext: `Expired ${Math.abs(diffDays)}d ago` };
    }
    if (diffDays <= 30) {
      return { status: 'Expiring Soon', badge: 'bg-amber-50 text-amber-700 border-amber-200', subtext: `${diffDays} days remaining` };
    }
    return { status: 'In Stock', badge: 'bg-teal-50 text-teal-700 border-teal-200', subtext: 'Shelf Life Safe' };
  };

  const expiredCount = medicines.filter(m => checkExpiryStatus(m.expiry).status === 'Expired').length;
  const expiringSoonCount = medicines.filter(m => checkExpiryStatus(m.expiry).status === 'Expiring Soon').length;
  const lowStockCount = medicines.filter(m => Number(m.stock) <= 15).length;

  // Open EHR Record
  const handleOpenEHR = (patientIdentifier) => {
    const pt = typeof patientIdentifier === 'string'
      ? patients.find(p => p.name.trim().toLowerCase() === patientIdentifier.trim().toLowerCase())
      : patientIdentifier;

    if (pt) {
      setActiveEhrPatient(pt);
      setDispatchAlert('');
    }
  };

  // Dispatch Digital Prescription & Deduct Pharmacy Stock
  const handleSendPrescription = (e) => {
    e.preventDefault();
    if (!prescribeMed || !prescribeDosage || !activeEhrPatient) return;

    const qtyNumber = Number(prescribeQty) || 1;

    setMedicines(prevMeds => {
      const updated = prevMeds.map(m => {
        if (m.name.toLowerCase().includes(prescribeMed.toLowerCase()) || prescribeMed.toLowerCase().includes(m.name.toLowerCase())) {
          return { ...m, stock: Math.max(0, m.stock - qtyNumber) };
        }
        return m;
      });
      return sortMedsByAscendingExpiry(updated);
    });

    const newRx = {
      id: `rx-${Date.now()}`,
      medName: prescribeMed,
      dosage: prescribeDosage,
      duration: prescribeDuration || '5 Days',
      qty: qtyNumber,
      doctor: prescribeDoctor,
      date: todayDateStr,
      status: 'Sent via SMS & EHR Portal'
    };

    const updatedPatients = patients.map(p => {
      if (p.id === activeEhrPatient.id) {
        const updatedList = [newRx, ...(p.prescriptions || [])];
        const updatedPt = { ...p, prescriptions: updatedList };
        setActiveEhrPatient(updatedPt);
        return updatedPt;
      }
      return p;
    });

    setPatients(updatedPatients);
    setDispatchAlert(`Digital prescription dispatched to ${activeEhrPatient.contact}! Stock deducted.`);
    setPrescribeMed('');
    setPrescribeDosage('');
    setPrescribeDuration('');
    setPrescribeQty('10');

    setTimeout(() => setDispatchAlert(''), 4500);
  };

  // Appointment Booking
  const handleBook = (e) => {
    e.preventDefault();
    if (!patientName || !selectedDoc || !aptDate || !aptTime) return;

    const docObj = doctors.find(d => d.name === selectedDoc);
    const existing = patients.find(p => p.name.trim().toLowerCase() === patientName.trim().toLowerCase());
    
    if (!existing) {
      const newPt = {
        id: `p${Date.now()}`,
        name: patientName,
        dob: '2001-01-01',
        gender: 'Not Specified',
        blood: 'Unknown',
        contact: 'Self-Registered',
        allergies: 'None logged',
        vitals: { bp: '120/80', pulse: '72 bpm', weight: '70 kg' },
        prescriptions: []
      };
      setPatients(prev => [newPt, ...prev]);
    }

    const newAppointment = {
      id: `a${Date.now()}`,
      patient: patientName,
      doctor: selectedDoc,
      dept: docObj?.dept || 'General Consultation',
      date: aptDate,
      time: aptTime,
      status: 'Scheduled'
    };

    setAppointments([newAppointment, ...appointments]);
    setPatientName('');
    setSelectedDoc('');
    setAptDate('');
    setAptTime('');
    setReason('');
    setActiveTab('appointments');
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!docName || !docSpec || !docDept) return;

    const formattedName = docName.startsWith('Dr.') ? docName : `Dr. ${docName}`;
    const newDoc = {
      id: Date.now(),
      name: formattedName,
      spec: docSpec,
      dept: docDept,
      email: docEmail || `${docName.toLowerCase().replace(/[^a-z]/g, '')}@mediva.care`,
      phone: docPhone || '+91 98000 11122'
    };

    setDoctors([...doctors, newDoc]);
    setDocName('');
    setDocSpec('');
    setDocDept('');
    setDocEmail('');
    setDocPhone('');
    setShowDoctorModal(false);
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!newPtName) return;

    const newPt = {
      id: `p${Date.now()}`,
      name: newPtName,
      dob: newPtDob || '2000-01-01',
      gender: newPtGender,
      blood: newPtBlood,
      contact: newPtContact || '+91 90000 00000',
      allergies: 'None recorded',
      vitals: { bp: '120/80', pulse: '70 bpm', weight: '65 kg' },
      prescriptions: []
    };

    setPatients([newPt, ...patients]);
    setNewPtName('');
    setNewPtDob('');
    setNewPtContact('');
    setShowPatientModal(false);
  };

  // Medicine Addition: Aggregates matching expiry, creates new row for different expiry
  const handleAddMedicine = (e) => {
    e.preventDefault();
    const cleanName = medName.trim();
    if (!cleanName || !medExpiry) return;

    const qtyToAdd = Number(medStock) || 0;

    setMedicines(prevMeds => {
      // Check if an entry with the EXACT SAME NAME and EXACT SAME EXPIRY exists
      const existingBatchIndex = prevMeds.findIndex(
        m => m.name.trim().toLowerCase() === cleanName.toLowerCase() && m.expiry === medExpiry
      );

      let updatedList;
      if (existingBatchIndex !== -1) {
        // Same drug AND same expiry date -> Merge stock into that existing row
        updatedList = [...prevMeds];
        const existingItem = updatedList[existingBatchIndex];
        updatedList[existingBatchIndex] = {
          ...existingItem,
          stock: Number(existingItem.stock) + qtyToAdd,
          batch: medBatch.trim() ? medBatch.trim() : existingItem.batch,
          category: medCategory.trim() || existingItem.category,
          unit: medUnit || existingItem.unit
        };
        setMedToast(`Restocked "${cleanName}" (${medExpiry}): +${qtyToAdd} ${medUnit} added.`);
      } else {
        // Different expiry date OR brand new drug -> Create a new batch entry row
        const newMed = {
          id: `m${Date.now()}`,
          name: cleanName,
          batch: medBatch.trim() || `BX-${Math.floor(1000 + Math.random() * 9000)}`,
          category: medCategory.trim() || 'General Supply',
          stock: qtyToAdd,
          unit: medUnit,
          expiry: medExpiry
        };
        updatedList = [...prevMeds, newMed];
        setMedToast(`Created new batch for "${cleanName}" expiring ${medExpiry} (+${qtyToAdd} ${medUnit}).`);
      }

      // Maintain strictly ascending order of expiry dates
      return sortMedsByAscendingExpiry(updatedList);
    });

    setMedName('');
    setMedBatch('');
    setMedCategory('');
    setMedStock('');
    setMedExpiry('');
    setShowMedModal(false);

    setTimeout(() => setMedToast(''), 4500);
  };

  // -----------------------------------------------------------
  // 1. ENTRY / WELCOME LANDING SCREEN
  // -----------------------------------------------------------
  if (!hasEntered) {
    return (
      <div className="min-h-screen bg-[#070D18] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white select-none">
        {/* Ambient Medical Glow Backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-teal-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-xl animate-in fade-in zoom-in-95 duration-700">
          
          {/* Logo with Soft Cyan Radial Halo */}
          <div className="relative mb-8 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/30 to-teal-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-80"></div>
            <img 
              src="/logo.png" 
              alt="Mediva Emblem" 
              className="relative w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border border-sky-400/20 shadow-2xl shadow-sky-950"
            />
          </div>

          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational • EHR & Clinical Engine Live
          </div>

          {/* Typography: Modern Clinical Typography */}
          <h1 className="text-4xl md:text-6xl font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-400 mb-3 drop-shadow-sm font-sans uppercase">
            MEDIVA
          </h1>

          <p className="text-sm md:text-base font-medium tracking-[0.16em] text-slate-400 uppercase max-w-md mb-8">
            Hospital Management & Information System
          </p>

          {/* Feature Micro-Badges */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-10 text-slate-300 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xs">
              <span className="block font-bold text-sky-400">Offline-First</span>
              <span className="text-[10px] text-slate-400">Deterministic</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xs">
              <span className="block font-bold text-teal-400">EHR Core</span>
              <span className="text-[10px] text-slate-400">Vitals & Allergy</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xs">
              <span className="block font-bold text-sky-400">Pharmacy</span>
              <span className="text-[10px] text-slate-400">FIFO Expiry Sort</span>
            </div>
          </div>

          {/* CTA: Enter Portal */}
          <button
            onClick={() => setHasEntered(true)}
            className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0D9488] hover:from-[#0369A1] hover:to-[#0F766E] text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-600/25 transition-all duration-200 flex items-center gap-3 cursor-pointer"
          >
            Access Clinical Portal
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-[11px] text-slate-500 mt-8 tracking-wider">
            MEDIVA CLINICAL PLATFORM • SYSTEM RELEASE V1.0
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // 2. MAIN APPLICATION INTERFACE
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between p-5">
        <div>
          {/* Brand Header with Custom Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-xs scale-105 pointer-events-none"></div>
              <img 
                src="/logo.png" 
                alt="Mediva Logo" 
                className="relative h-11 w-11 rounded-full object-cover shadow-sm border border-slate-200" 
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">Mediva</h1>
              <p className="text-xs text-[#64748B] font-medium">Hospital Management</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Overview', icon: Activity },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'patients', label: 'Patients (EHR)', icon: Users },
              { id: 'doctors', label: 'Doctors', icon: Stethoscope },
              { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill },
              { id: 'book', label: 'Schedule Visit', icon: PlusCircle },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#0284C7] text-white shadow-sm' 
                      : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {item.id === 'pharmacy' && (expiredCount > 0 || expiringSoonCount > 0) && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-[#0284C7]' : 'bg-red-100 text-red-700'
                    }`}>
                      {expiredCount + expiringSoonCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs text-[#64748B]">
            <p className="font-semibold text-[#0F172A]">EHR & Cloud Engine</p>
            <p className="mt-1 flex items-center gap-1.5 text-teal-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span> Active & Synchronized
            </p>
          </div>

          {/* Return to Entry Screen Button */}
          <button 
            onClick={() => setHasEntered(false)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <LogOut className="w-3.5 h-3.5" /> Return to Welcome Screen
          </button>
        </div>
      </aside>

      {/* Main View */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-bold capitalize text-[#0F172A]">
              {activeTab === 'book' ? 'Schedule Consultation' : activeTab === 'pharmacy' ? 'Pharmacy & Drug Expiry Monitor' : activeTab}
            </h2>
            <p className="text-xs text-[#64748B]">Automated real-time inventory aggregation & 10-minute slot allocation</p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'pharmacy' ? (
              <button 
                onClick={() => setShowMedModal(true)}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Manage Medication
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setShowDoctorModal(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-lg border border-[#E2E8F0] transition-all"
                >
                  + Add Doctor
                </button>
                <button 
                  onClick={() => setActiveTab('book')}
                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
                >
                  + New Appointment
                </button>
              </>
            )}
          </div>
        </header>

        {/* Global Toast for Medicine Updates */}
        {medToast && (
          <div className="bg-sky-700 text-white px-8 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-sm">
            <Check className="w-4 h-4 text-emerald-300" />
            {medToast}
          </div>
        )}

        <div className="p-8 max-w-7xl w-full mx-auto">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Patients (EHR)</p>
                  <h3 className="text-2xl font-bold mt-1 text-[#0F172A]">{patients.length}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Active Faculty</p>
                  <h3 className="text-2xl font-bold mt-1 text-[#0F172A]">{doctors.length}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Appointments</p>
                  <h3 className="text-2xl font-bold mt-1 text-[#0284C7]">
                    {appointments.filter(a => a.status === 'Scheduled').length} Active / {appointments.length} Total
                  </h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Pharmacy Alerts</p>
                  <h3 className={`text-2xl font-bold mt-1 ${expiredCount > 0 ? 'text-red-600' : 'text-teal-600'}`}>
                    {expiredCount} Expired / {expiringSoonCount} Soon
                  </h3>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">Recent Consultations</h3>
                    <p className="text-xs text-[#64748B]">Click any status badge to toggle between Scheduled and Completed</p>
                  </div>
                  <span className="text-xs text-[#64748B]">
                    {appointments.filter(a => a.status === 'Completed').length} of {appointments.length} Finished
                  </span>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-[#64748B] uppercase">
                    <tr>
                      <th className="px-6 py-3">Patient (EHR Link)</th>
                      <th className="px-6 py-3">Assigned Doctor</th>
                      <th className="px-6 py-3">Date & Time</th>
                      <th className="px-6 py-3">Status (Click to Toggle)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {appointments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleOpenEHR(a.patient)}
                            className="font-bold text-[#0284C7] hover:text-[#0369A1] hover:underline flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {a.patient}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-[#64748B]">{a.doctor} ({a.dept})</td>
                        <td className="px-6 py-4 text-[#64748B] font-mono text-xs">{a.date} at {a.time}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleAppointmentStatus(a.id)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                              a.status === 'Completed' 
                                ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' 
                                : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                            }`}
                          >
                            {a.status === 'Completed' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-sky-600" />
                                Scheduled
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PHARMACY & INVENTORY */}
          {activeTab === 'pharmacy' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-red-200 bg-red-50/30 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-red-600">Expired Batches</p>
                    <h3 className="text-2xl font-bold text-red-700">{expiredCount} Batches</h3>
                    <p className="text-[11px] text-red-500">Sorted to top of inventory</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-amber-600">Expiring Soon (30d)</p>
                    <h3 className="text-2xl font-bold text-amber-700">{expiringSoonCount} Batches</h3>
                    <p className="text-[11px] text-amber-600">Priority FIFO rotation required</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-200 bg-sky-50/30 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-sky-100 text-[#0284C7] rounded-xl">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#0284C7]">Low Stock Alerts</p>
                    <h3 className="text-2xl font-bold text-[#0F172A]">{lowStockCount} Items</h3>
                    <p className="text-[11px] text-[#64748B]">Below 15 units remaining</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">Clinical Pharmacy Stock (Sorted by Expiry: Ascending)</h3>
                    <p className="text-xs text-[#64748B]">Different expiry dates automatically create distinct batch entries</p>
                  </div>
                  <button 
                    onClick={() => setShowMedModal(true)}
                    className="text-xs bg-[#0284C7] hover:bg-[#0369A1] text-white px-3 py-1.5 rounded-md font-semibold"
                  >
                    + Restock / Add Item
                  </button>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-[#64748B] uppercase">
                    <tr>
                      <th className="px-6 py-3">Medicine / Dosage</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Batch No.</th>
                      <th className="px-6 py-3">Stock Units</th>
                      <th className="px-6 py-3">Expiry Date (Ascending)</th>
                      <th className="px-6 py-3">Shelf Life Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {medicines.map((m) => {
                      const expInfo = checkExpiryStatus(m.expiry);
                      const isLow = Number(m.stock) <= 15;
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-semibold text-[#0F172A]">
                            {m.name}
                          </td>
                          <td className="px-6 py-4 text-[#64748B]">{m.category}</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{m.batch}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 font-bold ${isLow ? 'text-amber-600' : 'text-[#0F172A]'}`}>
                              {m.stock} {m.unit}
                              {isLow && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-normal">Low</span>}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-medium text-[#0F172A]">
                            {m.expiry}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border inline-block ${expInfo.badge}`}>
                              {expInfo.status} • {expInfo.subtext}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SCHEDULE VISIT (Aligned Form & Filtered 10-Min Slots) */}
          {activeTab === 'book' && (
            <div className="max-w-xl bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Patient Name</label>
                  <input 
                    type="text" 
                    value={patientName} 
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Select Doctor</label>
                  <select 
                    value={selectedDoc} 
                    onChange={(e) => {
                      setSelectedDoc(e.target.value);
                      setAptTime(''); // reset slot when doctor changes
                    }}
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                    required
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.dept})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">
                      Consultation Date
                    </label>
                    <input 
                      type="date" 
                      min={todayDateStr}
                      value={aptDate} 
                      onChange={(e) => {
                        setAptDate(e.target.value);
                        setAptTime(''); // reset slot when date changes
                      }}
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">
                      Time Slots Available
                    </label>
                    <select 
                      value={aptTime} 
                      onChange={(e) => setAptTime(e.target.value)}
                      disabled={!selectedDoc || !aptDate}
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7] disabled:bg-slate-100 disabled:text-slate-400"
                      required
                    >
                      <option value="">
                        {!selectedDoc || !aptDate 
                          ? '-- Select Doctor & Date First --' 
                          : availableSlots.length === 0 
                            ? '-- No Slots Left for Date --' 
                            : '-- Select Time Slot --'}
                      </option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedDoc && aptDate && (
                  <div className="text-[11px] text-[#64748B] bg-slate-50 p-2 rounded-lg border border-slate-200 flex justify-between">
                    <span>🟢 {availableSlots.length} available slots left for {selectedDoc}</span>
                    <span>🔴 {allTimeSlots.length - availableSlots.length} booked</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Reason for Visit</label>
                  <textarea 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Regular clinical checkup..." 
                    rows="3"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
                >
                  Schedule Appointment
                </button>
              </form>
            </div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">All Appointments</h3>
                  <p className="text-xs text-[#64748B]">Booked 10-minute slots are locked out dynamically</p>
                </div>
                <button 
                  onClick={() => setActiveTab('book')}
                  className="text-xs bg-[#0284C7] hover:bg-[#0369A1] text-white px-3 py-1.5 rounded-md font-semibold"
                >
                  + Add New
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-[#64748B] uppercase">
                  <tr>
                    <th className="px-6 py-3">Patient (EHR Link)</th>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Date & 10-Min Slot</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {appointments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleOpenEHR(a.patient)}
                          className="font-bold text-[#0284C7] hover:text-[#0369A1] hover:underline flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {a.patient}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-[#64748B]">{a.doctor}</td>
                      <td className="px-6 py-4 text-[#64748B]">{a.dept}</td>
                      <td className="px-6 py-4 text-[#64748B] font-mono text-xs">{a.date} at {a.time}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAppointmentStatus(a.id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 cursor-pointer ${
                            a.status === 'Completed' 
                              ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' 
                              : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                          }`}
                        >
                          {a.status === 'Completed' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Completed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-sky-600" /> Scheduled
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {a.status === 'Scheduled' ? (
                          <button
                            onClick={() => toggleAppointmentStatus(a.id)}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 ml-auto transition-all"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Completed
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleAppointmentStatus(a.id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#64748B] hover:text-[#0F172A] rounded-lg text-xs font-semibold border border-[#E2E8F0] flex items-center gap-1.5 ml-auto transition-all"
                          >
                            <RotateCcw className="w-3 h-3" /> Reopen Visit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: PATIENT DIRECTORY & EHR */}
          {activeTab === 'patients' && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Electronic Health Records (EHR)</h3>
                  <p className="text-xs text-[#64748B]">Click any patient name to access records and dispatch digital prescriptions</p>
                </div>
                <button 
                  onClick={() => setShowPatientModal(true)}
                  className="text-xs bg-[#0284C7] hover:bg-[#0369A1] text-white px-3 py-1.5 rounded-md font-semibold"
                >
                  + Add Patient
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-[#64748B] uppercase">
                  <tr>
                    <th className="px-6 py-3">Patient Name (Click for EHR)</th>
                    <th className="px-6 py-3">DOB</th>
                    <th className="px-6 py-3">Gender</th>
                    <th className="px-6 py-3">Blood Group</th>
                    <th className="px-6 py-3">Known Allergies</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3 text-right">EHR Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {patients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleOpenEHR(p)} 
                          className="font-bold text-[#0284C7] hover:text-[#0369A1] hover:underline flex items-center gap-1.5"
                        >
                          <FileText className="w-4 h-4" />
                          {p.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-[#64748B]">{p.dob}</td>
                      <td className="px-6 py-4 text-[#64748B]">{p.gender}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 font-semibold text-xs rounded border border-slate-200">
                          {p.blood}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-amber-700">
                        {p.allergies || 'None logged'}
                      </td>
                      <td className="px-6 py-4 text-[#64748B]">{p.contact}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenEHR(p)}
                          className="px-2.5 py-1 text-xs font-semibold bg-sky-50 text-[#0284C7] hover:bg-sky-100 rounded-md border border-sky-200"
                        >
                          Open Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: DOCTORS */}
          {activeTab === 'doctors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Clinical Faculty</h3>
                  <p className="text-xs text-[#64748B]">Manage specialists and consulting doctors</p>
                </div>
                <button 
                  onClick={() => setShowDoctorModal(true)}
                  className="text-xs bg-[#0284C7] hover:bg-[#0369A1] text-white px-4 py-2 rounded-lg font-semibold shadow-sm"
                >
                  + Register New Doctor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map(d => (
                  <div key={d.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center font-bold">
                        {d.name.split(' ')[1]?.[0] || 'D'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0F172A]">{d.name}</h4>
                        <p className="text-xs text-[#64748B]">{d.spec}</p>
                      </div>
                    </div>
                    <div className="text-xs space-y-2 text-[#64748B] pt-3 border-t border-[#E2E8F0]">
                      <p className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-[#0284C7]" /> {d.dept}</p>
                      <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#0284C7]" /> {d.email}</p>
                      <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#0284C7]" /> {d.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: EHR DOSSIER */}
      {activeEhrPatient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center font-bold text-lg">
                  {activeEhrPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    {activeEhrPatient.name} 
                    <span className="text-xs bg-sky-600/60 px-2 py-0.5 rounded font-normal">EHR-ID: {activeEhrPatient.id}</span>
                  </h3>
                  <p className="text-xs text-slate-300">DOB: {activeEhrPatient.dob} • Contact: {activeEhrPatient.contact}</p>
                </div>
              </div>
              <button onClick={() => setActiveEhrPatient(null)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {dispatchAlert && (
              <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                {dispatchAlert}
              </div>
            )}

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-[#64748B]">Blood Group</p>
                  <p className="text-base font-extrabold text-[#0F172A] mt-0.5">{activeEhrPatient.blood || 'Unknown'}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-[#64748B]">Blood Pressure</p>
                  <p className="text-base font-extrabold text-[#0F172A] mt-0.5">{activeEhrPatient.vitals?.bp || '120/80'}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-[#64748B]">Resting Pulse</p>
                  <p className="text-base font-extrabold text-[#0F172A] mt-0.5">{activeEhrPatient.vitals?.pulse || '72 bpm'}</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                  <p className="text-[10px] uppercase font-bold flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-600" /> Allergies
                  </p>
                  <p className="text-xs font-bold mt-1 truncate">{activeEhrPatient.allergies || 'None'}</p>
                </div>
              </div>

              <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-5">
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-3">
                  <Send className="w-4 h-4 text-[#0284C7]" /> Prescribe & Send Digital Medication
                </h4>
                <form onSubmit={handleSendPrescription} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1">Select from Pharmacy Inventory</label>
                      <select 
                        value={prescribeMed} 
                        onChange={(e) => setPrescribeMed(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7]"
                        required
                      >
                        <option value="">-- Choose Medicine --</option>
                        {medicines.map(m => (
                          <option key={m.id} value={m.name}>
                            {m.name} ({m.stock} {m.unit} in stock - Exp: {m.expiry})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1">Dosage Instructions</label>
                      <input 
                        type="text" 
                        value={prescribeDosage} 
                        onChange={(e) => setPrescribeDosage(e.target.value)}
                        placeholder="e.g. 1 Tablet after breakfast" 
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7]"
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1">Duration</label>
                      <input 
                        type="text" 
                        value={prescribeDuration} 
                        onChange={(e) => setPrescribeDuration(e.target.value)}
                        placeholder="e.g. 7 Days" 
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1">Dispensing Quantity</label>
                      <input 
                        type="number" 
                        value={prescribeQty} 
                        onChange={(e) => setPrescribeQty(e.target.value)}
                        min="1"
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1">Attending Faculty</label>
                      <select 
                        value={prescribeDoctor} 
                        onChange={(e) => setPrescribeDoctor(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7]"
                      >
                        {doctors.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch Digital Prescription & Deduct Stock
                  </button>
                </form>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0F172A] mb-3">Prescription & Medication History</h4>
                {(!activeEhrPatient.prescriptions || activeEhrPatient.prescriptions.length === 0) ? (
                  <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl text-xs text-[#64748B]">
                    No digital prescriptions logged yet. Use the dispatch form above to prescribe.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeEhrPatient.prescriptions.map(rx => (
                      <div key={rx.id} className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between shadow-xs">
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">{rx.medName}</p>
                          <p className="text-xs text-[#64748B]">{rx.dosage} • {rx.duration} (Qty: {rx.qty})</p>
                          <p className="text-[11px] text-slate-400">Prescribed by {rx.doctor} on {rx.date}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> {rx.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-[#E2E8F0] flex justify-end">
              <button 
                onClick={() => setActiveEhrPatient(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-[#0F172A] text-xs font-bold rounded-lg"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / RESTOCK MEDICATION (Existing vs New Tabs) */}
      {showMedModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Manage Pharmacy Stock</h3>
                <p className="text-xs text-[#64748B]">Choose an existing drug to restock or register a new one</p>
              </div>
              <button onClick={() => setShowMedModal(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Option Tabs: Existing vs New Medicine */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg mb-4">
              <button
                type="button"
                onClick={() => {
                  setMedMode('existing');
                  if (uniqueMedNames.length > 0 && !medName) {
                    handleSelectExistingMed(uniqueMedNames[0]);
                  }
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  medMode === 'existing'
                    ? 'bg-white text-[#0284C7] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Existing Medicine
              </button>
              <button
                type="button"
                onClick={() => {
                  setMedMode('new');
                  setMedName('');
                  setMedCategory('');
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  medMode === 'new'
                    ? 'bg-white text-[#0284C7] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                + New Medicine
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-3">
              {medMode === 'existing' ? (
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">
                    Select Existing Medicine
                  </label>
                  <select 
                    value={medName} 
                    onChange={(e) => handleSelectExistingMed(e.target.value)}
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7] bg-white"
                    required
                  >
                    <option value="">-- Choose from catalog --</option>
                    {uniqueMedNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    * If the expiry date matches an existing batch, stock merges. If it differs, a new batch is created.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">
                    Drug Name & Dosage
                  </label>
                  <input 
                    type="text" 
                    value={medName} 
                    onChange={(e) => setMedName(e.target.value)} 
                    placeholder="e.g. Ciprofloxacin 500mg"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                    required 
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Batch Number</label>
                  <input 
                    type="text" 
                    value={medBatch} 
                    onChange={(e) => setMedBatch(e.target.value)} 
                    placeholder="e.g. BZ-9021"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Category</label>
                  <input 
                    type="text" 
                    value={medCategory} 
                    onChange={(e) => setMedCategory(e.target.value)} 
                    placeholder="e.g. Antibiotic"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Stock Units</label>
                  <input 
                    type="number" 
                    value={medStock} 
                    onChange={(e) => setMedStock(e.target.value)} 
                    placeholder="e.g. 50"
                    min="1"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Unit Type</label>
                  <select 
                    value={medUnit} 
                    onChange={(e) => setMedUnit(e.target.value)}
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7] bg-white"
                  >
                    {['Tablets', 'Capsules', 'Vials', 'Bottles', 'Ampoules'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Batch Expiry Date</label>
                <input 
                  type="date" 
                  value={medExpiry} 
                  onChange={(e) => setMedExpiry(e.target.value)} 
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
              >
                {medMode === 'existing' ? 'Restock / Add Batch' : 'Register New Medicine'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DOCTOR */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#0F172A]">Add Doctor</h3>
              <button onClick={() => setShowDoctorModal(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddDoctor} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Doctor Name</label>
                <input 
                  type="text" 
                  value={docName} 
                  onChange={(e) => setDocName(e.target.value)} 
                  placeholder="e.g. Dr. Aryan Saxena"
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Specialization</label>
                <input 
                  type="text" 
                  value={docSpec} 
                  onChange={(e) => setDocSpec(e.target.value)} 
                  placeholder="e.g. Pediatrician"
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Department</label>
                <input 
                  type="text" 
                  value={docDept} 
                  onChange={(e) => setDocDept(e.target.value)} 
                  placeholder="e.g. Pediatrics"
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Contact Phone</label>
                <input 
                  type="text" 
                  value={docPhone} 
                  onChange={(e) => setDocPhone(e.target.value)} 
                  placeholder="+91 98765 00000"
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                />
              </div>
              <button 
                type="submit" 
                className="w-full mt-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
              >
                Save Doctor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PATIENT */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#0F172A]">Add New Patient</h3>
              <button onClick={() => setShowPatientModal(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newPtName} 
                  onChange={(e) => setNewPtName(e.target.value)} 
                  placeholder="e.g. Vikas Gupta"
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    value={newPtDob} 
                    onChange={(e) => setNewPtDob(e.target.value)} 
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Blood Group</label>
                  <select 
                    value={newPtBlood} 
                    onChange={(e) => setNewPtBlood(e.target.value)} 
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#64748B] mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={newPtContact} 
                  onChange={(e) => setNewPtContact(e.target.value)} 
                  placeholder="+91 91234 00000"
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7]"
                />
              </div>
              <button 
                type="submit" 
                className="w-full mt-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
              >
                Register Patient
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}