import { connect } from '@/dbConfig/dbConfig';
import Consultations from '@/models/Consultations';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: any, { params }: any) {
  await connect();
  try {
    const consult = await Consultations.findById(params.id).populate('client lawyer');
    if (!consult) {
      return NextResponse.json({ error: 'Consultations not found' }, { status: 404 });
    }
    return NextResponse.json(consult);
  } catch (error: any) {
    console.error('GET consultation error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: any) {
  await connect();
  try {
    const updates = await req.json();
    const updated = await Consultations.findByIdAndUpdate(params.id, updates, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Consultations not found for update' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('PUT consultation error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: any, { params }: any) {
  await connect();
  try {
    const deleted = await Consultations.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Consultations not found for deletion' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted' }, { status: 204 });
  } catch (error: any) {
    console.error('DELETE consultation error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
