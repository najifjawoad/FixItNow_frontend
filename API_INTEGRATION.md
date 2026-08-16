# FixItNow - API Integration Documentation

This document maps all frontend Next.js App Router components and pages to their corresponding backend Express/Prisma API endpoints.

---

## 1. Authentication & User Profile Mapping

| Frontend Route / Component | Action / Event | Backend API Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | Form Submit | `/api/auth/login` | `POST` | Public | Authenticates user credentials, returns `accessToken` & `refreshToken`. |
| `/auth/register` | Form Submit | `/api/auth/register` | `POST` | Public | Registers a new user (`CUSTOMER` or `TECHNICIAN` with bio, experience, skills). |
| `AuthContext` | Initial Mount / Refresh | `/api/auth/me` | `GET` | `ADMIN`, `CUSTOMER`, `TECHNICIAN` | Fetches active user profile & technician profile data. |
| `apiFetch` (Client) | 401 Interceptor | `/api/auth/refresh-token` | `POST` | Public | Refreshes expired access tokens using valid refresh token cookie/header. |

---

## 2. Public Services & Technicians Listing Mapping

| Frontend Route / Component | Action / Event | Backend API Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` (Homepage) | Component Mount | `/api/users/services` | `GET` | `ADMIN`, `CUSTOMER` | Loads featured service packages for homepage cards. |
| `/` (Homepage) | Component Mount | `/api/users/technicians` | `GET` | `ADMIN`, `CUSTOMER`, `TECHNICIAN` | Fetches top-rated technicians with skills & rating stats. |
| `/services` | Filter / Search | `/api/users/services` | `GET` | `ADMIN`, `CUSTOMER` | Supports `categoryId`, `search`, `minPrice`, `maxPrice`, `minRating`, `sortBy`, `page`, `limit`. |
| `/services` | Sidebar Mount | `/api/admin/allCategories` | `GET` | `ADMIN`, `TECHNICIAN` | Fetches category options for filter dropdowns. |
| `/technicians/[id]` | Profile Load | `/api/users/technicians/:id` | `GET` | `ADMIN`, `CUSTOMER` | Fetches single technician bio, rating, open availability slots, and review feed. |

---

## 3. Customer Booking & Payment Integration Mapping

| Frontend Route / Component | Action / Event | Backend API Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/technicians/[id]` (Modal) | Submit Booking | `/api/bookings` | `POST` | `CUSTOMER` | Creates booking request with `{ serviceId, availabilityId, address, notes }`. |
| `/dashboard/customer` | Page Load | `/api/users/get-my-bookings` | `GET` | `CUSTOMER`, `TECHNICIAN` | Fetches customer booking history with real-time status badges. |
| `/dashboard/customer` | "Pay Now" Click | `/api/payments/create` | `POST` | `CUSTOMER` | Initiates Stripe session for `ACCEPTED` booking, returns `checkoutUrl`. |
| `/dashboard/customer` | Payments Table | `/api/payments/my-payments` | `GET` | `CUSTOMER`, `TECHNICIAN` | Fetches transaction history with transaction IDs & amounts. |
| `/dashboard/customer` | Leave Review Modal | `/api/users/review` | `POST` | `CUSTOMER` | Submits rating (1-5) and feedback comment for completed booking. |

---

## 4. Technician Dashboard & Availability Mapping

| Frontend Route / Component | Action / Event | Backend API Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/dashboard/technician` | Page Load | `/api/users/get-my-bookings` | `GET` | `CUSTOMER`, `TECHNICIAN` | Fetches incoming customer booking requests for technician. |
| `/dashboard/technician` | Action Buttons | `/api/technician/bookings/status/:bookingId` | `PATCH` | `TECHNICIAN` | Updates status (`ACCEPTED`, `DECLINED`, `IN_PROGRESS`, `COMPLETED`). |
| `/dashboard/technician/availability` | Add Slot | `/api/technician/availability` | `POST` | `TECHNICIAN` | Creates open slot with `{ date, startTime, endTime }`. |
| `/dashboard/technician/availability` | Edit Slot | `/api/technician/update-availability` | `PATCH` | `TECHNICIAN` | Updates slot schedule times. |
| `/dashboard/technician/services` | Add Service | `/api/technician/services` | `POST` | `TECHNICIAN` | Publishes new service package with title, category, price, and duration. |

---

## 5. Admin Dashboard & Moderation Mapping

| Frontend Route / Component | Action / Event | Backend API Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/dashboard/admin` | Page Load | `/api/admin/allUsers` | `GET` | `ADMIN` | Fetches list of all platform registered users. |
| `/dashboard/admin` | Page Load | `/api/admin/allBookings` | `GET` | `ADMIN` | Fetches global platform booking metrics. |
| `/dashboard/admin` | Ban/Unban Button | `/api/admin/updateUserStatus/:id` | `PATCH` | `ADMIN` | Moderates user account status (`ACTIVE` vs `BANNED`). |
| `/dashboard/admin/categories` | Load / Create | `/api/admin/categories` | `GET`, `POST` | `ADMIN` | Views and creates new service categories. |
