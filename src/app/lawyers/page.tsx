'use client';

import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FilterPanel, { FilterOptions } from '@/app/components/core/lawyers_page/FilterPanel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Lawyers } from '@/helpers/interfaces/lawyer';

const defaultFilters: FilterOptions = {
  specialization: '',
  rating: 0,
  availability: '',
  experience: 0,
  location: '',
};

const LawyersPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [lawyers, setLawyers] = useState<Lawyers[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyers[]>([]);
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
      const user = lawyer?.user;
      const location = user?.location;

      return (
        (!filters.specialization || lawyer.specialization_id?.name.toLowerCase().includes(filters.specialization.toLowerCase())) &&
        (!filters.rating || lawyer.rating >= filters.rating) &&
        (!filters.experience || lawyer.years_of_experience >= filters.experience) &&
        (!filters.location ||
          (location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
            location?.state?.toLowerCase().includes(filters.location.toLowerCase()) ||
            location?.country?.toLowerCase().includes(filters.location.toLowerCase()))) &&
        (!searchTerm || user?.username?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    setFilteredLawyers(filtered);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchTerm('');
  };


  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
      >
        <svg className="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  if (error || !lawyers) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-red-500 text-lg">{error || 'Lawyer not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Find Lawyers</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Filter Panel and Lawyer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 fixed">
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
        />

        <div className="md:col-span-3 space-y-6">
          {filteredLawyers.length > 0 ? (
            filteredLawyers.map((lawyer, index) => (
              <div
                onClick={() => router.push(`/lawyers/${lawyer._id}`)}
                key={index}
                className="flex flex-col md:flex-row items-center md:items-start gap-6 text-white bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700 p-6 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-blue-400/30 hover:border-blue-400"
                data-aos="fade-up"
              >
                {/* Lawyer Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg flex-shrink-0">
                  <img
                    src={lawyer?.user?.profile_image_url || '/lawyer_vector.jpeg'}
                    alt={lawyer?.user?.fullname || 'Lawyer'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Lawyer Info */}
                <div className="flex-1 text-center md:text-left space-y-1">
                  <h3 className="text-2xl font-extrabold text-blue-400">{lawyer?.user?.username}</h3>
                  <p className="text-sm text-gray-300">📘 Specializations: <span className="text-white">{lawyer.specialization_id?.name}</span></p>
                  <p className="text-sm text-gray-300">⭐ Rating: <span className="text-white">{lawyer.rating}</span></p>
                  <p className="text-sm text-gray-300">⏳ Experience: <span className="text-white">{lawyer.years_of_experience} years</span></p>
                  <p className="text-sm text-gray-300">
                    📍 Locations: <span className="text-white">
                      {lawyer.user?.location?.city || 'N/A'}, {lawyer.user?.location?.state || 'N/A'}, {lawyer.user?.location?.country || 'N/A'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-300">📧 Email: <span className="text-white">{lawyer.user?.email}</span></p>
                  <p className="text-sm text-gray-300">📱 Phone: <span className="text-white">{lawyer.user?.phone}</span></p>
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
