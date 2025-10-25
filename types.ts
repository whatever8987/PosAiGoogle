import type { LucideProps } from 'lucide-react';
import type React from 'react';

export type Theme = 'light' | 'dark';

export type Page = 'assistant' | 'appointments';

export type CalendarView = 'month' | 'week' | 'day';

export interface QueryResult {
  sql: string;
  chartType: 'bar' | 'line' | 'pie';
  data: Record<string, any>[];
  explanation: string;
  error?: string;
  followUps?: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  Icon: React.ComponentType<LucideProps>;
  queryResult?: QueryResult;
}

export interface SavedQuery {
  id: string;
  name: string;
  question: string;
}

export interface POSIntegration {
  id: string;
  name: string;
  provider: 'square' | 'clover' | 'shopify';
  status: 'connected' | 'disconnected';
  lastSync: string;
}

export interface UsageStats {
  queriesUsed: number;
  monthlyLimit: number;
}

export type AppointmentCategory = 'Haircut and Styling' | 'Manicure' | 'Pedicure' | 'Facial cleansing' | 'Appointment' | 'Window repair' | 'Office construction' | 'Dental cleaning' | 'Test' | 'Wall painting' | 'Doctor\'s appointment' | 'Performance review' | 'Nutrition appointment' | 'Gardening' | 'Makeup' | 'Periodontics' | 'Roof repair';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  category: AppointmentCategory;
  status: AppointmentStatus;
  technicianId: string;
}

export interface Technician {
    id: string;
    firstName: string;
    lastName: string;
}
