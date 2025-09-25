'use client';

import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  FaUsers, FaStar, FaUserCheck, FaUserClock,
  FaFilter, FaSearch, FaClock,
  FaMapMarkerAlt, FaBriefcase, FaEraser
} from 'react-icons/fa';

// Interfaces
export interface FilterOptions {
  specialization: string;
  rating: number;
  availability: string;
  experience: number;
  location: string;
}

export interface Locations {
  _id: string;
  city: string;
  state: string;
  country: string;
}

export interface Lawyers {
  _id: string;
  specialization_id?: { name: string };
  rating: number;
  years_of_experience: number;
  user?: {
    username?: string;
    fullname?: string;
    profile_image_url?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
}

// Default filters
const defaultFilters: FilterOptions = {
  specialization: '',
  rating: 0,
  availability: '',
  experience: 0,
  location: '',
};

// Sidebar Component (Simple & Fixed)
function FilterSidebar({
  filters,
  setFilters,
  clearFilters,
}: {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
}) {
  const [locations, setLocations] = useState<Locations[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/api/location');
        setLocations(response.data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="h-full w-64 bg-gray-900 text-white border-r border-gray-700 shadow-2xl p-6 overflow-y-auto fixed top-0 left-0">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
        <FaFilter className="text-blue-600" /> Filters
      </h2>

      {/* Specializations */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <FaSearch /> Specializations
        </label>
        <input
          type="text"
          value={filters.specialization}
          onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <FaStar /> Minimum Rating
        </label>
        <input
          type="number"
          min={1}
          max={5}
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Availability */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <FaClock /> Availability
        </label>
        <select
          value={filters.availability}
          onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any</option>
          <option value="available">Available Today</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <FaBriefcase /> Years of Experience
        </label>
        <input
          type="number"
          min={0}
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Locations */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <FaMapMarkerAlt /> Locations
        </label>
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any</option>
          {locations.map((loc) => (
            <option key={loc._id} value={loc.state}>
              {loc.state}, {loc.country}
            </option>
          ))}
        </select>
      </div>

      {/* Clear */}
      <button
        onClick={clearFilters}
        className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
      >
        <FaEraser /> Clear Filters
      </button>
    </div>
  );
}

// Main Page
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
      const res = await axios.get('/api/lawyers');
      setLawyers(res.data);
      setFilteredLawyers(res.data);
    } catch (err) {
      setError('Error fetching lawyers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = lawyers.filter((lawyer) => {
      const user = lawyer?.user;
      const location = user?.location;
      return (
        (!filters.specialization ||
          lawyer.specialization_id?.name?.toLowerCase().includes(filters.specialization.toLowerCase())) &&
        (!filters.rating || lawyer.rating >= filters.rating) &&
        (!filters.experience || lawyer.years_of_experience >= filters.experience) &&
        (!filters.location ||
          location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
          location?.state?.toLowerCase().includes(filters.location.toLowerCase()) ||
          location?.country?.toLowerCase().includes(filters.location.toLowerCase())) &&
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
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <svg className="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (error || !lawyers) {
    return <div className="flex items-center justify-center h-screen bg-black">
      <p className="text-red-500 text-lg">{error || 'Lawyer not found'}</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar Fixed */}
      <FilterSidebar filters={filters} setFilters={setFilters} clearFilters={clearFilters} />

      {/* Main */}
      <div className="flex-1 ml-64 p-6 space-y-6">
        {/* Search Bar */}
        <div className="sm:mt-20 top-28 z-30 bg-gray-900 pb-4">
          <div className="relative group w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400">🔍</span>
            <input
              type="text"
              placeholder="Search lawyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 text-white border border-gray-700 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                transition-all duration-300 shadow-md group-hover:shadow-blue-500/20 
                transform group-hover:scale-[1.01] focus:scale-[1.02]"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-xl shadow-lg text-white flex items-center gap-3">
            <FaUsers size={28} />
            <div><p className="text-sm">Total Lawyers</p><h3 className="text-xl font-bold">{lawyers.length}</h3></div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 p-4 rounded-xl shadow-lg text-white flex items-center gap-3">
            <FaStar size={28} />
            <div><p className="text-sm">Avg Rating</p><h3 className="text-xl font-bold">{(lawyers.reduce((s, l) => s + l.rating, 0) / lawyers.length).toFixed(1)}</h3></div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-xl shadow-lg text-white flex items-center gap-3">
            <FaUserCheck size={28} />
            <div><p className="text-sm">Available</p></div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-4 rounded-xl shadow-lg text-white flex items-center gap-3">
            <FaUserClock size={28} />
            <div><p className="text-sm">Avg Experience</p><h3 className="text-xl font-bold">{(lawyers.reduce((s, l) => s + l.years_of_experience, 0) / lawyers.length).toFixed(1)} yrs</h3></div>
          </div>
        </div>

        {/* Lawyer Cards */}
        {filteredLawyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredLawyers.map((lawyer, i) => (
              <div
                onClick={() => router.push(`/lawyers/${lawyer._id}`)}
                key={i}
                className="cursor-pointer text-white bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 
                  border border-gray-700 p-6 rounded-2xl shadow-lg 
                  transition-all duration-300 transform hover:scale-105 hover:shadow-blue-400/30 hover:border-blue-400"
                data-aos="fade-up"
              >
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-4">
                  <img src={lawyer?.user?.profile_image_url || '/lawyer_vector.jpeg'} alt={lawyer?.user?.fullname || 'Lawyer'} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-extrabold text-blue-400 text-center">{lawyer?.user?.username}</h3>
                <p className="text-sm text-gray-300 text-center">⭐ {lawyer.rating} | {lawyer.years_of_experience} yrs</p>
                <p className="text-sm text-gray-400 text-center mt-2">{lawyer.user?.location?.city || 'N/A'}, {lawyer.user?.location?.state || 'N/A'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-6">No lawyers found matching the criteria.</div>
        )}
      </div>
    </div>
  );
};

export default LawyersPage;
