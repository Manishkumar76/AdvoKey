'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
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
  ResponsiveContainer,
} from 'recharts';

type Status = 'completed' | 'scheduled' | 'cancelled';

interface StatusCountItem {
  _id: Status;
  count: number;
}

interface TimelineRawItem {
  _id: {
    month: number;
    year: number;
    status: string;
  };
  count: number;
}

interface TimelineFormattedItem {
  date: string;
  completed?: number;
  scheduled?: number;
  cancelled?: number;
}

const COLORS = ['#22c55e', '#6366f1', '#facc15'];

interface Props {
  userId: string;
}

export default function ConsultationCharts({ userId }: Props) {
  const [statusCounts, setStatusCounts] = useState<StatusCountItem[]>([]);
  const [timelineStats, setTimelineStats] = useState<TimelineFormattedItem[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/my-consultation/stats?userId=${userId}`);

        const normalized = res.data.statusCounts.map((item: any) => ({
          _id: item._id.toLowerCase(),
          count: item.count,
        }));

        setStatusCounts(normalized);
        setTimelineStats(formatTimelineData(res.data.timelineStats));
      } catch (error) {
        console.error('Failed to fetch consultation stats:', error);
      }
    };

    fetchStats();
  }, [userId]);

  const isValidStatus = (status: string): status is Status =>
    ['completed', 'scheduled', 'cancelled'].includes(status.toLowerCase());

  const formatTimelineData = (data: TimelineRawItem[]): TimelineFormattedItem[] => {
    const grouped: Record<string, TimelineFormattedItem> = {};

    data.forEach(({ _id, count }) => {
      const key = `${_id.month}/${_id.year}`;
      const status = _id.status.toLowerCase();

      if (!grouped[key]) grouped[key] = { date: key };
      if (isValidStatus(status)) {
        grouped[key][status] = count;
      }
    });

    return Object.values(grouped);
  };

  if (!hasMounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8 py-4">
      {/* Pie Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Consultations by Status</h2>
        <div className="w-full h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label
              >
                {statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Consultations Over Time</h2>
        <div className="w-full h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#22c55e" />
              <Bar dataKey="scheduled" stackId="a" fill="#6366f1" />
              <Bar dataKey="cancelled" stackId="a" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
