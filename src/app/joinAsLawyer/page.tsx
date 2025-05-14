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
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) {
      setMessage('Please confirm that all the data provided is valid.');
      return;
    }

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
        const id = (await getDataFromToken()).id;
        setUserId(id);
      } catch (err: any) {
        console.error("Failed to fetch user ID", err);
      }
    };

    fetchUserId();
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 pt-24">
      <div className="w-full max-w-6xl grid md:grid-cols-3 gap-6">
        {/* Instructions Section */}
        <div className="md:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Instructions & Guidelines</h2>
          <ul className="list-disc pl-4 text-sm space-y-2 text-white/90">
            <li>Ensure all your details are accurate and up-to-date.</li>
            <li>Upload valid government-approved proof documents.</li>
            <li>Describe your expertise clearly in the bio section.</li>
            <li>Your hourly rate should be in USD.</li>
            <li>Only verified lawyers will be approved to join.</li>
            <li>You must confirm the validity of your data before submission.</li>
          </ul>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Join as a Lawyer</h1>

          {message && (
            <div className="mb-4 p-3 rounded bg-white/20 text-white text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="p-2 rounded bg-white/20 backdrop-blur text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 hover:border-blue-400"
              >
                <option className="text-gray-900" value="junior">Junior</option>
                <option className="text-gray-900" value="mid-level">Mid-level</option>
                <option className="text-gray-900" value="senior">Senior</option>
              </select>
            </div>

            {/* Years of Experience */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Years of Experience</label>
              <input
                type="number"
                placeholder="Years of Experience"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                required
                className="p-2 rounded bg-white/20 backdrop-blur text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 hover:border-blue-400"
              />
            </div>

            {/* Hourly Rate */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Hourly Rate (USD)</label>
              <input
                type="number"
                placeholder="Hourly Rate"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                required
                className="p-2 rounded bg-white/20 backdrop-blur text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 hover:border-blue-400"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-medium">Bio</label>
              <textarea
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                required
                className="p-2 rounded bg-white/20 backdrop-blur text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 hover:border-blue-400"
              />
            </div>

            {/* File Upload */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-medium">Proof Documents</label>
              <label
                htmlFor="fileUpload"
                className="cursor-pointer p-4 bg-white/20 text-white rounded-lg border border-white/30 text-center hover:bg-white/30 hover:border-blue-400 transition duration-300"
              >
                {files && files.length > 0
                  ? `${files.length} file(s) selected`
                  : 'Click to upload documents'}
              </label>
              <input
                id="fileUpload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>

            {/* Confirmation Checkbox */}
            <div className="md:col-span-2 flex items-center space-x-3">
              <input
                type="checkbox"
                id="confirmData"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="confirmData" className="text-sm">
                I confirm that all the information provided above is true and accurate.
              </label>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 text-white font-semibold transition duration-300 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinAsLawyer;
