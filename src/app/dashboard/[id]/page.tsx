'use client';

import axios from 'axios';
import { use, useEffect, useState } from 'react';
import ConsultationCharts from './insights';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { User } from '@/helpers/interfaces/user';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const route= useRouter();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
   
    // Fetch consultations
    const fetchConsultations = async () => {
      try {
        const res = await axios.get('/api/consultation');
        setConsultations(res.data.data.filter((c: any) => c.client_id === userData?._id));
      } catch (error) {
        console.error('Failed to fetch consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  return (
    <div className="flex-col p-6 min-w-screen min-h-screen text-white mx-auto pt-20 bg-gray-900 gap-y-4">
      {/* User Profile Card */}
      {userData && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center gap-x-4">
            <img
              src={userData!.profile_image_url || '/user.jpg'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{userData.username}</h2>
              <p className="text-sm text-gray-400">{userData.email}</p>
              <p className="text-sm text-gray-400">{userData.phone}</p>
              <p className="text-sm text-gray-400">{userData.age}</p>
              


            </div>
            <button
              onClick={() =>{
                route.push(`/dashboard/${userData._id}/settings`) // Redirect to profile edit page
              }}
              className="ml-auto bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">📊 Consultation Insights</h1>
      <ConsultationCharts />
      <br />
      <br />
      <h1 className="text-3xl font-bold mb-6">🗓️ My Consultations</h1>

      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gray-900 pt-20">
          <Skeleton count={5} height={50} width="100%" />
        </div>
      ) : (
        <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="dark:bg-gray-300">
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
                {loading
                  ? Array(5).fill(0).map((_, index) => (
                      <tr key={index} className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                        <td className="p-3">
                          <Skeleton width={50} />
                        </td>
                        <td className="p-3">
                          <Skeleton width={100} />
                        </td>
                        <td className="p-3">
                          <Skeleton width={150} />
                        </td>
                        <td className="p-3">
                          <Skeleton width={80} />
                        </td>
                        <td className="p-3">
                          <Skeleton width={200} />
                        </td>
                        <td className="p-3 text-right">
                          <Skeleton width={70} />
                        </td>
                      </tr>
                    ))
                  : consultations.map((c: any, idx: number) => (
                      <tr key={c._id} className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                        <td className="p-3">
                          <p>{idx + 1}</p>
                        </td>
                        <td className="p-3">
                          <p>{c.lawyer?.user?.username || 'Unknown'}</p>
                        </td>
                        <td className="p-3">
                          <p>{new Date(c.scheduledAt).toLocaleDateString()}</p>
                          <p className="dark:text-gray-600">{new Date(c.scheduledAt).toLocaleTimeString()}</p>
                        </td>
                        <td className="p-3">
                          <p>{c.durationMinutes} min</p>
                        </td>
                        <td className="p-3">
                          <p>
                            {c.notes
                              ? c.notes.split(' ').slice(0, 5).join(' ') + (c.notes.split(' ').length > 5 ? '...' : '')
                              : 'None'}
                          </p>
                        </td>
                        <td className="p-3 text-right">
                          <span className="px-3 py-1 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">
                            <span>{c?.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
