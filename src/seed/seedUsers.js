// seed/seedUsers.js
import mongoose from "mongoose";
import User from "@/lib/models/User";
import connectDB from "@/lib/mongoose";
import faker from "faker";

export const seedUsers = async () => {
  await connectDB();
  await User.deleteMany();

  const users = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      fullName: faker.name.findName(),
      password: "hashed_password", // Replace with actual hash logic
      age: faker.datatype.number({ min: 20, max: 60 }),
      role: i % 2 === 0 ? "Client" : "Lawyer",
      isverify: faker.datatype.boolean(),
    });
  }

  await User.insertMany(users);
  console.log("✅ Users seeded.");
};
