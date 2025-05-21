import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reviews from '../models/Reviews.js';
import Users from '../models/userModel.js';
import LawyerProfiles from '../models/LawyerProfiles.js';

dotenv.config();

const comments = [
  'Excellent service and very professional.',
  'Highly recommend this lawyer!',
  'Helped me a lot with my case.',
  'Good experience overall.',
  'Very knowledgeable and responsive.',
];

async function seedReviews() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding reviews');

    // Get clients and lawyers (lawyer ids come from LawyerProfiles.user)
    const clients = await Users.find({ role: 'Client' }).select('_id');
    const lawyerProfiles = await LawyerProfiles.find().select('user');

    if (clients.length === 0 || lawyerProfiles.length === 0) {
      console.error('❌ Missing clients or lawyers');
      process.exit(1);
    }

    // Clear existing reviews
    await Reviews.deleteMany({});
    console.log('🗑️ Cleared existing reviews');

    const reviews = [];
    for (let i = 0; i < 50; i++) {
      reviews.push({
        client_id: clients[i % clients.length]._id,
        lawyer_id: lawyerProfiles[i % lawyerProfiles.length]._id,
        rating: (i % 5) + 1,
        comment: comments[i % comments.length],
        created_at: new Date(Date.now() - Math.floor(Math.random() * 1e10)),
      });
    }

    await Reviews.insertMany(reviews);
    console.log(`✅ Inserted ${reviews.length} reviews`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (err) {
    console.error('❌ Seeding reviews failed:', err);
    process.exit(1);
  }
}

export default seedReviews;
