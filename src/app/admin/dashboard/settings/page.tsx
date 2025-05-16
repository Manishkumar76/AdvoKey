'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SettingsPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', phone: '' });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get('/api/admin/settings');
        setAdmin(res.data);
        setForm({
          username: res.data.username || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
        });
      } catch (err) {
        console.error('Failed to fetch admin settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/admin/settings', form);
      alert('Settings updated successfully');
    } catch (err) {
      console.error('Failed to update settings', err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Admin Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 text-sm"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
