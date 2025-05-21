import { connect } from "@/dbConfig/dbConfig";
import Users from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// GET user by ID
export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    await connect();

    const userId = context.params.id;

    const user = await Users.findById(userId).select("-password");

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

// PUT update user by ID
export async function PUT(
  req: NextRequest,
   params :any
) {
  try {
    await connect();

    const userId = params.params.id;
    const body = await req.json();

    const updatedUser = await Users.findByIdAndUpdate(
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
   params : any
) {
  try {
    await connect();

    const userId = params.params.id;
    await Users.findByIdAndDelete(userId);

    return NextResponse.json({ message: "Users deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
