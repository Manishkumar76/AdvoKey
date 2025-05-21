'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Users } from '@/helpers/interfaces/user';
import { Consultations } from '@/helpers/interfaces/consultation';
import ConsultationCharts from './insights';

export default function DashboardPage() {
  const route = useRouter();

  const [consultations, setConsultations] = useState<Consultations[]>([]);
  const [userData, setUserData] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const user = await axios.get('/api/users/me');
        setUserData(user?.data?.data);

        const res = await axios.get('/api/consultation');
        const all: Consultations[] = res.data?.userConsultations || [];

        if (user?.data?.data?.role !== 'Lawyer') {
          const filtered = all.filter(c => c.client_id === user?.data?.data?._id);
          setConsultations(filtered);
        } else {
          setConsultations(all);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load consultations');
      } finally {
        setLoading(false);
        setInsightsLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  return (
    <div className="flex flex-col p-4 sm:p-6 min-h-screen text-white bg-gray-900">
      {/* Users Info */}
      {userData && (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={userData.profile_image_url || '/user.jpg'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto sm:mx-0"
            />
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">{userData.username}</h2>
              <p className="text-sm text-gray-400">
                Email: <span className="text-gray-200">{userData.email}</span>
              </p>
              <p className="text-sm text-gray-400">
                Contact: <span className="text-gray-200">{userData.phone}</span>
              </p>
              <p className="text-sm text-gray-400">
                Age: <span className="text-gray-200">{userData.age}</span>
              </p>
            </div>
            <div className="sm:ml-auto">
              <button
                onClick={() => route.push(`/dashboard/${userData._id}/settings`)}
                className="bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700 w-full sm:w-auto"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">📊 Consultations Insights</h1>
      {insightsLoading ? (
        <Skeleton height={300} width="100%" />
      ) : (
        <ConsultationCharts userId={userData!._id} />
      )}

      {/* Consultations Table */}
      <h1 className="text-2xl sm:text-3xl font-bold mt-10 mb-4">🗓️ My Consultations</h1>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Skeleton count={5} height={50} width="100%" />
        </div>
      ) : consultations.length === 0 ? (
        <p className="text-center text-white">No consultations available.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-50 text-gray-800 rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-300">
              <tr className="text-left">
                <th className="p-3">#</th>
                <th className="p-3">Lawyer</th>
                <th className="p-3">Scheduled At</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c, idx) => (
                <tr
                  key={c._id}
                  className="border-b border-gray-200 bg-white hover:bg-gray-100 transition-all"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{c.lawyer_id?.user?.username || 'Unknown'}</td>
                  <td className="p-3">
                    <p>{new Date(c.scheduledAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{new Date(c.scheduledAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="p-3">{c.durationMinutes} min</td>
                  <td className="p-3 text-xs">
                    {c.notes
                      ? c.notes.split(' ').slice(0, 5).join(' ') +
                        (c.notes.split(' ').length > 5 ? '...' : '')
                      : 'None'}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-3 py-1 font-semibold rounded-md text-white ${
                        c.status === 'completed'
                          ? 'bg-green-600'
                          : c.status === 'pending'
                          ? 'bg-yellow-500'
                          : c.status === 'confirmed'
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
