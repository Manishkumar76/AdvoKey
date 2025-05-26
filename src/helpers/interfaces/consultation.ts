import { Users } from './user';

export interface Consultations {
  _id: string;
  lawyer_id: {
    _id: string;
    user: Users; // populated from LawyerProfiles → Users
  };
  client_id: Users; // directly populated from Users
  scheduledAt: string;
  time: string;
  durationMinutes: number;
  notes?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}
