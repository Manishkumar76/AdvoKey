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
   

    const consultations = await Consultations.find()
      .populate('client_id')
      .populate({
        path: 'lawyer_id',
        model: 'LawyerProfiles',
      })
      .lean();

    

    return NextResponse.json(consultations, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



