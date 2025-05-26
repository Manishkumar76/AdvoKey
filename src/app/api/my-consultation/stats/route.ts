import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import Consultations from '@/models/Consultations';

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const lawyerId = searchParams.get('lawyerId');

    // Build filter dynamically with ObjectId casting
    const filter: any = {};
    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      filter.client_id = new mongoose.Types.ObjectId(clientId);
    }
    if (lawyerId && mongoose.Types.ObjectId.isValid(lawyerId)) {
      filter.lawyer_id = new mongoose.Types.ObjectId(lawyerId);
    }

    // Aggregate for status counts
    const statusCounts = await Consultations.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregate for timeline stats (by year, month, status)
    const timelineStats = await Consultations.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$scheduledAt' },
            month: { $month: '$scheduledAt' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    return NextResponse.json({
      statusCounts,
      timelineStats,
    });
  } catch (error) {
    console.error('Error fetching consultation stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultation stats' },
      { status: 500 }
    );
  }
};
