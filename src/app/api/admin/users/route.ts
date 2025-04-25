

// get all users and calculate the number of users

import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const users = await User.find();
      const totalUsers = users.length;
  
      return NextResponse.json({ totalUsers, users }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
  