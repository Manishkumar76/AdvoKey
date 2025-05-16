import mongoose from 'mongoose';
import Specialization from '../models/Specialization';
import dotenv from 'dotenv';
dotenv.config();

const specializations = [
  { name: 'Diagnostic radiographer' },
  { name: 'Insurance risk surveyor' },
  // ... add 48 more specializations
];

async function seedSpecializations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding specializations');

    await Specialization.deleteMany({});
    console.log('Deleted existing specializations');

    await Specialization.insertMany(specializations);
    console.log('Inserted specializations data');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seeding specializations failed:', err);
    process.exit(1);
  }
}

seedSpecializations();
