import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ChatSession from '@/models/ChatSession';
import LawyerProfile from '@/models/LawyerProfile';
import User from '@/models/userModel';
import Message from '@/models/Message';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connect();
  const userId = await getDataFromToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const chat = await ChatSession.findOne({ _id: params.id, client_id: userId });
  if (!chat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await Message.deleteMany({ chat_session_id: chat._id });
  await ChatSession.deleteOne({ _id: chat._id });

  return NextResponse.json({ success: true });
}
