import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Reviews from '@/models/Reviews';

export async function GET(req: NextRequest, context: any) {
  await connect();
    const { id } = context.params; 
  try {
    const reviews = await Reviews.find({'lawyer_id': id }) 
      .populate('client_id', 'username email') 
      .populate({
        path: 'lawyer_id',
        populate: {
          path: 'user',
          model: 'Users',
          select: 'username email', // optional
        },
      });

      //claculate average rating
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return NextResponse.json({reviews, averageRating: totalReviews > 0 ? totalRating / totalReviews : 0 }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}