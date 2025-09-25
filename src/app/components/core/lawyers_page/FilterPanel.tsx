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

export interface Locations {
  _id: string;
  city: string;
  state: string;
  country: string;
}

interface FilterSidebarProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export function FilterSidebar({ filters, setFilters, clearFilters, isCollapsed, setIsCollapsed }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle
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
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 bg-gray-600 text-white p-2 rounded-full shadow-lg md:hidden"
      >
        {isOpen ? <FaTimes /> : <FaFilter />}
      </button>

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed md:relative top-0 bg-gray-900 text-white h-full md:h-screen border-r border-gray-700 shadow-2xl transition-all duration-300 z-40 overflow-y-auto",
          isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72", // mobile behavior
          isCollapsed ? "md:w-20" : "md:w-72", // desktop collapse
        )}
      >
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute top-4 right-[-12px] bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full shadow-lg transition"
        >
          {isCollapsed ? "→" : "←"}
        </button>

        {/* Sidebar Content */}
        <div className="space-y-6 mt-12 px-4">
          {isCollapsed ? (
            // Icons-only view
            <div className="flex flex-col items-center gap-6 text-gray-400">
              <FaSearch title="Specializations" className="cursor-pointer hover:text-blue-400" />
              <FaStar title="Minimum Rating" className="cursor-pointer hover:text-yellow-400" />
              <FaClock title="Availability" className="cursor-pointer hover:text-green-400" />
              <FaBriefcase title="Experience" className="cursor-pointer hover:text-purple-400" />
              <FaMapMarkerAlt title="Locations" className="cursor-pointer hover:text-red-400" />
              <FaEraser title="Clear Filters" className="cursor-pointer hover:text-pink-400" onClick={clearFilters} />
            </div>
          ) : (
            // Full filter panel
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FaFilter className="text-blue-600" />
                Filters
              </h2>

              {/* Specializations */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1 ">
                  <FaSearch /> Specializations
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
                <label className="flex items-center gap-2 text-sm font-medium mb-1 ">
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
                <label className="flex items-center gap-2 text-sm font-medium mb-1 ">
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
                <label className="flex items-center gap-2 text-sm font-medium mb-1 ">
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

              {/* Locations */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1 ">
                  <FaMapMarkerAlt /> Locations
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
          )}
        </div>
      </div>
    </>
  );
}

export default FilterSidebar;