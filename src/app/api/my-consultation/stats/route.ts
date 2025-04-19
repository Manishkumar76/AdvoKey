
import { NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Consultation from '@/models/Consultation';
import TimeSlot from '@/models/TimeSlot';

export const GET = async () => {
  await connect();

  // Pie chart: status count
  const statusCounts = await Consultation.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Line chart: monthly status count
  const timelineStats = await Consultation.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$created_at' },
          year: { $year: '$created_at' },
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
