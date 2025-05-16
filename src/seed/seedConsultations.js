import mongoose from 'mongoose';
import Consultation from '../models/Consultation';
import dotenv from 'dotenv';
dotenv.config();

const consultations = [
  {
    client_id: '9aad1626-d061-444a-aae6-e84775e967a3',
    lawyer_id: '56198c12-90b5-4d40-b980-ee8cf5da9c7f',
    scheduledAt: new Date('2025-06-15T11:59:28Z'),
    time: '22:41:12',
    durationMinutes: 90,
    notes: 'Leave impact move job lot.',
    status: 'Completed',
  },
  {
    client_id: '0bc9e19d-75b5-4ac7-a855-fe546cafe919',
    lawyer_id: '086cc025-fbb4-4c18-b8e9-9a3868ca5d68',
    scheduledAt: new Date('2025-06-14T05:15:33Z'),
    time: '05:27:16',
    durationMinutes: 60,
    notes: 'Appear indeed themselves.',
    status: 'Cancelled',
  },
  // ... add 48 more consultations
];

async function seedConsultations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding consultations');

    await Consultation.deleteMany({});
    console.log('Deleted existing consultations');

    await Consultation.insertMany(consultations);
    console.log('Inserted consultations data');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seeding consultations failed:', err);
    process.exit(1);
  }
}

seedConsultations();
