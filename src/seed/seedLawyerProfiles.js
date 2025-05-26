import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LawyerProfiles from '../models/LawyerProfiles.js';
import Specializations from '../models/Specializations.js';
import Users from '../models/userModel.js';
dotenv.config();

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI;




// Seeder function
async function seedLawyerProfiles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch lawyers
    const lawyerUsers = await Users.find({ role: 'Lawyer' }).select('_id');
    if (!lawyerUsers.length) {
      console.error('❌ No lawyers found');
      return process.exit(1);
    }

    // Fetch specializations
    const specializations = await Specializations.find().select('_id');
    if (!specializations.length) {
      console.error('❌ No specializations found');
      return process.exit(1);
    }

    console.log(`👨‍⚖️ Found ${lawyerUsers.length} lawyers`);

    // Delete existing profiles
    await LawyerProfiles.deleteMany({});
    console.log('🗑️ Cleared old lawyer profiles');

    // Create new profiles
    const lawyerProfiles = lawyerUsers.map((lawyer, index) => ({
      user: lawyer._id,
      bio:`${lawyer.username} `,
      years_of_experience: 4 + index,
      Office_Address: `123${index + 1} Legal St, City${index + 1}`,
      education: 'Harvard Law School',
      certifications: ['Bar Association Certificate', 'Certified Mediator'],
      languages: ['English', 'Spanish'],
      hourly_rate: 150 + index,
      level :['junior', 'mid-level', 'senior'][Math.floor(Math.random()*3)],
      profile_Status:['pending', 'approved', 'rejected'][Math.floor(Math.random()*3)],
      isVerified: Math.random() < 0.5,
      availability: ['Monday', 'Wednesday', 'Friday'],
      proof_documents:[""],
      specialization_id:
      specializations[index % specializations.length]._id,

      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1e10)),
    }));

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
