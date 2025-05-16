// seed/seedLawyerProfiles.js
import LawyerProfile from "@/lib/models/LawyerProfile";
import User from "@/lib/models/User";
import faker from "faker";

export const seedLawyerProfiles = async () => {
  await LawyerProfile.deleteMany();

  const lawyers = await User.find({ role: "Lawyer" }).limit(50);
  const profiles = [];

  for (const lawyer of lawyers) {
    profiles.push({
      user: lawyer._id,
      bio: faker.lorem.sentence(),
      years_of_experience: faker.datatype.number({ min: 1, max: 20 }),
      hourly_rate: faker.datatype.number({ min: 50, max: 300 }),
      level: faker.random.arrayElement(["junior", "mid-level", "senior"]),
      profile_status: "approved",
      proof_documents: [faker.image.imageUrl()],
      isVerified: true,
    });
  }

  await LawyerProfile.insertMany(profiles);
  console.log("✅ Lawyer Profiles seeded.");
};
