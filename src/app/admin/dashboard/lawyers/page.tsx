'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPen, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Lawyer } from '@/helpers/interfaces/lawyer';

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await axios.get('/api/lawyers');
        setLawyers(res.data);
      } catch (err) {
        console.error('Failed to fetch lawyers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const handleDelete = async () => {
    if (!selectedLawyerId) return;
    try {
      await axios.delete(`/api/lawyers/${selectedLawyerId}`);
      setLawyers((prev) => prev.filter((lawyer) => lawyer._id !== selectedLawyerId));
    } catch (err) {
      console.error('Failed to delete lawyer:', err);
    } finally {
      setShowDeleteModal(false);
      setSelectedLawyerId(null);
    }
  };

  const totalLawyers = lawyers.length;
  const verifiedLawyers = lawyers.filter((l) => l.isVerified).length;
  const pendingLawyers = totalLawyers - verifiedLawyers;

  const specializationStats = lawyers.reduce((acc: Record<string, { specialization: string; count: number }>, lawyer) => {
    const specialization = lawyer.specialization_id?.name.trim() || "Other";

    if (!acc[specialization]) {
      acc[specialization] = { specialization, count: 1 };
    } else {
      acc[specialization].count += 1;
    }

    return acc;
  }, {});

  const statsArray = Object.values(specializationStats);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Lawyers Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Total Lawyers</h2>
          <h3 className="text-lg font-medium text-gray-700">
            <CountUp end={totalLawyers} duration={1.5} />
          </h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Verified</h2>
          <h3 className="text-lg font-medium text-gray-700">
            <CountUp end={verifiedLawyers} duration={1.5} />
          </h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Pending Verification</h2>
          <h3 className="text-lg font-medium text-gray-700">
            <CountUp end={pendingLawyers} duration={1.5} />
          </h3>
        </div>
      </div>

      {/* Specializations Chart */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Lawyers by Specializations</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={Object.values(specializationStats)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="specialization" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <svg className="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="10" r="10" fill="none" strokeWidth="4" strokeLinecap="round" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4.93 4.93a10 10 0 0114.14 14.14l-1.41-1.41a8 8 0 00-11.31-11.31L4.93 4.93z"
            />
          </svg>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="overflow-x-auto bg-gray-200 shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Specializations</th>
                  <th className="px-6 py-3">Verified</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {lawyers.map((lawyer) => (
                  <tr key={lawyer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{lawyer.user?.username}</td>
                    <td className="px-6 py-4">{lawyer.user?.email}</td>
                    <td className="px-6 py-4">{lawyer.user?.phone}</td>
                    <td className="px-6 py-4">{lawyer?.specialization_id?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${lawyer.isVerified ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}
                      >
                        {lawyer.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-4">
                      <button
                        onClick={() => alert(`Edit lawyer with id ${lawyer._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaPen size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setSelectedLawyerId(lawyer._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-6 text-black w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6">This will permanently delete the lawyer profile.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedLawyerId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
