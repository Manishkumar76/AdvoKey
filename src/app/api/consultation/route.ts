import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultations from '@/models/Consultations';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import ChatSessions from '@/models/ChatSessions';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await connect();

  try {
    const userId = (await getDataFromToken()).id; 

    const consultations = await Consultations.find()
      .populate('client_id')
      .populate({
        path: 'lawyer_id',
        model: 'LawyerProfiles',
        populate: { path: 'user', model: 'Users' },
      })
      .lean();

    const userConsultations = consultations.filter(
      (consultation) => consultation.client_id?._id?.toString() === userId
    );

    return NextResponse.json({ consultations, userConsultations }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  await connect();
  try {
   
    const body = await req.json();
    const {user_id, lawyer_id, scheduledAt, time, durationMinutes, notes } = body;
     
    if (!lawyer_id || !scheduledAt || !time || !durationMinutes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const consultation = new Consultations({
      client_id: user_id,
      lawyer_id,
      scheduledAt: new Date(scheduledAt),
      time,
      durationMinutes,
      notes,
    });

    await consultation.save();
    

    const session= new ChatSessions({
      consultation_id:consultation._id,
      client_id: user_id,
      lawyer_id,
      is_active:false
    })

     await session.save();
     
    return NextResponse.json(consultation, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /consultation:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
