import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Message from '@/models/Message';

export async function GET() {
  await connect();
  try {
    const messages = await Message.find()
      .populate('chat_session_id')
      .populate('sender_id');
    return NextResponse.json({ data: messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connect();
  try {
    const body = await req.json();
    const msg = new Message(body);
    await msg.save();
    return NextResponse.json({ data: msg }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
