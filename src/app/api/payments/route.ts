import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Payment from '@/models/Payment';

export async function GET() {
  await connect();
  try {
    const payments = await Payment.find()
      .populate('client_id')
      .populate('lawyer_id')
      .populate('consultation_id')
      .populate('chat_session_id');
    return NextResponse.json( payments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connect();
  try {
    const body = await req.json();
    const payment = new Payment(body);
    await payment.save();
    return NextResponse.json({ data: payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
