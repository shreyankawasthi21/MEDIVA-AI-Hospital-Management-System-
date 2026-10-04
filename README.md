# Mediva — Clinical Information & Hospital Management System

A modern, offline-resilient hospital management platform built with **React**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL)**. Mediva streamlines patient electronic health records (EHR), automated 10-minute appointment scheduling, clinical faculty directories, and clinical pharmacy inventory tracking with FIFO expiry sorting.

---

## Features

### 🩺 Clinical Faculty & Doctor Directory
- Specialist faculty directory categorized by medical departments (Cardiology, Neurology, Dentistry, etc.).
- Real-time contact and credential visibility.
- On-the-fly specialist onboarding modal.

### 📋 Electronic Health Records (EHR) Dossier
- Comprehensive patient profiles logging blood type, allergies, and baseline vitals (BP, resting pulse, weight).
- Digital prescription engine with live stock deduction from the pharmacy inventory.
- Complete digital prescription timeline with dispensing status.

### ⏱️ Dynamic Consultation Scheduling
- 10-minute interval slot allocation engine (09:00 AM – 05:00 PM).
- Dynamic slot filtering preventing double-booking across doctors and dates.
- Interactive status toggle (`Scheduled` ↔ `Completed`) with instant database synchronization.

### 💊 Clinical Pharmacy & Drug Expiry Monitor
- Multi-batch tracking with automatic ascending FIFO sort by expiration date.
- Real-time shelf-life badges: `Expired`, `Expiring Soon (≤30d)`, and `Shelf Life Safe`.
- Low-stock warnings for items with fewer than 15 units remaining.
- Intelligent restock: merges stock if batch and expiry date match, or generates a distinct batch entry if expiration dates differ.

### ☁️ Supabase Cloud Engine & Resilient State
- Live PostgreSQL backend syncing `doctors`, `patients`, `appointments`, and `medicines`.
- Native `jsonb` schema support for patient vitals and nested prescription arrays.
- Dual-layer persistence: optimistic updates combined with local cache fallbacks for zero UI latency.

---

## Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Database & Backend:** Supabase (PostgreSQL, PostgREST)
- **Deployment:** Vercel

---

## Database Architecture (Supabase SQL)

Mediva runs on four relational PostgreSQL tables:

```sql
-- 1. Doctors Table
CREATE TABLE doctors (
  id bigint PRIMARY KEY,
  name text NOT NULL,
  spec text,
  dept text,
  email text,
  phone text
);

-- 2. Patients Table (JSONB support for vitals & prescriptions)
CREATE TABLE patients (
  id text PRIMARY KEY,
  name text NOT NULL,
  dob text,
  gender text,
  blood text,
  contact text,
  allergies text,
  vitals jsonb DEFAULT '{}'::jsonb,
  prescriptions jsonb DEFAULT '[]'::jsonb
);

-- 3. Appointments Table
CREATE TABLE appointments (
  id text PRIMARY KEY,
  patient text NOT NULL,
  doctor text NOT NULL,
  dept text,
  date text NOT NULL,
  time text NOT NULL,
  status text DEFAULT 'Scheduled'
);

-- 4. Medicines Table
CREATE TABLE medicines (
  id text PRIMARY KEY,
  name text NOT NULL,
  batch text,
  category text,
  stock integer DEFAULT 0,
  unit text,
  expiry text NOT NULL
);