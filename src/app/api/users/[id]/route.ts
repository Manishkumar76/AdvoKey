import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// GET user by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connect();

    const userId = await context.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User details fetched successfully!",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Unauthorized" }, { status: 401 });
  }
}

// PUT update user by ID
export async function PUT(
  req: NextRequest,
   params : { params: { id: string } }
) {
  try {
    await connect();

    const userId = params.params.id;
    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: body.username,
        age: body.age,
        phone: body.phone,
      },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update user details" }, { status: 500 });
  }
}

// DELETE user by ID
export async function DELETE(
  req: NextRequest,
   params : { params: { id: string } }
) {
  try {
    await connect();

    const userId = params.params.id;
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
