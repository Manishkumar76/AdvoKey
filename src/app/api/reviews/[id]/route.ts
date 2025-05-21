import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Reviews from '@/models/Reviews';

export async function DELETE(_: NextRequest,  params :any) {
  await connect();
  try {
    const Id=  params.params.id;
    const deleted = await Reviews.findByIdAndDelete(Id);
    if (!deleted) {
      return NextResponse.json({ error: 'Reviews not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Reviews deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
