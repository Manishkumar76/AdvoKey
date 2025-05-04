import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultation from '@/models/Consultation';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function GET(req: NextRequest) {
  await connect();

  try {
    const consultations = await Consultation.find()
      .populate({
        path: 'client_id'
      })
      .populate({
        path: 'lawyer_id',
        populate: { path: 'user' },
      });

    return NextResponse.json({ data: consultations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connect();
  try {
    const userId = await getDataFromToken();
    const body = await req.json();
    const { lawyer_id, scheduledAt, time, durationMinutes, notes } = body;

    if (!lawyer_id || !scheduledAt || !time || !durationMinutes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const consultation = new Consultation({
      client_id: userId,
      lawyer_id,
      scheduledAt: new Date(scheduledAt),
      time,
      durationMinutes,
      notes,
    });

    await consultation.save();

    return NextResponse.json(consultation, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /consultation:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
