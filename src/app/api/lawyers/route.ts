import { connect } from '@/dbConfig/dbConfig';
import LawyerProfile from '@/models/LawyerProfile';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

// GET all lawyers with populated user info and location data
export async function GET() {
    try {
        await connect();

        // Fetch all lawyers and populate user and location details
        const lawyers = await LawyerProfile.find()
            .populate({
                path: 'user', // Reference to the User model
                model: 'User', // Populate user data
                select: 'username email phone profile_image_url location_id role isverify' // Select required user fields
            })
            .populate({
                path: 'user.location_id', // Reference to the Location model
                model: 'Location', // Populate location data
                select: 'city state country' // Select required location fields
            });
            console.log(lawyers[0]?.years_of_experience); // Example of accessing populated data

        // Return the lawyer profiles along with user and location details
        return NextResponse.json(lawyers, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Register new lawyer and profile
export async function POST(request: NextRequest) {
    try {
        await connect();
        const reqBody = await request.json();
        const { username, email, password, phone, profile_image_url, location_id, bio, years_of_experience, hourly_rate, level, proof_documents } = reqBody;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user with role: Lawyer
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            profile_image_url,
            location_id,
            role: 'Lawyer'
        });

        const savedUser = await newUser.save();

        // Create Lawyer Profile
        const newProfile = new LawyerProfile({
            lawyer_id: savedUser._id,
            bio,
            years_of_experience,
            hourly_rate,
            level,
            proof_documents,
        });

        const savedProfile = await newProfile.save();

        // Return the created profile along with user and location details
        const populatedProfile = await LawyerProfile.findById(savedProfile._id)
            .populate({
                path: 'lawyer_id',
                select: 'username email phone profile_image_url location_id role isverify'
            })
            .populate({
                path: 'lawyer_id.location_id',
                model: 'Location',
                select: 'city state country'
            });

        return NextResponse.json(populatedProfile, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to create lawyer profile' }, { status: 500 });
    }
}
