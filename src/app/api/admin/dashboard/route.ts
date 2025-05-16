// /app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel';
import Consultation from '@/models/Consultation';
import Review from '@/models/Review';

export async function GET() {
  await connect();

  const totalUsers = await User.countDocuments();
  const totalLawyers = await User.countDocuments({ role: 'Lawyer' });
  const totalAppointments = await Consultation.countDocuments();
  const totalReviews = await Review.countDocuments();

  // Example consultation trend (last 7 days)
  const days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().slice(0, 10);
  }).reverse();

  const consultations = await Consultation.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
  ]);

  const consultationMap = Object.fromEntries(consultations.map(c => [c._id, c.count]));

  const consultationTrends = days.map(date => ({
    date,
    count: consultationMap[date] || 0,
  }));

  return NextResponse.json({
    stats: {
      totalUsers,
      totalLawyers,
      totalAppointments,
      totalReviews,
    },
    consultationTrends,
  });
}
