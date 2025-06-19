import mongoose from 'mongoose';
import Users from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seedUserss() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding users');

    const roles = ['Client', 'Lawyer', 'Admin'];
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Helen', 'Ian', 'Jane'];
    const users = [];
    const profileImages= ['https://cdn.britannica.com/21/218221-050-A433E4F0/American-actress-Jennifer-Garner-2018.jpg','https://ca-times.brightspotcdn.com/dims4/default/c2fa21a/2147483647/strip/true/crop/2301x3000+0+0/resize/1200x1565!/quality/80/?url=https:%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fa0%2Fde%2F57fb935c45628d2a016eb493947b%2F5th-annual-instyle-awards-91097.jpg','https://www.slashfilm.com/img/gallery/john-wick-3-was-written-around-keanu-reeves-cool-scene-wishlist/l-intro-1677623749.jpg','https://ntvb.tmsimg.com/assets/assets/614815_v9_bb.jpg','https://static0.colliderimages.com/wordpress/wp-content/uploads/2015/04/stan-lee-image-safe.jpg','https://actorsareidiots.com/wp-content/uploads/2020/06/CillianMurphy.jpg','https://fr.web.img6.acsta.net/pictures/19/03/20/21/39/2037843.jpg','https://www.nme.com/wp-content/uploads/2019/06/Webp.net-resizeimage-5-7.jpg','https://i0.wp.com/nickmonroe.blog/wp-content/uploads/2017/11/Amber-Anderson.png?ssl=1','https://tse3.mm.bing.net/th/id/OIP.FJl_yoWfgD6CBA39x39k-QAAAA?rs=1&pid=ImgDetMain',]

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
        profile_image_url: profileImages[Math.floor(Math.random() * profileImages.length)],
        role,
        isAdmin: role === 'Admin',  // Set true only if role is Admin
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1e10)),
      });
    }

    await Users.deleteMany({}); // Optional: clear existing users before seeding
    await Users.insertMany(users);
    console.log('Inserted users data');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (err) {
    console.error('Seeding users failed:', err);
    process.exit(1);
  }
}

export default seedUserss;
