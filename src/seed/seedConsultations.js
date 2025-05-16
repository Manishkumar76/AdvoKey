import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Consultation from '../models/Consultation.js';
import User from '../models/userModel.js';
import LawyerProfile from '../models/LawyerProfile.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function seedConsultations() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch existing clients and lawyers
    const clients = await User.find({ role: 'Client' }).select('_id');
    const lawyers = await LawyerProfile.find().select('user');

    if (clients.length === 0 || lawyers.length === 0) {
      console.error('❌ Not enough clients or lawyers to create consultations');
      return process.exit(1);
    }

    // Optional: Clear existing consultations
    await Consultation.deleteMany({});
    console.log('🗑️ Cleared existing Consultation records');

    // Create 50 consultation documents
    const consultations = [];
    const statuses = ['Scheduled', 'Completed', 'Cancelled']; // match enum

    for (let i = 1; i <= 50; i++) {
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      const randomLawyer = lawyers[Math.floor(Math.random() * lawyers.length)];

      const scheduledAt = new Date(Date.now() + i * 3600 * 1000); // future time
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * 1e10));

      consultations.push({
        client_id: randomClient._id,
        lawyer_id: randomLawyer._id, // `user` from LawyerProfile
        scheduledAt,
        time: `${9 + (i % 8)}:00 AM`,
        durationMinutes: 60,
        status: statuses[i % statuses.length],
        notes: `Consultation notes ${i}`,
        createdAt,
      });
    }

    await Consultation.insertMany(consultations);
    console.log(`✅ Inserted ${consultations.length} consultations`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (err) {
    console.error('❌ Seeding consultations failed:', err);
    process.exit(1);
  }
}

export default seedConsultations;
