// app/api/users/[id]/upload-profile-picture/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import fs from 'fs';
import User from '@/models/userModel';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


// Disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest,  params : any) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId =   params.params.id;
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = tmpdir();
    const tempFilePath = path.join(tempDir, `${randomUUID()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'image',
      folder: 'profile_pictures',
      public_id: `user_${userId}`,
      overwrite: true,
    });

    // Clean up
    fs.unlinkSync(tempFilePath);

    //update user profile picture in database
    
    // Assuming you have a User model and a function to update the user
    const Response = await User.findByIdAndUpdate(userId, { profile_image_url: result.secure_url.toString() });

    return NextResponse.json({ url: Response.profile_image_url }, { status: 200 });

  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
