import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Specialization from '../models/Specialization.js';

dotenv.config();

const baseTitles = [
  'Advisor', 'Specialist', 'Consultant', 'Analyst', 'Officer',
  'Manager', 'Representative', 'Strategist', 'Advocate', 'Technician'
];

const topics = [
  'Cybersecurity', 'Family Law', 'Criminal Law', 'Property Law', 'Insurance',
  'Immigration', 'Corporate Law', 'Environmental Law', 'Intellectual Property', 'Taxation'
];

const specializations = [];
const generated = new Set();

while (specializations.length < 50) {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const title = baseTitles[Math.floor(Math.random() * baseTitles.length)];
  const name = `${topic} ${title}`;

  if (!generated.has(name)) {
    specializations.push({ name });
    generated.add(name);
  }
}

async function seedSpecializations() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding specializations');

    await Specialization.deleteMany({});
    console.log('🗑️ Deleted existing specializations');

    await Specialization.insertMany(specializations);
    console.log(`✅ Inserted ${specializations.length} specializations`);

   
  } catch (err) {
    console.error('❌ Seeding specializations failed:', err);
    process.exit(1);
  }
}

export default seedSpecializations;
