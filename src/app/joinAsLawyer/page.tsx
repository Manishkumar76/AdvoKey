// pages/join-as-lawyer.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const JoinAsLawyer = () => {
  const [bio, setBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [level, setLevel] = useState('junior');
  const [proofDocuments, setProofDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post('/api/lawyers', {
        bio,
        years_of_experience: yearsOfExperience,
        hourly_rate: hourlyRate,
        level,
        proof_documents: proofDocuments,
      });

      setMessage(response.data.message);
      // Ensure that the router is available before using it
      if (router) {
        router.push('/dashboard'); // Redirect to the dashboard after successful submission
      }
    } catch (err) {
      setMessage('There was an error submitting your application.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Join as a Lawyer</h1>

      {message && <div className="mb-4 p-4 text-center">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bio" className="block text-gray-700">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="yearsOfExperience" className="block text-gray-700">Years of Experience</label>
          <input
            id="yearsOfExperience"
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="hourlyRate" className="block text-gray-700">Hourly Rate</label>
          <input
            id="hourlyRate"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="level" className="block text-gray-700">Level</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="junior">Junior</option>
            <option value="mid-level">Mid-level</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <div>
          <label htmlFor="proofDocuments" className="block text-gray-700">Proof Documents</label>
          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setProofDocuments(files.map(file => URL.createObjectURL(file)));
            }}
            className="w-full p-2 border rounded"
          />
        </div>

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
