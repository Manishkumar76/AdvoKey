import { Users } from "./user";

export interface Lawyer {
    _id: string;
    specialization: string;
    rating: number;
    bio: string;
    availability: string;
    years_of_experience: number;
    location:Locations;
    isVerified : boolean;
    user: Users;
    
  }