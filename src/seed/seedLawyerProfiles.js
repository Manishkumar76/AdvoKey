import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LawyerProfiles from '../models/LawyerProfiles.js';
import Specializations from '../models/Specializations.js';
import Users from '../models/userModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seedLawyerProfiles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const lawyerUsers = await Users.find({ role: 'Lawyer' }).select('_id username');
    if (!lawyerUsers.length) {
      console.error('❌ No lawyers found');
      return process.exit(1);
    }

    const specializations = await Specializations.find().select('_id');
    if (!specializations.length) {
      console.error('❌ No specializations found');
      return process.exit(1);
    }

    console.log(`👨‍⚖️ Found ${lawyerUsers.length} lawyers`);
    await LawyerProfiles.deleteMany({});
    console.log('🗑️ Cleared old lawyer profiles');

    const lawyerProfiles = lawyerUsers.map((lawyer, index) => {
      const specialization = specializations[Math.floor(Math.random() * specializations.length)];
      const randomLevel = ['junior', 'mid-level', 'senior'][Math.floor(Math.random() * 3)];
      const randomStatus = ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)];

      return {
        user: lawyer._id,
        bio: `Hello, I'm ${lawyer.username}, a passionate lawyer ready to help.`,
        Office_Address: `12${index + 1} Justice Avenue, Legal City ${index + 1}`,
        education: 'Harvard Law School',
        years_of_experience: 3 + index,
        certifications: ['Bar Council Certified', 'Cyber Law Specialist'],
        Consultation_price: 20 + index * 10,
        availability: ['Monday', 'Wednesday', 'Friday'],
        specialization_id: specialization._id,
        level: randomLevel,
        profile_status: randomStatus,
        proof_documents: ['https://example.com/documents/proof1.pdf'],
        isVerified: Math.random() < 0.7,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 1e10))
      };
    });

    await LawyerProfiles.insertMany(lawyerProfiles);
    console.log(`✅ Inserted ${lawyerProfiles.length} lawyer profiles`);
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

export default seedLawyerProfiles;
