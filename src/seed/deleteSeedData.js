import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import your models
import User from '../models/userModel.js';
import LawyerProfile from '../models/LawyerProfile.js';
import Consultation from '../models/Consultation.js';
import ChatSession from '../models/ChatSession.js';
import Message from '../models/Message.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';
import TimeSlot from '../models/TimeSlot.js';
import LawyerSpecialization from '../models/LawyerSpecialization.js';

async function clearAllData() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete all documents from collections
    await Promise.all([
      User.deleteMany({}),
      LawyerProfile.deleteMany({}),
      Consultation.deleteMany({}),
      ChatSession.deleteMany({}),
      Message.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
     
      LawyerSpecialization.deleteMany({})
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
