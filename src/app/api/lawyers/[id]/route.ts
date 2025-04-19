// /src/app/api/lawyers/[id]/route.ts

import { connect } from '@/dbConfig/dbConfig';
import LawyerProfile from '@/models/LawyerProfile';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connect();

  try {
    const { id } = await context.params;
    const lawyer = await LawyerProfile.findById(id).populate('user');

    if (!lawyer) {
      return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    return NextResponse.json({ data: lawyer }, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
  ) {
    await connect();
    try {
      const { id } = context.params;
      const body = await req.json();
      const updated = await LawyerProfile.findByIdAndUpdate(id, body, { new: true });
  
      if (!updated) {
        return NextResponse.json({ error: 'Lawyer not found for update' }, { status: 404 });
      }
  
      return NextResponse.json(updated);
    } catch (error: any) {
      console.error('PUT error:', error);
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
  }
  
  export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
  ) {
    await connect();
    try {
      const { id } = context.params;
      const deleted = await LawyerProfile.findByIdAndDelete(id);
  
      if (!deleted) {
        return NextResponse.json({ error: 'Lawyer not found for deletion' }, { status: 404 });
      }
  
      return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      console.error('DELETE error:', error);
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
  }
  