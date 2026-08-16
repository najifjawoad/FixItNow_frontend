export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type UserStatus = "ACTIVE" | "BANNED";

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  technicianProfile?: TechnicianProfile | null;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio?: string | null;
  experienceYears: number;
  skills: string[];
  avgRating: number;
  verified: boolean;
  createdAt: string;
  updatedAt?: string;
  user?: User;
  services?: Service[];
  availability?: Availability[];
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  services?: Service[];
}

export interface Service {
  id: string;
  technicianId: string;
  categoryId: string;
  title: string;
  description?: string | null;
  price: number | string;
  durationMinutes: number;
  createdAt: string;
  updatedAt?: string;
  technician?: TechnicianProfile;
  category?: Category;
}

export interface Availability {
  id: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  technician?: TechnicianProfile;
  booking?: Booking | null;
}

export interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  availabilityId: string;
  scheduledAt: string;
  address: string;
  status: BookingStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  customer?: User;
  technician?: TechnicianProfile;
  service?: Service;
  availability?: Availability;
  payments?: Payment[];
  review?: Review | null;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionId: string;
  amount: number | string;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  booking?: Booking;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer?: { id: string; name: string };
  technician?: TechnicianProfile;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}
