'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getDataFromToken } from '@/helpers/getDataFromToken';

const JoinAsLawyer = () => {
  const [bio, setBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [level, setLevel] = useState('junior');
  const [files, setFiles] = useState<FileList | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('userId', userId!);
    formData.append('bio', bio);
    formData.append('years_of_experience', yearsOfExperience.toString());
    formData.append('hourly_rate', hourlyRate.toString());
    formData.append('level', level);

    if (files) {
      for (const file of Array.from(files)) {
        formData.append('proof_documents', file);
      }
    }

    try {
      const res = await axios.post('/api/lawyers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await res.data;
      setMessage(data.message);

      if (res.status === 201) {
        router.push(`/lawyers/dashboard/${userId}`); 
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to submit your application.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = (await getDataFromToken()).id
  ;
        setUserId(id);
      } catch (err: any) {
        console.error("Failed to fetch user ID", err);
      }
    };

    fetchUserId();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Join as a Lawyer</h1>

      {message && <div className="mb-4 p-4 bg-gray-100 text-center">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="junior">Junior</option>
          <option value="mid-level">Mid-level</option>
          <option value="senior">Senior</option>
        </select>

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Years of Experience"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Hourly Rate"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mt-4"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default JoinAsLawyer;
