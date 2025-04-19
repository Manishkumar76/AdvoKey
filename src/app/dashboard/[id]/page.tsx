'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import ConsultationCharts from './insights';

export default function DashboardPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await axios.get('/api/my-consultation');
        setConsultations(res.data); // Assuming the API returns the data directly
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
       <h1 className="text-3xl font-bold mb-6">📊 Consultation Insights</h1>
      <ConsultationCharts />
      <br/>
      <br/>
      <h1 className="text-3xl font-bold mb-6">🗓️ My Consultations</h1>

      {loading ? (

        <div className=''>loading...</div>
      ):( consultations.length === 0?  
        <div className=''>Not found any consultation</div>:
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
              {consultations.map((c: any, idx: number) => (
                <tr
                  key={c._id}
                  className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                >
                  <td className="p-3">
                    <p>{idx + 1}</p>
                  </td>
                  <td className="p-3">
                    <p>{c.lawyer?.user?.fullName || 'Unknown'}</p>
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
      )
                      }
                      


    </div>
  );
}
