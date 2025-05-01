import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Review from '@/models/Review';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connect();
  try {
    const deleted = await Review.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
