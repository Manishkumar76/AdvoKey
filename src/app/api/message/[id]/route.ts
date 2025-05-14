// /pages/api/messages/[chatId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '@/dbConfig/dbConfig';
import Message from '@/models/Message';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid chatId' });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Fetch all messages in this chat
        const messages = await Message.find({ id }).sort({ timestamp: 1 });
        return res.status(200).json(messages);

      case 'POST':
        // Create a new message
        const { senderId, receiverId, text, content } = req.body;

        if (!senderId || !receiverId || !text) {
          return res.status(400).json({ error: 'senderId, receiverId, and text are required' });
        }

        const newMessage = await Message.create({
          id,
          senderId,
          receiverId,
          text,
          content,
        });

        return res.status(201).json(newMessage);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Message API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
