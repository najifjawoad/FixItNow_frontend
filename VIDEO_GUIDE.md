# FixItNow - Video Explanation Guide (7 - 10 Minutes Script)

Language: **English / Bengali**  
Target Video Length: **7 to 10 Minutes**  
Project Title: **FixItNow - Your Trusted Home Service Platform**

---

## 🎬 Section-by-Section Walkthrough Script

### 1. Introduction & Next.js Architecture (1.5 Minutes)
- **Script**:
  > "Hello everyone! Welcome to the demonstration of **FixItNow**, a modern home services marketplace built with Next.js 14 App Router, TypeScript, Tailwind CSS, and TanStack React Query.
  > Let's take a quick look at our folder structure:
  > - Inside the `app/` folder, we leverage Next.js App Router for routing: public routes like `/services` and `/technicians/[id]`, authentication routes under `/auth/`, callback pages under `/payment/`, and role-based dashboard layouts inside `/dashboard/`.
  > - Route security is handled by `middleware.ts`, which decodes JWT tokens from cookies and enforces role access for `CUSTOMER`, `TECHNICIAN`, and `ADMIN`.
  > - Client state and cache invalidation are powered by TanStack Query alongside `react-hot-toast` for structured error boundaries."

### 2. Role-Based Navigation & Dynamic UI Demonstration (2 Minutes)
- **Script & Action**:
  > "Let's demonstrate how our UI dynamically adapts according to the authenticated user's role:
  > 1. **Customer Role (`customer@fixitnow.com`)**: Upon login, the top navigation displays a blue **Customer** badge. The customer dashboard `/dashboard/customer` presents active job tracking, booking history, and Stripe checkout buttons.
  > 2. **Technician/Provider Role (`tech@fixitnow.com`)**: Logging in as a Technician displays an amber **Provider** badge. The dashboard `/dashboard/technician` provides job request management, an interactive availability calendar `/dashboard/technician/availability`, and service package creation.
  > 3. **Admin Role (`admin@fixitnow.com`)**: The navbar shows a rose **Admin** badge. The admin dashboard `/dashboard/admin` gives platform-wide metrics, user ban/unban moderation toggles, and service category management."

### 3. Full CRUD Operations Walkthrough (2 Minutes)
- **Script & Action**:
  > "Now let's showcase full CRUD operations in action through the UI:
  > - **CREATE**: Logged in as a Technician, we visit `/dashboard/technician/services` to create a new service package (e.g. 'AC Duct & Filter Repair' at $85.00). Next, on `/dashboard/technician/availability`, we publish a new open time slot.
  > - **READ**: As a Customer, we navigate to `/services` and filter services by Category, Price Range, and Technician Rating in real time. We open `/technicians/[id]` to view open time slots.
  > - **UPDATE**: The Customer books a slot. The Technician opens their dashboard `/dashboard/technician` and clicks **Accept** (status updates from `REQUESTED` to `ACCEPTED`). Later, after payment, the technician clicks **Start Job** (`IN_PROGRESS`) and **Mark Completed** (`COMPLETED`).
  > - **DELETE / MODERATE**: Logged in as Admin on `/dashboard/admin`, we search for a user and click **Ban User** (updating status to `BANNED`)."

### 4. Validation & Consistent UI Error Handling (1 Minute)
- **Script & Action**:
  > "Error handling and validation are enforced at both form and network layers:
  > - If a user attempts to log in without entering required fields, inline error messages trigger immediately below the input.
  > - If an invalid password or email is submitted, `apiFetch` catches the backend 400/401 error and displays a structured `react-hot-toast` notification.
  > - Page-level loading skeletons (`loading.tsx`) and error boundaries (`error.tsx`) prevent UI flickering and handle network disconnections gracefully."

### 5. Stripe Payment Integration Walkthrough (1.5 Minutes)
- **Script & Action**:
  > "Now let's walk through our mandatory **Stripe Payment Integration**:
  > 1. Once a Technician accepts a booking request, the status updates to `ACCEPTED`.
  > 2. On the Customer Dashboard, a prominent **Pay Now ($85.00)** button appears.
  > 3. Clicking **Pay Now** sends a `POST /api/payments/create` request. The backend creates a Stripe Checkout Session and returns `checkoutUrl`.
  > 4. The frontend redirects the user directly to the secure Stripe Checkout page.
  > 5. Upon completing card payment, Stripe redirects back to our callback page `/payment/success?bookingId=...`.
  > 6. The UI updates the booking status badge in real-time to `PAID` (purple badge) and displays transaction details in the Payment History table."

### 6. Technical Challenge Solved (1 Minute)
- **Script**:
  > "One major technical challenge we solved was seamless JWT token renewal and role middleware synchronization. By building a custom `apiFetch` client wrapper, whenever an access token expires (returning 401), the interceptor automatically calls `/api/auth/refresh-token`, saves the new JWT in cookies, and retries the original request without disrupting the user's flow."

---

## 💡 Summary Checklist For Video Recording
- [x] Show folder structure & Next.js App Router setup
- [x] Demonstrate all 3 Roles (`Customer`, `Technician`, `Admin`)
- [x] Demonstrate CRUD: Create Service, Add Availability, Update Status, Ban User
- [x] Trigger validation error and show toast feedback
- [x] Complete Stripe Checkout redirect flow to `/payment/success`
- [x] Explain Middleware & JWT token refresh technical challenge
