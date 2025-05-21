import { Users } from "./user";

export interface Consultations {
    _id: string;
    lawyer_id: {
      _id: string;
      user: Users;
    };
    client_id: string;
    scheduledAt: string;
    time: string;
    durationMinutes: number;
    notes?: string;
    status: string;
    createdAt: string;
  }