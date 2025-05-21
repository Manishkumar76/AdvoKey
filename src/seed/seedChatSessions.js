import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ChatSessions from '../models/ChatSessions.js';
import Consultations from '../models/Consultations.js';
import LawyerProfiles from '../models/LawyerProfiles.js';
import Users from '../models/userModel.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function seedChatSessions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch data
    const lawyerProfiles = await LawyerProfiles.find().select('user'); // lawyer_id = user
    const clients = await Users.find({ role: 'Client' }).select('_id');
    const consultations = await Consultations.find().select('_id lawyer_id client_id');

    if (lawyerProfiles.length === 0 || clients.length === 0 || consultations.length === 0) {
      console.error('❌ Not enough data in LawyerProfiles, Client Users, or Consultations');
      return process.exit(1);
    }

    // Optional: Clear existing chat sessions
    await ChatSessions.deleteMany({});
    console.log('🗑️ Cleared existing ChatSessions records');

    // Seed 50 chat sessions
    const chatSessions = [];

    for (let i = 0; i < 50; i++) {
      const consultation = consultations[Math.floor(Math.random() * consultations.length)];

      const startTime = new Date(Date.now() - Math.floor(Math.random() * 1e10));
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

      chatSessions.push({
        consultation_id: consultation._id,
        client_id: consultation.client_id,
        lawyer_id: consultation.lawyer_id,
        start_time: startTime,
        end_time: endTime,
        is_active: i % 2 === 0,
        createdAt: startTime,
      });
    }

    await ChatSessions.insertMany(chatSessions);
    console.log(`✅ Inserted ${chatSessions.length} chat sessions`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (err) {
    console.error('❌ Seeding chat sessions failed:', err);
    process.exit(1);
  }
}

export default seedChatSessions;
