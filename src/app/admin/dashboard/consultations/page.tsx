'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await axios.get('/api/admin/consultations');
        setConsultations(res.data);
      } catch (err) {
        console.error('Error fetching consultations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  const statusCounts = consultations.reduce(
    (acc, curr) => {
      const status = curr.status.toLowerCase();
      acc.all++;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { all: 0, scheduled: 0, completed: 0, cancelled: 0 }
  );

  const filteredConsultations =
    filter === 'all'
      ? consultations
      : consultations.filter((c) => c.status.toLowerCase() === filter);

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Consultations</h1>

      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <svg
            className="animate-spin h-10 w-10 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {['scheduled', 'completed', 'cancelled'].map((status) => (
              <div key={status} className="bg-white p-4 rounded-lg shadow border">
                <h3 className="text-sm text-gray-500 capitalize">{status}</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {statusCounts[status as keyof typeof statusCounts] || 0}
                </p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-6">
            {['all', 'scheduled', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status} ({statusCounts[status as keyof typeof statusCounts] || 0})
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Users</th>
                  <th className="px-6 py-3 text-left">Lawyer</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Duration</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConsultations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No consultations found.
                    </td>
                  </tr>
                ) : (
                  filteredConsultations.map((c) => {
                    const statusKey = c.status.toLowerCase();
                    return (
                      <tr key={c._id} className="hover:bg-gray-50 text-gray-900">
                        <td className="px-6 py-4 whitespace-nowrap">{c.client_id?.username || 'Users'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{c.lawyer_id?.user?.username || 'Lawyer'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(c.scheduledAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{c.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{c.durationMinutes} mins</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              statusColors[statusKey as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
