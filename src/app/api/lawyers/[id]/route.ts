import { connect } from '@/dbConfig/dbConfig';
import LawyerProfiles from '@/models/LawyerProfiles';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: any
) {
  await connect();
  try {
    const { id } = context.params;
    const lawyer = await LawyerProfiles.findById(id)
      .populate({ path: 'user', model: 'Users' })
      .populate({path:'specialization_id',model:'Specializations'});

    if (!lawyer) {
      return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    return NextResponse.json({ data: lawyer }, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: any
) {
  await connect();
  try {
    const { id } = context.params;
    const data = await req.json();

    // Find lawyer by ID and update with new data, return the new document
    const updated = await LawyerProfiles.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Lawyer not found for update' }, { status: 404 });
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  await connect();
  try {
    const { id } = context.params;
    const deleted = await LawyerProfiles.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Lawyer not found for deletion' }, { status: 404 });
    }

    // 204 No Content with empty response body
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
