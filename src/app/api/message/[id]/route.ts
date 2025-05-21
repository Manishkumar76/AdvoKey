// src/app/api/message/[id]/route.ts
import { connect } from '@/dbConfig/dbConfig';
import Messages from '@/models/Messages';
import { NextRequest, NextResponse } from 'next/server';

// GET messages for chatId
export async function GET(req: NextRequest, { params }: any) {
  await connect();

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid chatId' }, { status: 400 });
  }

  try {
    const messages = await Messages.find({ id }).sort({ timestamp: 1 });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('GET messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST a new message
export async function POST(req: NextRequest, { params }:any) {
  await connect();

  const { id } = params;
  const body = await req.json();

  const { senderId, receiverId, text, content } = body;

  if (!senderId || !receiverId || !text) {
    return NextResponse.json({ error: 'senderId, receiverId, and text are required' }, { status: 400 });
  }

  try {
    const newMessage = await Messages.create({
      id,
      senderId,
      receiverId,
      text,
      content,
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('POST message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
