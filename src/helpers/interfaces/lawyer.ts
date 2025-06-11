import { Users } from "./user";
import { Location } from "./location";

export interface Specialization {
  _id: string;
  name: string;
}

export interface Lawyers {
  _id: string;
  rating: number;
  bio: string;
  availability: string[];
  years_of_experience: number;
  location: Location;
  isVerified: boolean;
  user: Users;
  specialization_id: Specialization;
  Office_Address?: string;
  education?: string;
  certifications?: string[];
  Consultation_price?: number;
  level?: 'junior' | 'mid-level' | 'senior';
  profile_status?: 'pending' | 'approved' | 'rejected';
  proof_documents?: string[];
}
