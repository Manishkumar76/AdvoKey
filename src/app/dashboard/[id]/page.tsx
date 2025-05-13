'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/navigation';

import { User } from '@/helpers/interfaces/user';
import { Consultation } from '@/helpers/interfaces/consultation';
import ConsultationCharts from './insights';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const route = useRouter();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
         const user= await axios.get('/api/users/me');
         setUserData(user?.data?.data);
        const res = await axios.get(`/api/consultation`);
        console.log("Consultation API response:", res.data);

        const all: Consultation[] = res.data?.userConsultations || [];
         
        if(user?.data?.data?.role !== 'Lawyer') {
          const filtered = all.filter((c) => c.client_id === user?.data?.data?._id);
          setConsultations(filtered);
        }
        if (!Array.isArray(all)) throw new Error("Invalid data format");
 
        setConsultations(all);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load consultations");
      } finally {
        setLoading(false);
        setInsightsLoading(false);
      }
    }
  fetchConsultations();
  },[]);

  return (
    <div className="flex-col p-6 min-w-screen min-h-screen text-white mx-auto pt-20 bg-gray-900 gap-y-4">
      {userData && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center gap-x-4">
            <img
              src={userData.profile_image_url || '/user.jpg'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{userData.username}</h2>
              <p className="text-sm text-gray-400 flex gap-2">Email: <span className="text-sm text-gray-200"> {userData.email}</span></p>
              <p className="text-sm text-gray-400 flex gap-2">Contact Number :<span className="text-sm text-gray-200"> {userData.phone}</span></p>
              <p className="text-sm text-gray-400 flex gap-2">Age:<span className="text-sm text-gray-200">{userData.age}</span></p>
            </div>
            <button
              onClick={() => route.push(`/dashboard/${userData._id}/settings`)}
              className="ml-auto bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">📊 Consultation Insights</h1>

      {insightsLoading ? (
        <Skeleton height={300} width="100%" />
      ) : (
        <ConsultationCharts  />
      )}

      <h1 className="text-3xl font-bold mb-6 mt-10">🗓️ My Consultations</h1>

      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gray-900 pt-20">
          <Skeleton count={5} height={50} width="100%" />
        </div>
      ) : consultations.length == 0 ? (
        <p className="text-center text-white">No consultations available.</p>
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
                {consultations.map((c, idx) => (
                  <tr key={c._id} className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{c.lawyer_id?.user?.username || 'Unknown'}</td>
                    <td className="p-3">
                      <p>{new Date(c.scheduledAt).toLocaleDateString()}</p>
                      <p className="dark:text-gray-600">{new Date(c.scheduledAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="p-3">{c.durationMinutes} min</td>
                    <td className="p-3">
                      {c.notes
                        ? c.notes.split(' ').slice(0, 5).join(' ') + (c.notes.split(' ').length > 5 ? '...' : '')
                        : 'None'}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-3 py-1 font-semibold rounded-md text-white ${
                        c.status === 'completed' ? 'bg-green-600' :
                        c.status === 'pending' ? 'bg-yellow-500' :
                        c.status === 'confirmed' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}>
                        {c.status}
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
