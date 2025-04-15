import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import TimeSlot from '@/models/TimeSlot';

export async function GET() {
  await connect();
  try {
    const slots = await TimeSlot.find().populate('lawyer_id');
    return NextResponse.json(slots);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req:NextRequest) {
  await connect();
  const body = await req.json();
  try {
    const slot = new TimeSlot(body);
    await slot.save();
    return NextResponse.json(slot, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}