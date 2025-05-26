import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultations from '@/models/Consultations';
import ChatSessions from '@/models/ChatSessions';
import { log } from 'console';
import Users from '@/models/userModel';

export async function GET(req: NextRequest) {
  await connect();

  try {
    const consultations = await Consultations.find()
      .populate({
        path: 'lawyer_id',
        model: 'LawyerProfiles',
        populate: {
          path: 'user',
          model: 'Users',
        },
      })
      .populate('client_id') // client_id is directly Users
      .lean();

   return NextResponse.json({ consultations }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connect();
 console.log('POST /consultation called');
  try {
    const body = await req.json();
    const { client_id, lawyer_id, scheduledAt, time, durationMinutes, notes } = body;
    console.log('Request body:', body);
    const clientExists = await Users.findById(client_id);
    const clientOnjectId= clientExists?._id;
    console.log('clientExists:', clientOnjectId);
    const consultation = await Consultations.create({
      client_id: clientExists, // Ensure client_id is valid
      lawyer_id,
      scheduledAt: new Date(scheduledAt),
      time,
      durationMinutes,
      notes,
      status: 'Scheduled',
    });

    await ChatSessions.create({
      consultation_id: consultation._id,
      client_id: client_id,
      lawyer_id,
      is_active: false,
    });

    return NextResponse.json(consultation, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /consultation:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
