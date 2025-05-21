// seedLocations.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Locations from '../models/Locations.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function seedLocations() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Sample cities, states, and country: India
    const locations = [
      { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
      { city: 'Pune', state: 'Maharashtra', country: 'India' },
      { city: 'Delhi', state: 'Delhi', country: 'India' },
      { city: 'Bangalore', state: 'Karnataka', country: 'India' },
      { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
      { city: 'Hyderabad', state: 'Telangana', country: 'India' },
      { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
      { city: 'Kolkata', state: 'West Bengal', country: 'India' },
      { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
      { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
      { city: 'Patna', state: 'Bihar', country: 'India' },
      { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India' },
      { city: 'Chandigarh', state: 'Punjab', country: 'India' },
      { city: 'Dehradun', state: 'Uttarakhand', country: 'India' },
      { city: 'Shimla', state: 'Himachal Pradesh', country: 'India' }
    ];

    // Optional: Clear existing locations
    await Locations.deleteMany({});
    console.log('🗑️ Cleared existing Locations records');

    // Insert new locations
    await Locations.insertMany(locations);
    console.log(`✅ Inserted ${locations.length} locations`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (err) {
    console.error('❌ Seeding locations failed:', err);
    process.exit(1);
  }
}


 export default seedLocations;
