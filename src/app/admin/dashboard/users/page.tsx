'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPen, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Users } from '@/helpers/interfaces/user';
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
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function UsersPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const res = await axios.get('/api/admin/users');
        setUsers(res.data!.users);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchusers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (roleFilter !== 'All') {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (startDate) {
      filtered = filtered.filter((u) => dayjs(u.createdAt).isAfter(dayjs(startDate)));
    }
    if (endDate) {
      filtered = filtered.filter((u) => dayjs(u.createdAt).isBefore(dayjs(endDate).endOf('day')));
    }

    setFilteredUsers(filtered);
  }, [roleFilter, startDate, endDate, users]);

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      await axios.delete(`/api/users/${selectedUserId}`);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setShowDeleteModal(false);
      setSelectedUserId(null);
    }
  };

  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.isverify).length;
  const totalLawyers = users.filter((u) => u.role === 'Lawyer').length;

  const roleStats = ['Client', 'Lawyer', 'Admin'].map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
  }));

  const latestUsers = [...users]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Users Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Total Users" count={totalUsers} />
        <SummaryCard title="Verified Users" count={verifiedUsers} />
        <SummaryCard title="Total Lawyers" count={totalLawyers} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="All">All Roles</option>
          <option value="Client">Client</option>
          <option value="Lawyer">Lawyer</option>
          <option value="Admin">Admin</option>
        </select>

        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          placeholderText="Start Date"
          className="border rounded px-4 py-2"
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
        />

        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          placeholderText="End Date"
          className="border rounded px-4 py-2"
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
        />
      </div>

      {/* Role Chart */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Users by Role</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={roleStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Latest Users */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Signups</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {latestUsers.map((u) => (
            <li key={u._id} className="border-b pb-1">
              {u.username} – {u.email} – {dayjs(u.createdAt).format('MMM D, YYYY')}
            </li>
          ))}
        </ul>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Verified</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isverify
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.isverify ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4 flex gap-4">
                      <button
                        onClick={() => alert(`Edit user with id ${user._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaPen size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setSelectedUserId(user._id);
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
            <p className="mb-6">This will permanently delete the user account.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUserId(null);
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

function SummaryCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <h3 className="text-lg font-medium text-gray-700">
        <CountUp end={count} duration={1.5} />
      </h3>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
      ))}
    </div>
  );
}
