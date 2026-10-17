import { Injectable } from '@angular/core';
import { AdminReport } from '../models/spotvia.models';

const REPORT: AdminReport = {
  registeredUsers: 1284,
  activeEvents: 86,
  monthlyReservations: 3642,
  monthlyRevenue: 48200000,
  pendingEvents: 12,
  monthlyActivity: [
    { month: 'May', reservations: 218, revenue: 2900000 },
    { month: 'Jun', reservations: 262, revenue: 3500000 },
    { month: 'Jul', reservations: 247, revenue: 3300000 },
    { month: 'Ago', reservations: 318, revenue: 4200000 },
    { month: 'Sep', reservations: 356, revenue: 4700000 },
    { month: 'Oct', reservations: 411, revenue: 5500000 },
  ],
};

@Injectable({ providedIn: 'root' })
export class AdminReportMockService {
  getReport(): AdminReport {
    return REPORT;
  }
}