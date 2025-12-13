export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export interface BusinessConfig {
  name: string;
  phone: string; // WhatsApp number with country code, e.g., "5511999999999"
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}

export interface Availability {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
  isActive: boolean;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string; // Denormalized for simpler MVP display
  clientName: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  status: AppointmentStatus;
  createdAt: string;
}

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
