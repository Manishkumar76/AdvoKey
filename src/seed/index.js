import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import seedUsers from './seedUsers.js';
import seedLawyerProfiles from './seedLawyerProfiles.js';
import seedConsultations from './seedConsultations.js';
import seedChatSessions from './seedChatSessions.js';
import seedMessages from './seedMessages.js';
import seedPayments from './seedPayments.js';
import seedReviews from './seedReviews.js';

import seedSpecializations from './seedLawyerSpecializations.js';
import seedLocations from './seedLocations.js';

async function main() {
  try {
    console.log('Starting database seeding...');

    // Connect once for all seeders
    await mongoose.connect(process.env.MONGO_URI.toString());
    console.log('Connected to MongoDB');

    // Run each seeder
    await seedUsers();
    await seedLocations();
    await seedSpecializations();
    await seedLawyerProfiles();
    await seedConsultations();
    await seedChatSessions();
    await seedMessages();
    await seedPayments();
    await seedReviews();
    
    

    // Disconnect after all seeders finish
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
