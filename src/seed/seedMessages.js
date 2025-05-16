import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from '../models/Message.js';
import ChatSession from '../models/ChatSession.js';
import User from '../models/userModel.js';

dotenv.config();

const sampleTexts = [
  'Hello, I need legal advice regarding my case.',
  'Sure, I am here to help you.',
  'Can we schedule a consultation?',
  'Yes, please choose a suitable time slot.',
  'Thank you for your assistance!',
];

async function seedMessages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding messages');

    // Fetch some chat sessions and users to assign realistic IDs
    const chats = await ChatSession.find().limit(50).select('_id client_id lawyer_id');
    const users = await User.find().limit(50).select('_id');

    if (chats.length === 0 || users.length === 0) {
      console.error('❌ No chat sessions or users found to link messages');
      process.exit(1);
    }

    // Clear existing messages
    await Message.deleteMany({});
    console.log('🗑️ Cleared existing messages');

    const messages = [];

    for (let i = 0; i < 50; i++) {
      const chat = chats[i % chats.length];
      // randomly select sender and receiver between client and lawyer for chat
      const senderId = i % 2 === 0 ? chat.client_id : chat.lawyer_id;
      const receiverId = i % 2 === 0 ? chat.lawyer_id : chat.client_id;

      messages.push({
        chatId: chat._id,
        senderId,
        receiverId,
        text: sampleTexts[i % sampleTexts.length],
        isRead: i % 2 === 0,
        content: 'text',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 1e10)),
      });
    }

    await Message.insertMany(messages);
    console.log(`✅ Inserted ${messages.length} messages`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (err) {
    console.error('❌ Seeding messages failed:', err);
    process.exit(1);
  }
}

export default seedMessages;
