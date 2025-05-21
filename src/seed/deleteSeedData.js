import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import your models
import Users from '../models/userModel.js';
import LawyerProfiles from '../models/LawyerProfiles.js';
import Consultations from '../models/Consultations.js';
import ChatSessions from '../models/ChatSessions.js';
import Messages from '../models/Messages.js';
import Payments from '../models/Payments.js';
import Reviews from '../models/Reviews.js';
import TimeSlot from '../models/TimeSlot.js';
import LawyerSpecializations from '../models/LawyerSpecializations.js';

async function clearAllData() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete all documents from collections
    await Promise.all([
      Users.deleteMany({}),
      LawyerProfiles.deleteMany({}),
      Consultations.deleteMany({}),
      ChatSessions.deleteMany({}),
      Messages.deleteMany({}),
      Payments.deleteMany({}),
      Reviews.deleteMany({}),
     
      LawyerSpecializations.deleteMany({})
    ]);

    console.log('All collections cleared successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0); // success exit
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1); // failure exit
  }
}

clearAllData();
