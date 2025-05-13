import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Consultation from '@/models/Consultation';

export const GET = async () => {
  await connect();

  // Pie chart data: Consultation count grouped by status
  const statusCounts = await Consultation.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Line chart data: Monthly status count using `scheduledAt`
  const timelineStats = await Consultation.aggregate([
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
