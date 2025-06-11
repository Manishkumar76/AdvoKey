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

type Status = 'Completed' | 'Scheduled' | 'Cancelled';

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
  Completed?: number;
  Scheduled?: number;
  Cancelled?: number;
}

const STATUS_COLORS: Record<Status, string> = {
  Completed: '#22c55e', // green
  Scheduled: '#facc15', // blue
  Cancelled: '#6366f1', // indigo
};

interface Props {
  clientId?: string;
  lawyerId?: string;
}

const normalizeStatus = (status: string): Status => {
  const s = status.toLowerCase();
  if (s === 'completed') return 'Completed';
  if (s === 'scheduled') return 'Scheduled';
  if (s === 'cancelled') return 'Cancelled';
  throw new Error(`Invalid status: ${status}`);
};

export default function ConsultationCharts({ clientId, lawyerId }: Props) {
  const [statusCounts, setStatusCounts] = useState<StatusCountItem[]>([]);
  const [timelineStats, setTimelineStats] = useState<TimelineFormattedItem[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!clientId && !lawyerId) return;

    const fetchStats = async () => {
      try {
        const params = new URLSearchParams();
        if (clientId) params.append('clientId', clientId);
        if (lawyerId) params.append('lawyerId', lawyerId);

        const res = await axios.get(`/api/my-consultation/stats?${params.toString()}`);

        // Defensive checks in case data is missing
        if (!res.data.statusCounts || !res.data.timelineStats) {
          setStatusCounts([]);
          setTimelineStats([]);
          return;
        }

        // Normalize status counts to match Status type casing
        const normalized = res.data.statusCounts.map((item: any) => ({
          _id: normalizeStatus(item._id),
          count: item.count,
        }));

        setStatusCounts(normalized);
        setTimelineStats(formatTimelineData(res.data.timelineStats));
      } catch (error) {
        console.error('Failed to fetch consultation stats:', error);
        setStatusCounts([]);
        setTimelineStats([]);
      }
    };

    fetchStats();
  }, [clientId, lawyerId]);

  const formatTimelineData = (data: TimelineRawItem[]): TimelineFormattedItem[] => {
    const grouped: Record<string, TimelineFormattedItem> = {};

    data.forEach(({ _id, count }) => {
      const key = `${_id.month}/${_id.year}`;
      let status: Status;
      try {
        status = normalizeStatus(_id.status);
      } catch {
        // Ignore invalid statuses
        return;
      }

      if (!grouped[key]) grouped[key] = { date: key };
      grouped[key][status] = count;
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
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id]} />
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
              <Bar dataKey="Completed" stackId="a" fill={STATUS_COLORS.Completed} />
              <Bar dataKey="Scheduled" stackId="a" fill={STATUS_COLORS.Scheduled} />
              <Bar dataKey="Cancelled" stackId="a" fill={STATUS_COLORS.Cancelled} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
