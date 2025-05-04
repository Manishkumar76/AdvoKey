// app/api/lawyers/route.ts
import { connect } from '@/dbConfig/dbConfig';
import LawyerProfile from '@/models/LawyerProfile';
import User from '@/models/userModel';
import cloudinary from '@/helpers/cloudinary';
import { NextResponse } from 'next/server';


// Define the structure of a LawyerProfile document to improve type safety
interface LawyerProfileInput {
  userId: string;
  bio: string;
  years_of_experience: number;
  hourly_rate: number;
  level: string;
  proof_documents: File[];
}

export async function POST(request: Request) {
  try {
    await connect();

    const formData = await request.formData();

    const userId = formData.get('userId') as string;
    const bio = formData.get('bio') as string;
    const years_of_experience = parseInt(formData.get('years_of_experience') as string, 10);
    const hourly_rate = parseInt(formData.get('hourly_rate') as string, 10);
    const level = formData.get('level') as string;
    const files = formData.getAll('proof_documents') as File[];

    if (!userId || !bio || isNaN(years_of_experience) || isNaN(hourly_rate) || !level || files.length === 0) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({"_id": userId });
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    const existingProfile = await LawyerProfile.findOne({ user: existingUser._id });
    if (existingProfile) {
      return NextResponse.json({ message: 'User is already registered as a lawyer' }, { status: 400 });
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadUrl = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'lawyer-docs' },
          (error,result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        ).end(buffer);
      });

      uploadedFiles.push(uploadUrl);
    }

    const profile = new LawyerProfile({
      user: existingUser._id,
      bio,
      years_of_experience,
      hourly_rate,
      level,
      proof_documents: uploadedFiles,
      isVerified: false,
    });

    const data = await profile.save();

    return NextResponse.json({ message: 'Application submitted successfully', data }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || 'Failed to submit application' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connect();

    const lawyers = await LawyerProfile.find()
      .populate({
        path: 'user',
        model: 'User',
        select: '_id username phone profile_image_url location_id role isverify'
      })
      .populate({
        path: 'user.location_id',
        model: 'Location',
        select: 'city state country'
      });

    return NextResponse.json(lawyers, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
