import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Reviews from '@/models/Reviews';

export async function GET() {
  await connect();
  try {
    const reviews = await Reviews.find()
      .populate('client_id', 'username email') // Populate only needed fields
      .populate({
        path: 'lawyer_id',
        populate: {
          path: 'user',
          model: 'Users',
          select: 'username email', // optional
        },
      });

    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req:NextRequest) {
  await connect();
  const body = await req.json();
  try {
    const review = new Reviews(body);
    await review.save();
    return NextResponse.json(review, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}