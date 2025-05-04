// app/api/chat/list/route.ts
import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ChatSession from '@/models/ChatSession';
import LawyerProfile from '@/models/LawyerProfile';
import User from '@/models/userModel';
import Message from '@/models/Message';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function GET() {
  await connect();

  const userId = await getDataFromToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const chats = await ChatSession.find({ client_id: userId })
    .populate({
      path: 'lawyer_id',
      populate: { path: 'user', model: User },
    })
    .sort({ created_at: -1 })
    .lean(); // Convert to plain JS objects for modification

  // Attach last message to each chat
  const chatsWithLastMessage = await Promise.all(
    chats.map(async (chat: any) => {
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({ timestamp: -1 })
        .lean();

      return {
        ...chat,
        lastMessage: lastMessage || null,
      };
    })
  );

  return NextResponse.json(chatsWithLastMessage);
}
