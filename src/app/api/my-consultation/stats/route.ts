import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultations from '@/models/Consultations';

export const GET = async () => {
  await connect();

  // Pie chart data: Consultations count grouped by status
  const statusCounts = await Consultations.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Line chart data: Monthly status count using `scheduledAt`
  const timelineStats = await Consultations.aggregate([
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
