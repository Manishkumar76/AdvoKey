import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LawyerProfile from '../models/LawyerProfile.js';
import User from '../models/userModel.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function seedLawyerProfiles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users with role: "Lawyer"
    const lawyerUsers = await User.find({ role: 'Lawyer' }).select('_id');
    if (lawyerUsers.length === 0) {
      console.error('❌ No lawyers found in the database');
      return process.exit(1);
    }

    console.log(`👨‍⚖️ Found ${lawyerUsers.length} lawyer users`);

    // Clear existing profiles
    await LawyerProfile.deleteMany({});
    console.log('🗑️ Cleared existing LawyerProfile records');

    // Create a unique profile for each lawyer
    const lawyerProfiles = lawyerUsers.map((lawyer, index) => ({
      user: lawyer._id,
      address: `123${index + 1} Legal St, City${index + 1}`,
      education: 'Harvard Law School',
      certifications: ['Bar Association Certificate', 'Certified Mediator'],
      languages: ['English', 'Spanish'],
      hourly_rate: 150 + index,
      isVerified: Math.random() < 0.5, // Random true/false
      availability: ['Monday', 'Wednesday', 'Friday'],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1e10)),
    }));

    await LawyerProfile.insertMany(lawyerProfiles);
    console.log(`✅ Inserted ${lawyerProfiles.length} unique lawyer profiles`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (err) {
    console.error('❌ Seeding lawyer profiles failed:', err);
    process.exit(1);
  }
}

export default seedLawyerProfiles;
