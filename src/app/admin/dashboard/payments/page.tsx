'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/payments');
        setPayments(res.data || []);
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const statusCounts = payments.reduce(
    (acc, curr) => {
      const status = curr.status.toLowerCase();
      acc.all++;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { all: 0, successful: 0, pending: 0, failed: 0 }
  );

  const filteredPayments =
    filter === 'all'
      ? payments
      : payments.filter((p) => p.status.toLowerCase() === filter);

  const statusColors = {
    successful: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-600',
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Payments</h1>

      {/* Status Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {['successful', 'pending', 'failed'].map((status) => (
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
        {['all', 'successful', 'pending', 'failed'].map((status) => (
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
        <div className="text-center text-gray-500">Loading payments...</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Lawyer</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Transaction ID</th>
                  <th className="px-6 py-3 text-left">Timestamp</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p._id}>
                      <td className="px-6 py-4">
                        {p.client_id?.username || 'Client'}
                      </td>
                      <td className="px-6 py-4">
                        {p.lawyer_id?.user?.username || 'Lawyer'}
                      </td>
                      <td className="px-6 py-4">${p.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">{p.transaction_id}</td>
                      <td className="px-6 py-4">
                        {new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(p.timestamp))}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            statusColors[
                              p.status.toLowerCase() as keyof typeof statusColors
                            ] || ''
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
