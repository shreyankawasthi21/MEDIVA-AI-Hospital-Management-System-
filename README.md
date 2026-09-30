# Mediva — Clinical Information & Hospital Management System

Mediva is a responsive, high-performance Hospital Information System (HIS) engineered with React, Vite, and Tailwind CSS. Built with an offline-first, reactive client architecture, it guarantees 0ms latency, deterministic data persistence, and zero runtime failures during clinical simulations.

## Key Features

- **Electronic Health Records (EHR) Dossier:** Centralized clinical records tracking patient vitals (blood pressure, radial pulse), blood groups, and high-contrast allergy alerts to prevent contraindications.
- **Digital Prescription & Atomic Stock Deduction:** Direct medication dispatch from within patient dossiers that appends prescriptions to medical history and atomically updates pharmacy stock units.
- **Dynamic 10-Minute Consultation Scheduler:** Real-time time slot allocation (09:00 AM – 05:00 PM). Automatically blocks past dates and removes booked slots from doctor availability in real time.
- **Pharmacy Inventory & Expiry Engine:** Automated shelf-life auditing that flags expired batches in red, items expiring within 30 days in amber (for FIFO rotation), and low-stock alerts (≤15 units).
- **Consultation Lifecycle Management:** One-click toggling between `Scheduled` and `Completed` statuses with real-time dashboard analytics.
- **Smart Stock Deduplication:** Automatically aggregates incoming medication batches with existing drug entities to prevent table bloat.

## Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State & Persistence:** React Hooks (`useState`, `useEffect`, `useMemo`) with serialized `localStorage` caching
- **Deployment:** Vercel Edge Network

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

