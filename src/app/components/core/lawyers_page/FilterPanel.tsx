'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { 
  FaFilter, FaTimes, FaSearch, FaStar, 
  FaClock, FaMapMarkerAlt, FaBriefcase, FaEraser 
} from 'react-icons/fa';
import clsx from 'clsx';

export interface FilterOptions {
  specialization: string;
  rating: number;
  availability: string;
  experience: number;
  location: string;
}

export interface Location {
  _id: string;
  city: string;
  state: string;
  country: string;
}

interface FilterSidebarProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
}

export default function FilterSidebar({ filters, setFilters, clearFilters }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

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
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg md:hidden"
      >
        {isOpen ? <FaTimes /> : <FaFilter />}
      </button>

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full bg-white shadow-2xl p-6 w-72 transform transition-transform duration-300 z-40 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 md:block md:w-72 md:h-auto md:shadow-none md:bg-transparent"
        )}
      >
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            Filters
          </h2>

          {/* Specialization */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-700">
              <FaSearch /> Specialization
            </label>
            <input
              type="text"
              value={filters.specialization}
              onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-700">
              <FaStar /> Minimum Rating
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-700">
              <FaClock /> Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="available">Available Today</option>
              <option value="busy">Busy</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-700">
              <FaBriefcase /> Years of Experience
            </label>
            <input
              type="number"
              min={0}
              value={filters.experience}
              onChange={(e) => setFilters({ ...filters, experience: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-700">
              <FaMapMarkerAlt /> Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {locations.map((location) => (
                <option key={location._id} value={location.state}>
                  {location.state}, {location.country}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Button */}
          <button
            onClick={clearFilters}
            className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FaEraser /> Clear Filters
          </button>
        </div>
      </div>
    </>
  );
}
