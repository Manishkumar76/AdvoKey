import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import LawyerSpecializations from '@/models/LawyerSpecializations';

export async function GET() {
  await connect();
  try {
    const data = await LawyerSpecializations.find().populate('lawyer_id').populate('specialization_id');
    return NextResponse.json(data);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req:NextRequest) {
  await connect();
  const body = await req.json();
  try {
    const record = new LawyerSpecializations(body);
    await record.save();
    return NextResponse.json(record, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}