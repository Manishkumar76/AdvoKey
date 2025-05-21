import { Users } from "./user";
import {Location} from './location';
export interface Lawyer {
    _id: string;
    specialization: string;
    rating: number;
    bio: string;
    availability: string;
    years_of_experience: number;
    location:Location;
    isVerified : boolean;
    user: Users;
    
  }