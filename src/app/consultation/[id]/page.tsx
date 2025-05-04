'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BookConsultation() {
  const route = useRouter();
  const params = useSearchParams();
  const [preselectedLawyerId, setPreselectedLawyerId] = useState<string | null>(null);

  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    lawyer_id: '',
    scheduledAt: '',
    time: '',
    durationMinutes: '',
    notes: '',
  });

  useEffect(() => {
    const id = params.get('id');
    if (id) {
      setPreselectedLawyerId(id);
      setForm(prev => ({ ...prev, lawyer_id: id }));
    }
  }, [params]);

  useEffect(() => {
    const fetchLawyers = async () => {
      if (!preselectedLawyerId) {
        try {
          const res = await fetch('/api/lawyers');
          const data = await res.json();
          setLawyers(data);
        } catch (error) {
          console.error('Failed to fetch lawyers:', error);
          toast.error('❌ Failed to fetch lawyers.');
        }
      }
    };
    fetchLawyers();
  }, [preselectedLawyerId]);

  const handleSubmit = async () => {
    const { lawyer_id, scheduledAt, time, durationMinutes, notes } = form;

    if (!lawyer_id || !scheduledAt || !time || !durationMinutes) {
      toast.error('❌ Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/consultation', {
        lawyer_id,
        scheduledAt,
        time,
        durationMinutes,
        notes,
      });

      if (res.status === 201) {
        toast.success('✅ Consultation booked!');
        setForm({
          lawyer_id: preselectedLawyerId || '',
          scheduledAt: '',
          time: '',
          durationMinutes: '',
          notes: '',
        });
        route.push('/consultations');
      } else if (res.status === 400) {
        toast.error('❌ Failed to book consultation: Missing required fields.');
      
      } else {
        toast.error('❌ Failed to book consultation.');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.error || '❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto pt-20">
      <h1 className="text-white text-2xl mb-4 font-semibold">Book a Consultation</h1>

      {!preselectedLawyerId && (
        <>
          <label className="text-white block mb-1 font-medium">Select Lawyer</label>
          <select
            className="w-full p-2 mb-3 border rounded"
            value={form.lawyer_id}
            onChange={e => setForm({ ...form, lawyer_id: e.target.value })}
          >
            <option value="">-- Choose a Lawyer --</option>
            {lawyers.map(l => (
              <option key={l._id} value={l._id}>
                {l?.user?.username || 'Unnamed Lawyer'}
              </option>
            ))}
          </select>
        </>
      )}

      <label className="text-white block mb-1 font-medium">Date</label>
      <input
        type="date"
        className="w-full p-2 mb-3 border rounded"
        value={form.scheduledAt}
        onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
      />

      <label className="text-white block mb-1 font-medium">Time</label>
      <input
        type="time"
        className="w-full p-2 mb-3 border rounded"
        value={form.time}
        onChange={e => setForm({ ...form, time: e.target.value })}
      />

      <label className="text-white block mb-1 font-medium">Duration (minutes)</label>
      <input
        type="number"
        className="w-full p-2 mb-3 border rounded"
        placeholder="Duration"
        value={form.durationMinutes}
        onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
      />

      <label className="text-white block mb-1 font-medium">Notes (Optional)</label>
      <textarea
        className="w-full p-2 mb-3 border rounded"
        placeholder="Anything specific you want to discuss?"
        value={form.notes}
        onChange={e => setForm({ ...form, notes: e.target.value })}
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? 'Booking...' : 'Book Consultation'}
      </button>
    </div>
  );
}
