import { Service, Availability, Appointment, AppointmentStatus, TimeSlot, BusinessConfig } from '../types';
import { INITIAL_SERVICES, INITIAL_AVAILABILITY, INITIAL_BUSINESS_CONFIG } from './mockData';
import { sendBookingNotification } from './whatsapp';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- STORAGE KEYS ---
const KEY_SERVICES = 'as_services';
const KEY_AVAILABILITY = 'as_availability';
const KEY_APPOINTMENTS = 'as_appointments';
const KEY_AUTH = 'as_auth_token';
const KEY_USER_DATA = 'as_user_data'; // Store user profile & trial info
const KEY_BUSINESS_CONFIG = 'as_business_config';

// --- SAFE PARSE HELPER ---
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error parsing ${key} from storage, using fallback.`);
    return fallback;
  }
};

// --- INITIALIZATION ---
const initializeStorage = () => {
  if (!localStorage.getItem(KEY_SERVICES)) {
    localStorage.setItem(KEY_SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
  if (!localStorage.getItem(KEY_AVAILABILITY)) {
    localStorage.setItem(KEY_AVAILABILITY, JSON.stringify(INITIAL_AVAILABILITY));
  }
  if (!localStorage.getItem(KEY_APPOINTMENTS)) {
    localStorage.setItem(KEY_APPOINTMENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEY_BUSINESS_CONFIG)) {
    localStorage.setItem(KEY_BUSINESS_CONFIG, JSON.stringify(INITIAL_BUSINESS_CONFIG));
  }
};

initializeStorage();

// --- AUTH SERVICE (Login/Register/Trial) ---
export const authService = {
  // Login simples (Mock)
  login: async (email: string, password: string): Promise<{ token: string, user: any }> => {
    await delay(600);
    
    // Check local mock DB first
    const storedUser = safeParse(KEY_USER_DATA, null);
    
    if (storedUser && storedUser.email === email && password === 'password') {
       const token = 'mock-jwt-token-' + Date.now();
       localStorage.setItem(KEY_AUTH, token);
       return { token, user: storedUser };
    }

    // Default admin fallback
    if (email === 'admin@example.com' && password === 'password') {
      // Create admin user data if not exists for trial logic
      const adminUser = { 
        name: 'Admin User', 
        email, 
        trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
      };
      localStorage.setItem(KEY_USER_DATA, JSON.stringify(adminUser));
      
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(KEY_AUTH, token);
      return { token, user: adminUser };
    }
    throw new Error('Credenciais inválidas');
  },

  // Novo Registro
  register: async (name: string, email: string, password: string): Promise<{ token: string, user: any }> => {
    await delay(800);
    
    // Set trial to 3 days from now
    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + 3);
    
    const newUser = {
      name,
      email,
      trialEndsAt: trialEnds.toISOString()
    };
    
    localStorage.setItem(KEY_USER_DATA, JSON.stringify(newUser));
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem(KEY_AUTH, token);
    
    return { token, user: newUser };
  },

  logout: () => {
    localStorage.removeItem(KEY_AUTH);
    // Note: We keep USER_DATA to persist trial info even after logout
  },

  isAuthenticated: () => !!localStorage.getItem(KEY_AUTH),
  
  getUser: () => safeParse(KEY_USER_DATA, null),

  getTrialStatus: () => {
    const user = safeParse(KEY_USER_DATA, null);
    if (!user || !user.trialEndsAt) return { active: true, daysLeft: 3 }; // Fallback safe
    
    const now = new Date();
    const end = new Date(user.trialEndsAt);
    const diffTime = end.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      active: diffTime > 0,
      daysLeft: daysLeft > 0 ? daysLeft : 0
    };
  }
};

// --- BUSINESS CONFIG ---
export const businessApi = {
  get: async (): Promise<BusinessConfig> => {
    await delay(300);
    return safeParse(KEY_BUSINESS_CONFIG, INITIAL_BUSINESS_CONFIG);
  },
  update: async (config: BusinessConfig): Promise<void> => {
    await delay(400);
    localStorage.setItem(KEY_BUSINESS_CONFIG, JSON.stringify(config));
  }
};

// --- SERVICES CRUD ---
export const serviceApi = {
  list: async (): Promise<Service[]> => {
    await delay(300);
    return safeParse(KEY_SERVICES, []);
  },
  create: async (service: Omit<Service, 'id'>): Promise<Service> => {
    await delay(400);
    const services = safeParse<Service[]>(KEY_SERVICES, []);
    const newService = { ...service, id: Math.random().toString(36).substr(2, 9) };
    services.push(newService);
    localStorage.setItem(KEY_SERVICES, JSON.stringify(services));
    return newService;
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const services = safeParse<Service[]>(KEY_SERVICES, []);
    const filtered = services.filter((s: Service) => s.id !== id);
    localStorage.setItem(KEY_SERVICES, JSON.stringify(filtered));
  }
};

// --- AVAILABILITY ---
export const availabilityApi = {
  get: async (): Promise<Availability[]> => {
    await delay(300);
    return safeParse(KEY_AVAILABILITY, []);
  },
  update: async (availabilities: Availability[]): Promise<void> => {
    await delay(400);
    localStorage.setItem(KEY_AVAILABILITY, JSON.stringify(availabilities));
  }
};

// --- APPOINTMENTS ---
export const appointmentApi = {
  list: async (): Promise<Appointment[]> => {
    await delay(300);
    return safeParse(KEY_APPOINTMENTS, []);
  },
  
  create: async (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'endTime' | 'serviceName'>): Promise<Appointment> => {
    await delay(800);
    const appointments: Appointment[] = safeParse(KEY_APPOINTMENTS, []);
    const services: Service[] = safeParse(KEY_SERVICES, []);
    
    const service = services.find(s => s.id === appointment.serviceId);
    if (!service) throw new Error("Service not found");

    // Calculate End Time
    const start = new Date(`2000-01-01T${appointment.startTime}`);
    start.setMinutes(start.getMinutes() + service.durationMinutes);
    const endTime = start.toTimeString().slice(0, 5);

    // Double Booking Check (Simple overlap check)
    const hasConflict = appointments.some(apt => 
      apt.date === appointment.date &&
      apt.status !== AppointmentStatus.CANCELLED &&
      (
        (appointment.startTime >= apt.startTime && appointment.startTime < apt.endTime) ||
        (endTime > apt.startTime && endTime <= apt.endTime)
      )
    );

    if (hasConflict) {
      throw new Error("Horário não disponível. Por favor escolha outro.");
    }

    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
      status: AppointmentStatus.CONFIRMED, // Auto confirm for MVP
      createdAt: new Date().toISOString(),
      endTime,
      serviceName: service.name
    };

    appointments.push(newAppointment);
    localStorage.setItem(KEY_APPOINTMENTS, JSON.stringify(appointments));

    // --- INTEGRATION: WHATSAPP NOTIFICATION ---
    sendBookingNotification(newAppointment).catch(err => {
      console.error("Erro background ao enviar notificação WhatsApp:", err);
    });
    // ------------------------------------------

    return newAppointment;
  },

  updateStatus: async (id: string, status: AppointmentStatus): Promise<void> => {
    await delay(300);
    const appointments = safeParse<Appointment[]>(KEY_APPOINTMENTS, []);
    const updated = appointments.map((a: Appointment) => a.id === id ? { ...a, status } : a);
    localStorage.setItem(KEY_APPOINTMENTS, JSON.stringify(updated));
  },

  getAvailableSlots: async (date: string, serviceId: string): Promise<TimeSlot[]> => {
    await delay(400);
    
    const services: Service[] = safeParse(KEY_SERVICES, []);
    const service = services.find(s => s.id === serviceId);
    if (!service) return [];

    const dateObj = new Date(date + 'T00:00:00'); 
    const dayOfWeek = dateObj.getDay();
    const availability: Availability[] = safeParse(KEY_AVAILABILITY, []);
    const dayConfig = availability.find(a => a.dayOfWeek === dayOfWeek);

    if (!dayConfig || !dayConfig.isActive) return [];

    const allAppointments: Appointment[] = safeParse(KEY_APPOINTMENTS, []);
    const dayAppointments = allAppointments.filter(a => 
      a.date === date && a.status !== AppointmentStatus.CANCELLED
    );

    const slots: TimeSlot[] = [];
    let currentTime = new Date(`2000-01-01T${dayConfig.startTime}`);
    const endTime = new Date(`2000-01-01T${dayConfig.endTime}`);

    while (currentTime < endTime) {
      const slotStartStr = currentTime.toTimeString().slice(0, 5);
      
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + service.durationMinutes);
      const slotEndStr = slotEnd.toTimeString().slice(0, 5);

      if (slotEnd > endTime) break; 

      const isOccupied = dayAppointments.some(apt => {
        return (slotStartStr < apt.endTime && slotEndStr > apt.startTime);
      });

      const now = new Date();
      const isToday = new Date().toISOString().split('T')[0] === date;
      const isPast = isToday && (currentTime.getHours() < now.getHours() || (currentTime.getHours() === now.getHours() && currentTime.getMinutes() < now.getMinutes()));

      if (!isOccupied && !isPast) {
        slots.push({ time: slotStartStr, available: true });
      }

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  }
};