import { User } from "./user";

export interface Consultation {
    _id: string;
    lawyer_id: {
      _id: string;
      user: User;
    };
    client_id: string;
    scheduledAt: string;
    time: string;
    durationMinutes: number;
    notes?: string;
    status: string;
    createdAt: string;
  }