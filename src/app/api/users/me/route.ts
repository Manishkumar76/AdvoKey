// app/api/me/route.ts
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import Users from "@/models/userModel";

connect();

export async function GET(request: NextRequest) {
  try {
    
    const userTokenData = await getDataFromToken();
    const userId= userTokenData?.id;
    const user = await Users.findOne({ _id: userId }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "Users not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Users details fetched successfully!",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Unauthorized" }, { status: 401 });
  }
}


