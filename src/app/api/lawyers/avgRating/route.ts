import { NextResponse } from 'next/server';
import { calculateAverageRating } from '@/helpers/getAvgRating'; // Adjust the import path as necessary

export async function GET() {
    try {
        const lawyersWithRatings = await calculateAverageRating();

        return NextResponse.json(lawyersWithRatings, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
