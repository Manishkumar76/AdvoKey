import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Consultation from '@/models/Consultation';

export async function GET() {
  await connect();
  try {
    const consultations = await Consultation.find().populate('client_id').populate('lawyer_id').populate('timeslot_id');
    return NextResponse.json(consultations);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req:NextRequest) {
  await connect();
  const body = await req.json();
  try {
    const consultation = new Consultation(body);
    await consultation.save();
    return NextResponse.json(consultation, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
