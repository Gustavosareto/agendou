import { Service, Availability, BusinessConfig } from '../types';

export const INITIAL_BUSINESS_CONFIG: BusinessConfig = {
  name: 'Minha Barbearia',
  phone: '5511999999999' // Default/Placeholder number
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Corte de Cabelo',
    description: 'Corte tradicional com tesoura ou máquina.',
    durationMinutes: 30,
    price: 40
  },
  {
    id: '2',
    name: 'Barba Completa',
    description: 'Modelagem de barba com toalha quente.',
    durationMinutes: 30,
    price: 30
  },
  {
    id: '3',
    name: 'Corte + Barba',
    description: 'Combo completo.',
    durationMinutes: 50,
    price: 60
  }
];

export const INITIAL_AVAILABILITY: Availability[] = [
  { dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isActive: false }, // Dom
  { dayOfWeek: 1, startTime: '09:00', endTime: '19:00', isActive: true },  // Seg
  { dayOfWeek: 2, startTime: '09:00', endTime: '19:00', isActive: true },  // Ter
  { dayOfWeek: 3, startTime: '09:00', endTime: '19:00', isActive: true },  // Qua
  { dayOfWeek: 4, startTime: '09:00', endTime: '19:00', isActive: true },  // Qui
  { dayOfWeek: 5, startTime: '09:00', endTime: '20:00', isActive: true },  // Sex
  { dayOfWeek: 6, startTime: '09:00', endTime: '16:00', isActive: true },  // Sab
];
