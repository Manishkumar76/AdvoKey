'use client';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function BookConsultation() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    lawyer: '',
    scheduledAt: '',
    durationMinutes: '',
    notes: '',
  });

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch('/api/lawyers');
        const data = await res.json();
        setLawyers(data);
      } catch (error) {
        console.error('Failed to fetch lawyers:', error);
      }
    };

    fetchLawyers();
  }, []);

  const handleSubmit = async () => {
    if (!form.lawyer || !form.scheduledAt || !form.durationMinutes) {
      alert('Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
     const res= await axios.post('/api/consultations', {
        lawyer_id: form.lawyer,
        scheduledAt: form.scheduledAt,
        durationMinutes: form.durationMinutes,
        notes: form.notes,
      });
      

      if (res.data) {
        alert('✅ Consultation booked!');
        setForm({ lawyer: '', scheduledAt: '', durationMinutes: '', notes: '' });
      } else {
       
        alert(`❌ Failed: ${'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`❌ Booking failed: ${error?.response?.data?.error || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className=" text-white text-2xl mb-4 font-semibold">Book a Consultation</h1>

      <label className="text-white block mb-1 font-medium">Select Lawyer</label>
      <select
        className="w-full p-2 mb-3 border rounded"
        value={form.lawyer}
        onChange={e => setForm({ ...form, lawyer: e.target.value })}
      >
        <option value="">-- Choose a Lawyer --</option>
        {lawyers.map(l => (
          <option key={l._id} value={l._id}>
            {l?.user?.username || 'Unnamed Lawyer'}
          </option>
        ))}
      </select>

      <label className="text-white block mb-1 font-medium">Date & Time</label>
      <input
        type="datetime-local"
        className="w-full p-2 mb-3 border rounded"
        value={form.scheduledAt}
        onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
      />

      <label className="text-white block mb-1 font-medium">Duration (minutes)</label>
      <input
        type="number"
        className="w-full p-2 mb-3 border rounded"
        placeholder="Duration"
        value={form.durationMinutes}
        onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
      />

      <label className=" text-white block mb-1 font-medium">Notes (Optional)</label>
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
