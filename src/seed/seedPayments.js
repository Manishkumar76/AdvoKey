import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Payments from '../models/Payments.js';
import Users from '../models/userModel.js';
import Consultations from '../models/Consultations.js';
import ChatSessions from '../models/ChatSessions.js';
import LawyerProfiles from '../models/LawyerProfiles.js';

dotenv.config();

const statuses = ['successful', 'pending', 'failed'];

async function seedPayments() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding payments');

    // Fetch users by role (clients only)
    const clients = await Users.find({ role: 'Client' }).select('_id');
    // Fetch lawyer IDs from LawyerProfiles (the user field)
    const lawyerProfiles = await LawyerProfiles.find().select('user');
    // Fetch consultations and chat sessions
    const consultations = await Consultations.find().select('_id');
    const chatSessions = await ChatSessions.find().select('_id');

    if (
      clients.length === 0 ||
      lawyerProfiles.length === 0 ||
      consultations.length === 0 ||
      chatSessions.length === 0
    ) {
      console.error('❌ Missing required data (clients, lawyerProfiles, consultations, or chatSessions)');
      process.exit(1);
    }

    // Clear existing payments
    await Payments.deleteMany({});
    console.log('🗑️ Cleared existing payments');

    const payments = [];

    for (let i = 0; i < 50; i++) {
      payments.push({
        client_id: clients[i % clients.length]._id,
        lawyer_id: lawyerProfiles[i % lawyerProfiles.length].user,
        consultation_id: consultations[i % consultations.length]._id,
        chat_session_id: chatSessions[i % chatSessions.length]._id,
        amount: 100 + i * 5,
        status: statuses[i % statuses.length],
        transaction_id: `txn_${1000 + i}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 1e10)),
      });
    }

    await Payments.insertMany(payments);
    console.log(`✅ Inserted ${payments.length} payments`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (err) {
    console.error('❌ Seeding payments failed:', err);
    process.exit(1);
  }
}

export default seedPayments;
