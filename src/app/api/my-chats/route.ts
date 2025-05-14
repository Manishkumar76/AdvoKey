// app/api/chat/list/route.ts
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import ChatSession from "@/models/ChatSession";
import Message from "@/models/Message";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const userId = (await getDataFromToken()).id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chats = await ChatSession.find({ client_id: userId })
      .populate({
        path: 'lawyer_id',
        populate: { path: 'user', model: User },
      })
      .populate('consultation_id') // fix spelling here too
      .sort({ created_at: -1 })
      .lean();

    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat: any) => {
        try {
          const lastMsg = await Message.findOne({ chatId: chat._id })
            .sort({ timestamp: -1 })
            .lean() as { content?: string }; // ✅ explicitly cast the expected shape


          return {
            ...chat,
            lastMessage: lastMsg?.content || '',
          };
        } catch (err) {
          console.error('Error fetching last message for chat:', chat._id, err);
          return {
            ...chat,
            lastMessage: '',
          };
        }
      })
    );

    return NextResponse.json(chatsWithLastMessage, { status: 200 });
  } catch (err) {
    console.error('API /api/my-chats failed:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
