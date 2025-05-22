import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI;

// Define User model
const userSchema = new mongoose.Schema({
  role: String,
});
const Users = mongoose.model('Users', userSchema, 'users');

// Define Specialization model
const specializationSchema = new mongoose.Schema({});
const Specializations = mongoose.model('Specializations', specializationSchema, 'specializations');

// Define Lawyer Profile model
const lawyerProfileSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  address: String,
  education: String,
  certifications: [String],
  languages: [String],
  hourly_rate: Number,
  isVerified: Boolean,
  availability: [String],
  specialization_id: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
});
const LawyerProfiles = mongoose.model('LawyerProfiles', lawyerProfileSchema, 'lawyerprofiles');

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
      address: `123${index + 1} Legal St, City${index + 1}`,
      education: 'Harvard Law School',
      certifications: ['Bar Association Certificate', 'Certified Mediator'],
      languages: ['English', 'Spanish'],
      hourly_rate: 150 + index,
      isVerified: Math.random() < 0.5,
      availability: ['Monday', 'Wednesday', 'Friday'],
      specialization_id:
        specializations[Math.floor(Math.random() * specializations.length)]._id,
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

seedLawyerProfiles();
