// components/admin/DashboardPage.tsx
'use client';

import { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/app/components/ui/card';
import { FaUsers, FaUserTie, FaCalendarCheck, FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';

const dashboardData = [
  {
    title: 'Total Users',
    value: 1240,
    icon: <FaUsers className="text-blue-600" size={28} />,
  },
  {
    title: 'Total Lawyers',
    value: 340,
    icon: <FaUserTie className="text-green-600" size={28} />,
  },
  {
    title: 'Appointments',
    value: 980,
    icon: <FaCalendarCheck className="text-blue-600" size={28} />,
  },
  {
    title: 'Reviews',
    value: 450,
    icon: <FaComments className="text-yellow-600" size={28} />,
  },
];

interface ChartDataPoint {
  date: string;
  count: number;
}

interface DashboardPageProps {
  data: ChartDataPoint[];
}

export default function DashboardPage({ data }: DashboardPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData.map((item, index) => (
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

      <Card className="shadow-md rounded-2xl border border-gray-100">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Consultations Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}


