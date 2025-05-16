import mongoose from 'mongoose';
import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding users');

    const roles = ['Client', 'Lawyer', 'Admin'];
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Helen', 'Ian', 'Jane'];
    const users = [];

    for (let i = 1; i <= 50; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const name = names[Math.floor(Math.random() * names.length)];

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash("Pa$$w0rd!", salt);

      users.push({
        _id: new mongoose.Types.ObjectId(),
        username: `${name.toLowerCase()}${i}`,
        email: `${name.toLowerCase()}${i}@example.com`,
        password: hashedPassword,
        role,
        isAdmin: role === 'Admin',  // Set true only if role is Admin
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1e10)),
      });
    }

    await User.deleteMany({}); // Optional: clear existing users before seeding
    await User.insertMany(users);
    console.log('Inserted users data');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (err) {
    console.error('Seeding users failed:', err);
    process.exit(1);
  }
}

export default seedUsers;
