import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultation from '@/models/Consultation';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function GET() {
    await connect();

    const userId = (await getDataFromToken()).id; // Securely extract user id from token
    console.log(userId);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const consultations = await Consultation.find({ client: userId })
            .populate({
                path: 'lawyer',
                select:'isVerified',
                populate: {
                    path: 'user',
                    select: 'username',
                },
            })
            .populate( {
                path:'timeslot',
                select: 'start_time end_time',
             } )
            .sort({ scheduledAt: -1 });

        return NextResponse.json(consultations);
    } catch (error: any) {
        console.error('GET consultations error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}