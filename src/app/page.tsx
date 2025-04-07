'use client'; 

import axios from 'axios';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const logout = async () => {
    try {
      const response = await axios.get('/api/users/logout');
      toast.success(response.data.message, { duration: 5000 });
      window.location.href = '/login';
    } catch (err: any) {
      toast.error(err.message, { duration: 5000 });
      console.log(err);
    }
  };
  return (
    <div className="h-full w-full">
      <Toaster position="top-right" />
      <h1>Home Page</h1>
      <button
        className="bg-blue-500 text-white p-2 rounded-lg"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
