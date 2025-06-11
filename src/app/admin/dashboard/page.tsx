'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '@/app/components/ui/card';
import { FaUsers, FaUserTie, FaCalendarCheck, FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DashboardStats {
  totalUsers: number;
  totalLawyers: number;
  totalAppointments: number;
  totalReviews: number;
}

interface ChartDataPoint {
  date: string;
  count: number;
}

interface RecentUser {
  _id: string;
  username: string;
  createdAt: string;
}

interface RecentBooking {
  _id: string;
  clientName: string;
  appointmentDate: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLawyers: 0,
    totalAppointments: 0,
    totalReviews: 0,
  });
  const [chartDataUsers, setChartDataUsers] = useState<ChartDataPoint[]>([]);
  const [chartDataLawyers, setChartDataLawyers] = useState<ChartDataPoint[]>([]);
  const [chartDataReviews, setChartDataReviews] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const [roleFilter, setRoleFilter] = useState<'All' | 'Client' | 'Lawyer' | 'Admin'>('All');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  const formatDate = (date: Date) =>
    date.toISOString().split('T')[0];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/admin/dashboard', {
          params: {
            role: roleFilter === 'All' ? undefined : roleFilter,
            startDate: startDate ? formatDate(startDate) : undefined,
            endDate: endDate ? formatDate(endDate) : undefined,
          },
        });

        setStats(res.data.stats);
        setChartDataUsers(res.data.userGrowth || []);
        setChartDataLawyers(res.data.lawyerSignups || []);
        setChartDataReviews(res.data.reviewStats || []);
        setRecentUsers(res.data.recentUsers || []);
        setRecentBookings(res.data.recentBookings || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [roleFilter, startDate, endDate]);

  const dashboardData = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers className="text-blue-600" size={28} />,
    },
    {
      title: 'Total Lawyers',
      value: stats.totalLawyers,
      icon: <FaUserTie className="text-green-600" size={28} />,
    },
    {
      title: 'Appointments',
      value: stats.totalAppointments,
      icon: <FaCalendarCheck className="text-blue-600" size={28} />,
    },
    {
      title: 'Reviews',
      value: stats.totalReviews,
      icon: <FaComments className="text-blue-600" size={28} />,
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-slate-50 to-slate-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="border border-gray-300 rounded px-3 py-2 bg-white"
          aria-label="Filter by Role"
        >
          <option value="All">All Roles</option>
          <option value="Client">Client</option>
          <option value="Lawyer">Lawyer</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex items-center space-x-2">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="border border-gray-300 rounded px-3 py-2 bg-white"
            isClearable
          />

          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate!}
            placeholderText="End Date"
            className="border border-gray-300 rounded px-3 py-2 bg-white"
            isClearable
          />

        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? Array(4)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="shadow-md rounded-2xl border border-gray-100 p-6">
                <Skeleton height={30} width={30} circle />
                <Skeleton height={20} width={80} className="mt-2" />
                <Skeleton height={28} width={50} className="mt-1" />
              </Card>
            ))
          : dashboardData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="bg-gray-100 p-3 rounded-full">{item.icon}</div>
                  <div>
                    <div className="text-sm text-gray-500">{item.title}</div>
                    <div className="text-xl font-bold">{item.value}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[{
          title: 'Users Growth Over Time',
          data: chartDataUsers,
          color: '#2563eb'
        }, {
          title: 'Lawyer Signups Over Time',
          data: chartDataLawyers,
          color: '#16a34a'
        }, {
          title: 'Reviews Counts Over Time',
          data: chartDataReviews,
          color: '#fbbf24'
        }].map((chart, i) => (
          <Card key={i} className="shadow-md rounded-2xl border border-gray-100">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">{chart.title}</h2>
              {loading ? (
                <Skeleton height={300} />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chart.data}>
                    <Line type="monotone" dataKey="count" stroke={chart.color} strokeWidth={2} />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[{
          title: 'Recent Users',
          data: recentUsers,
          render: (user: RecentUser) => (
            <>
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
            </>
          )
        }, {
          title: 'Recent Bookings',
          data: recentBookings,
          render: (booking: RecentBooking) => (
            <>
              <div className="font-semibold">{booking.clientName}</div>
              <div className="text-sm text-gray-500">Date: {new Date(booking.appointmentDate).toLocaleDateString()}</div>
            </>
          )
        }].map((section, i) => (
          <Card key={i} className="shadow-md rounded-2xl border border-gray-100">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
              {loading ? (
                <Skeleton count={5} height={30} />
              ) : (
                <ul>
                  {section.data.map((item: any) => (
                    <li key={item._id} className="mb-3 border-b border-gray-200 pb-2">
                      {section.render(item)}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}