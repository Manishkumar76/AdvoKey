import { NextRequest, NextResponse } from "next/server";
import Specializations from "@/models/Specializations";

// GET all specializations
export async function GET() {
  try {
    const specializations = await Specializations.find();
    return NextResponse.json({ specializations }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new specialization
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSpecialization = new Specializations(body);
    await newSpecialization.save();
    return NextResponse.json(newSpecialization, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
