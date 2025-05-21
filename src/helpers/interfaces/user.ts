import {Location} from "./location"
export interface Users{
      _id: string;
      fullname: string;
      age: number;
    username: string;
      email: string;
      phone: string;
      role: string;
    profile_image_url: string;
      isEmailverify: boolean;
    location:Location;
    isverify: boolean;
    createdAt: Date;
}