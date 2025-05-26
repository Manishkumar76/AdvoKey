import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultations from '@/models/Consultations';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import LawyerProfiles from '@/models/LawyerProfiles';

export async function GET() {
    await connect();

    const userId = (await getDataFromToken()).id; // Securely extract user id from token
    console.log(userId);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
     const Lawyer= await LawyerProfiles.findOne({ user: userId });
    try {
        const consultations = await Consultations.find({ 'lawyer_id': Lawyer?._id })
            .populate({
                path: 'lawyer_id',
                model: 'LawyerProfiles',
            }).
            populate({
                path: 'client_id',
                model: 'Users',
            })
            .sort({ scheduledAt: -1 });

        return NextResponse.json(consultations);
    } catch (error: any) {
        console.error('GET consultations error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}