'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import toast, { Toaster } from 'react-hot-toast';

const JoinAsLawyer = () => {
  const [bio, setBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [level, setLevel] = useState('junior');
  const [specialization, setSpecialization] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [lawyerSpecializations, setLawyerSpecializations] = useState<any[]>([]);

  const router = useRouter();

  // ✅ Fetch user ID from token
  const fetchUserId = async () => {
    try {
      const user = await getDataFromToken();
      setUserId(user?.id);
    } catch (err: any) {
      console.error('Failed to fetch user ID:', err);
      toast.error('Failed to fetch user ID');
    }
  };

  // ✅ Fetch specializations from API
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/specializations');
  
      if (response.status === 200 && Array.isArray(response.data.specializations)) {
        setLawyerSpecializations(response.data.specializations);
      } else {
        console.error('Unexpected response structure:', response.data);
        toast.error('Failed to load specializations.');
      }
    } catch (err: any) {
      console.error('API Error:', err);
      toast.error('An error occurred while fetching specializations.');
    }
  };
  

  useEffect(() => {
    fetchUserId();
    fetchData();
  }, []);

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmed) {
      setMessage('Please confirm that all the data provided is valid.');
      return;
    }

    if (!userId) {
      toast.error('User ID not available. Please login again.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('bio', bio);
    formData.append('years_of_experience', yearsOfExperience.toString());
    formData.append('hourly_rate', hourlyRate.toString());
    formData.append('level', level);
    formData.append('specialization_id', specialization);

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('proof_documents', file);
      });
    }

    try {
      const res = await axios.post('/api/lawyers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(res.data.message || 'Application submitted!');
      if (res.status === 201) {
        router.push(`/dashboard/${userId}`);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setMessage('Failed to submit your application.');
      toast.error('Submission failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 pt-24">
      <Toaster position="top-center" />
      <div className="w-full max-w-6xl grid md:grid-cols-3 gap-6">
        {/* Left panel */}
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

        {/* Right panel */}
        <div className="md:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Join as a Lawyer</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="p-2 rounded bg-white/20 text-white"
              >
                <option value="junior">Junior</option>
                <option value="mid-level">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {/* Specialization */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Specialization</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="p-2 rounded bg-white/20 text-white"
              >
                <option value="">Select</option>
                {lawyerSpecializations.map((item: any) => (
                  <option key={item._id} value={item._id} className="text-black">
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Years of Experience</label>
              <input
                type="number"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                required
                className="p-2 rounded bg-white/20 text-white"
              />
            </div>

            {/* Rate */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Hourly Rate (USD)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                required
                className="p-2 rounded bg-white/20 text-white"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                required
                className="p-2 rounded bg-white/20 text-white"
              />
            </div>

            {/* File Upload */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-medium">Proof Documents</label>
              <label
                htmlFor="fileUpload"
                className="cursor-pointer p-4 bg-white/20 text-white rounded-lg border text-center"
              >
                {files?.length ? `${files.length} file(s) selected` : 'Click to upload documents'}
              </label>
              <input
                id="fileUpload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>

            {/* Confirmation */}
            <div className="md:col-span-2 flex items-center space-x-3">
              <input
                type="checkbox"
                id="confirmData"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
              <label htmlFor="confirmData" className="text-sm">
                I confirm that all the information provided above is true and accurate.
              </label>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
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
