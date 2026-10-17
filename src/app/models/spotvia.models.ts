export type UserRole = 'client' | 'agent' | 'admin';

export interface SpotviaUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  initials: string;
  city: string;
}

export interface SpotviaEvent {
  id: string;
  title: string;
  category: string;
  venue: string;
  address: string;
  city: string;
  date: string;
  startTime: string;
  durationHours: number;
  pricePerHour: number;
  availableSlots: number;
  status: 'active' | 'review';
  ownerId: string;
  ownerName: string;
  rating: number;
  imageClass: string;
}

export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

export interface SpotviaReservation {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  date: string;
  time: string;
  durationHours: number;
  clientId: string;
  clientName: string;
  clientEmail: string;
  agentId: string;
  status: ReservationStatus;
  total: number;
}

export interface MonthlyReport {
  month: string;
  reservations: number;
  revenue: number;
}

export interface AdminReport {
  registeredUsers: number;
  activeEvents: number;
  monthlyReservations: number;
  monthlyRevenue: number;
  pendingEvents: number;
  monthlyActivity: MonthlyReport[];
}