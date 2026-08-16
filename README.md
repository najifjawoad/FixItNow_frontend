# FixItNow Frontend - Home Services Marketplace

FixItNow is a modern, responsive Next.js (App Router) frontend application for a home services marketplace. Built with TypeScript, Tailwind CSS, TanStack Query, and Stripe Checkout.

---

## 🔑 Working Demo Credentials (Bangladeshi Demo Profiles)

| Role | Email | Password | Phone | Name / Specialization |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin123@gmail.com` | `12345` | `+880 1700-000000` | Platform Admin |
| **Customer** | `customer@fixitnow.com` | `password123` | `+880 1711-998877` | Tariqul Islam (Dhaka Tenant) |
| **Technician (Electrical)** | `tanvir.electric@gmail.com` | `password123` | `+880 1712-345678` | Engr. Tanvir Ahmed (DB Box & IPS) |
| **Technician (Plumbing)** | `rafiq.plumbing@gmail.com` | `password123` | `+880 1819-876543` | Md. Rafiqul Islam (Sanitary & Pumps) |
| **Technician (HVAC / AC)** | `mahmud.acservice@gmail.com` | `password123` | `+880 1911-234567` | Kazi Mahmud Hasan (Inverter AC Jet Wash) |
| **Technician (Carpentry)** | `naimur.carpenter@gmail.com` | `password123` | `+880 1615-998877` | Naimur Rahman (Cabinet & Locks) |

*(Note: You can also use the **Quick Demo Buttons** on the `/auth/login` page to autofill credentials with a single click).*

---

## 🇧🇩 Bangladeshi Demo Services Included

1. **DB Box Installation & Full House Rewiring** (`৳1,500 / $35.00`) - Engr. Tanvir Ahmed
2. **IPS & Generator Line Connection & Servicing** (`৳1,200 / $25.00`) - Engr. Tanvir Ahmed
3. **Water Submersible Pump Repair & Unblocking** (`৳1,400 / $30.00`) - Md. Rafiqul Islam
4. **Sanitary Fitting & Concealed Pipe Leak Sealing** (`৳1,100 / $22.00`) - Md. Rafiqul Islam
5. **Inverter AC Master Jet Wash & Filter Cleaning** (`৳1,000 / $20.00`) - Kazi Mahmud Hasan
6. **Modular Kitchen Cabinet Repair & Lock Fitting** (`৳900 / $20.00`) - Naimur Rahman

---

## 🚀 Tech Stack

- **Framework**: Next.js 14/15 App Router (`app/` directory)
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **State Management & Fetching**: TanStack React Query v5 + Auth Context
- **Authentication**: JWT token management stored in Cookies + Next.js Middleware route protection
- **Payment Gateway**: Stripe Checkout Session Redirect Integration
- **Notification & Error UI**: `react-hot-toast` + App Router `error.tsx` & `loading.tsx`

---

## 🛠️ Getting Started

### 1. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📋 Features Overview

1. **Role-Based UI & Navigation**:
   - `CUSTOMER`: Browse catalog, filter services, pick available time slots, initiate Stripe payments, track booking status, leave reviews.
   - `TECHNICIAN`: View incoming requests, accept/decline bookings, manage availability slots calendar, create service packages.
   - `ADMIN`: Platform health overview, data table with search and ban/unban controls, category management.
2. **Next.js Middleware**: Protects `/dashboard/*` routes according to JWT token roles.
3. **Stripe Payment Integration**: Redirects to Stripe Checkout session; handles `/payment/success` and `/payment/cancel` routes.
4. **Error Handling**: Inline form validation error prompts, structured toast notifications, loading skeletons, and error boundaries.
