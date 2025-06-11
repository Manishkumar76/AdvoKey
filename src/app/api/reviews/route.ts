import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Reviews from '@/models/Reviews';
import LawyerProfiles from '@/models/LawyerProfiles';
import { l } from 'node_modules/framer-motion/dist/types.d-DDSxwf0n';

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
  // Validate required fields
  if (!body.lawyer_id || !body.client_id || !body.rating || !body.comment) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Ensure rating is a number between 1 and 5
  if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
  }
  // Ensure comment is a string
  if (typeof body.comment !== 'string' || body.comment.trim() === '') {
    return NextResponse.json({ error: 'Comment must be a non-empty string' }, { status: 400 });
  }
// Ensure client_id and lawyer_id are valid ObjectId strings
  if (typeof body.client_id !== 'string' || typeof body.lawyer_id !== 'string') {
    return NextResponse.json({ error: 'Invalid client_id or lawyer_id' }, { status: 400 });
  }
  
  const { client_id, lawyer_id } = body;

  // Check if client_id and lawyer_id are not the same
  if (client_id === lawyer_id) {
    return NextResponse.json({ error: 'Client and lawyer cannot be the same' }, { status: 400 });
  }
  // Check if the review already exists for this client and lawyer
    const lawyer =await LawyerProfiles.findById(lawyer_id); 
    if(lawyer === null){
      return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });}
        const review = new Reviews(body);
    await review.save();
    return NextResponse.json(review, { status: 201 });
}