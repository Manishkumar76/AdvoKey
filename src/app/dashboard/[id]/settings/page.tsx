'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Lottie from "lottie-react";
import loadingAnimation from '@/app/assets/animation/page_loading.json';

export default function SettingsPage() {
  const router = useRouter();
  const id = useParams().id;
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    age: '',
    phone: '',
    password: '',
    currentPassword: '',
    location_id: '',
    profilePic: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, locationRes] = await Promise.all([
          axios.get(`/api/users/${id}`),
          axios.get('/api/location'),
        ]);
        const user = userRes.data;
        setForm({
          fullName: user.username || '',
          age: user.age || '',
          phone: user.phone || '',
          password: '',
          currentPassword: '',
          location_id: user.location_id || '',
          profilePic: user.profile_image_url || '',
        });
        setLocations(locationRes.data);
      } catch (err) {
        toast.error('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateDetails = async (e: any) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${id}`, {
        username: form.fullName,
        age: form.age,
        phone: form.phone,
      });
      toast.success('Details updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update details.');
    }
  };

  const updatePassword = async (e: any) => {
    e.preventDefault();
    try {
      if (!form.password || !form.currentPassword) {
        return toast.error("Both current and new password are required.");
      }
      await axios.put(`/api/users/${id}/password`, {
        currentPassword: form.currentPassword,
        password: form.password,
      });
      toast.success('Password updated successfully!');
      setForm({ ...form, password: '', currentPassword: '' });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update password.');
    }
  };

  const updateLocation = async (e: any) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/location`, { location_id: form.location_id });
      toast.success('Location updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update location.');
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(`/api/users/${id}`);
      toast.success('Account deleted successfully!');
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete account.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleProfilePictureChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
      uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await axios.post(`/api/users/${id}/upload-profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile picture updated!');
      setProfilePicPreview(res.data.url);
      setForm((prev) => ({
        ...prev,
        profilePic: res.data.url,
      }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload picture.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 pt-20">
        <Lottie animationData={loadingAnimation} loop />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 text-white bg-gray-900 space-y-10">
      <h1 className="text-3xl font-bold mb-6">⚙️ Settings</h1>
      <Toaster position="top-right" reverseOrder={false} />

      {/* 🔼 Profile Picture Upload */}
      <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold mb-4">🖼️ Profile Picture</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            {uploading ? (
              <div className="w-40 h-40 rounded-full flex items-center justify-center bg-gray-700 text-white animate-pulse">
                Uploading...
              </div>
            ) : (
              <img
                src={form!.profilePic.toString() || profilePicPreview! }
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/user.jpg';
                }}
                className="w-40 h-40 object-cover rounded-full border-4 border-gray-700 transition-transform duration-300 group-hover:scale-105 shadow-lg"
              />
            )}
            <label
              htmlFor="profile-pic-input"
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm cursor-pointer transition"
            >
              Change
            </label>
            <input
              type="file"
              id="profile-pic-input"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* 🧑 Update User Details */}
      <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">🧑 Update User Details</h2>
        <form onSubmit={updateDetails} className="space-y-4">
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 rounded text-black" />
          <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age" className="w-full px-4 py-2 rounded text-black" />
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full px-4 py-2 rounded text-black" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold">
            Update Details
          </button>
        </form>
      </div>

      {/* 🔒 Update Password */}
      <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">🔒 Change Password</h2>
        <form onSubmit={updatePassword} className="space-y-4">
          <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Current Password" className="w-full px-4 py-2 rounded text-black" required />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password" className="w-full px-4 py-2 rounded text-black" required />
          <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-semibold">
            Change Password
          </button>
        </form>
      </div>

      {/* 📍 Update Location */}
      <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">📍 Update Location</h2>
        <form onSubmit={updateLocation} className="space-y-4">
          <select name="location_id" value={form.location_id} onChange={handleChange} className="w-full px-4 py-2 text-black rounded">
            <option value="">Select Location</option>
            {locations.map((loc: any) => (
              <option key={loc._id} value={loc._id}>
                {loc.city}, {loc.state}, {loc.country}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold">
            Update Location
          </button>
        </form>
      </div>

      {/* 🗑️ Delete Account */}
      <div className="bg-red-900 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2 text-red-200">🗑️ Delete Account</h2>
        <p className="text-red-300">This action is permanent and cannot be undone.</p>
        <button onClick={() => setShowDeleteModal(true)} className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded font-semibold text-white">
          Delete My Account
        </button>
      </div>

      {/* 🔔 Modal for Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed min-h-screen inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-6 text-black w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6">This will permanently delete your account.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={deleteAccount} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
