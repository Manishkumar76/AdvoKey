'use client';

import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FilterPanel, { FilterOptions } from '@/app/components/core/lawyers_page/FilterPanel';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Lawyer {
  _id: string;
  specialization: string;
  rating: number;
  availability: string;
  years_of_experience: number;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  user: {
    username: string;
    email: string;
    phone: string;
    role: string;
    profile_image_url: string;
    isverify: boolean;
  };
}

interface Location {
  _id: string;
  city: string;
  state: string;
  country: string;
}

const defaultFilters: FilterOptions = {
  specialization: '',
  rating: 0,
  availability: '',
  experience: 0,
  location: '',
};

const LawyersPage: React.FC = () => {
  const router = new useRouter();
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchLawyers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, lawyers]);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/lawyers');
      const data = response.data;
      setLawyers(data);
      setFilteredLawyers(data);
    } catch (err: any) {
      setError('Error fetching lawyers. Please try again later.');
      console.error('Error fetching lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = lawyers.filter((lawyer) => {
      return (
        (!filters.specialization || lawyer.specialization.toLowerCase().includes(filters.specialization.toLowerCase())) &&
        (!filters.rating || lawyer.rating >= filters.rating) &&
        (!filters.availability || lawyer.availability === filters.availability) &&
        (!filters.experience || lawyer.years_of_experience >= filters.experience) &&
        (!filters.location ||
          (lawyer.location?.city.toLowerCase().includes(filters.location.toLowerCase()) ||
            lawyer.location?.state.toLowerCase().includes(filters.location.toLowerCase()) ||
            lawyer.location?.country.toLowerCase().includes(filters.location.toLowerCase()))) &&
        (!searchTerm || lawyer.user.username.toLowerCase().includes(searchTerm.toLowerCase())) // Fixed here
      );
    });

    setFilteredLawyers(filtered);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Find Lawyers</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>

      {/* Filter Panel and Lawyer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
        />

        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center text-purple-400">Loading lawyers...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredLawyers.length > 0 ? (
            filteredLawyers.map((lawyer, index) => (
              <div
              onClick={()=>{
                // window.location.href = `/lawyers/${lawyer._id}`; // Redirect to lawyer's profile page
                router.push(`/lawyers/${lawyer._id}`); // Use Next.js router for navigation
              }}
                key={index}
                className="flex flex-col md:flex-row items-center md:items-start gap-6 text-white bg-gray-900/70 border border-gray-700 p-6 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.03] hover:border-purple-500"
                data-aos="fade-up"
              >
                {/* Lawyer Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-purple-500 flex-shrink-0">
                  <img
                    src={lawyer.user.profile_image_url || '../assets/images/Vector-Lawyer.png'}
                    alt={lawyer.user.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Lawyer Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-purple-400">{lawyer.user.username}</h3>
                  <p className="text-sm mt-2">📘 Specialization: {lawyer.specialization}</p>
                  <p className="text-sm">⭐ Rating: {lawyer.rating}</p>
                  <p className="text-sm">📅 Availability: {lawyer.availability}</p>
                  <p className="text-sm">⏳ Experience: {lawyer.years_of_experience} years</p>
                  <p className="text-sm">
                    📍 Location: {lawyer.location?.city || 'N/A'}, {lawyer.location?.state || 'N/A'}, {lawyer.location?.country || 'N/A'}
                  </p>
                  <p className="text-sm">📧 Email: {lawyer.user.email}</p>
                  <p className="text-sm">📱 Phone: {lawyer.user.phone}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">No lawyers found matching the criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyersPage;
