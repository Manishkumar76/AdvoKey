import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultation from '@/models/Consultation';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import ChatSession from '@/models/ChatSession';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await connect();

  try {
   

    const consultations = await Consultation.find()
      .populate('client_id')
      .populate({
        path: 'lawyer_id',
        model: 'LawyerProfile',
        populate: { path: 'user', model: 'User' },
      })
      .lean();

    

    return NextResponse.json(consultations, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



