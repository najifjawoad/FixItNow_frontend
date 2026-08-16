# FixItNow Frontend - Home Services Marketplace

FixItNow is a modern, responsive Next.js (App Router) frontend application for a home services marketplace. Built with TypeScript, Tailwind CSS, TanStack Query, and Stripe Checkout.

---

## 🔑 Working Test Credentials

| Role | Email | Password | Access / Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin123@gmail.com` | `12345` | Platform overview metrics, User management (Ban/Unban), Service Categories |
| **Technician / Provider** | `tech@fixitnow.com` | `password123` | Provider dashboard, Accept/Decline requests, Availability calendar, Add services |
| **Customer / Tenant** | `customer@fixitnow.com` | `password123` | Browse services, Time-slot booking modal, Stripe payment checkout, Rate & Review |

*(Note: You can also use the **Quick Demo Buttons** on the `/auth/login` page to autofill these credentials with a single click).*

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
