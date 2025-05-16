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
    scheduled: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Consultations</h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {['scheduled', 'completed', 'cancelled'].map((status) => (
          <div key={status} className="bg-white shadow rounded-lg p-4 border">
            <h2 className="text-sm text-gray-500 capitalize">{status}</h2>
            <p className="text-2xl font-semibold text-gray-800">
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
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status} ({statusCounts[status as keyof typeof statusCounts] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading consultations...</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
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
                      <tr key={c._id}>
                        <td className="px-6 py-4">{c.client_id?.username || 'User'}</td>
                        <td className="px-6 py-4">{c.lawyer_id?.user?.username || 'Lawyer'}</td>
                        <td className="px-6 py-4">{new Date(c.scheduledAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{c.time}</td>
                        <td className="px-6 py-4">{c.durationMinutes} mins</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              statusColors[statusKey as keyof typeof statusColors] || ''
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
