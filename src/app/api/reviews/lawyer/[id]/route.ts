import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Reviews from '@/models/Reviews';

export async function GET(req: NextRequest, context: any) {
  await connect();
    const { id } = context.params; // Extract lawyer ID from request parameters
  try {
    const reviews = await Reviews.find({'lawyer_id': id }) // Replace with actual lawyer ID
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