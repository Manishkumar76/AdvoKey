import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultation from '@/models/Consultation';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function GET() {
  await connect();
  try {
    const consultations = await Consultation.find()
      .populate('client_id')
      .populate('lawyer_id')
      .populate('timeslot_id');

    return NextResponse.json(consultations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connect();

  try {
    const userId = await getDataFromToken(); // Securely extract user id from token
    const body = await req.json();

    const { lawyer_id, scheduledAt, durationMinutes, notes } = body;

    // ✅ Validate fields
    if (!lawyer_id || !scheduledAt || !durationMinutes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const consultation = new Consultation({
      client_id: userId,
      lawyer_id,
      scheduledAt,
      durationMinutes,
      notes,
    });

    await consultation.save();

    return NextResponse.json(consultation, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /consultations:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
