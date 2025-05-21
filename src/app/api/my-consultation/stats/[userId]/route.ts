import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultations from '@/models/Consultations';
import mongoose from 'mongoose';

export const GET = async (req: Request) => {
  await connect();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId in query' }, { status: 400 });
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Pie chart: Status-wise consultation counts for the user
  const statusCounts = await Consultations.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Line chart: Monthly consultation stats by status for the user
  const timelineStats = await Consultations.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: {
          month: { $month: '$scheduledAt' },
          year: { $year: '$scheduledAt' },
          status: '$status',
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  return NextResponse.json({
    statusCounts,
    timelineStats,
  });
};
