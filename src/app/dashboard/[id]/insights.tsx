'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

type Status = 'completed' | 'pending' | 'confirmed' | 'cancelled';

interface StatusCountItem {
  _id: Status;
  count: number;
}

interface TimelineRawItem {
  _id: {
    month: number;
    year: number;
    status: Status;
  };
  count: number;
}

interface TimelineFormattedItem {
  date: string;
  completed?: number;
  pending?: number;
  confirmed?: number;
  cancelled?: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function ConsultationCharts() {
  const [statusCounts, setStatusCounts] = useState<StatusCountItem[]>([]);
  const [timelineStats, setTimelineStats] = useState<TimelineFormattedItem[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // avoid hydration errors
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/my-consultation/stats');
        setStatusCounts(res.data.statusCounts);

        const formatted = formatTimelineData(res.data.timelineStats);
        setTimelineStats(formatted);
      } catch (error) {
        console.error('Failed to fetch consultation stats:', error);
      }
    };

    fetchStats();
  }, []);

  const isValidStatus = (status: string): status is Status => {
    return ['completed', 'pending', 'confirmed', 'cancelled'].includes(status);
  };

  const formatTimelineData = (data: TimelineRawItem[]): TimelineFormattedItem[] => {
    const grouped: Record<string, TimelineFormattedItem> = {};

    data.forEach(({ _id, count }) => {
      const key = `${_id.month}/${_id.year}`;
      if (!grouped[key]) grouped[key] = { date: key };

      if (isValidStatus(_id.status)) {
        grouped[key][_id.status] = count;
      }
    });

    return Object.values(grouped);
  };

  if (!hasMounted) return null; // avoid mismatch

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-gray-900">
      {/* Pie Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 ">Consultations by Status</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={statusCounts}
            dataKey="count"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {statusCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Consultations Over Time</h2>
        <BarChart width={500} height={300} data={timelineStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" stackId="a" fill="#82ca9d" />
          <Bar dataKey="pending" stackId="a" fill="#ffc658" />
          <Bar dataKey="confirmed" stackId="a" fill="#8884d8" />
          <Bar dataKey="cancelled" stackId="a" fill="#ff8042" />
        </BarChart>
      </div>
    </div>
  );
}
