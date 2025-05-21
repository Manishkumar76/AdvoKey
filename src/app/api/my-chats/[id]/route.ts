import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ChatSessions from '@/models/ChatSessions';
import LawyerProfiles from '@/models/LawyerProfiles';
import Users from '@/models/userModel';
import Messages from '@/models/Messages';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function DELETE(req: Request, { params }:any) {
  await connect();
  const userId = await getDataFromToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const chat = await ChatSessions.findOne({ _id: params.id, client_id: userId });
  if (!chat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await Messages.deleteMany({ chat_session_id: chat._id });
  await ChatSessions.deleteOne({ _id: chat._id });

  return NextResponse.json({ success: true });
}
