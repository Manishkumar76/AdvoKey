'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPen, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Lawyer } from '@/helpers/interfaces/lawyer';

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/lawyers/${id}`);
      setLawyers((prev) => prev.filter((lawyer) => lawyer._id !== id));
    } catch (err) {
      console.error('Failed to delete lawyer:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Lawyers Management</h1>

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
              cy="10"
              r="10"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4.93 4.93a10 10 0 0114.14 14.14l-1.41-1.41a8 8 0 00-11.31-11.31L4.93 4.93z"
            />
          </svg>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Verified</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {lawyers.map((lawyer) => (
                  <tr key={lawyer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{lawyer.user.username}</td>
                    <td className="px-6 py-4">{lawyer.user.email}</td>
                    <td className="px-6 py-4">{lawyer.user.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lawyer.isverify ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {lawyer.isverify ? 'Verified' : 'Pending'}
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
                        onClick={() => handleDelete(lawyer._id)}
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
    </div>
  );
}
