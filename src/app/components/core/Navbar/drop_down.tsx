import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
interface User {
  id:string,
  username: string;
  avatar?: string;
}

interface UserDropdownProps {
  user: User;
  handleLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105 transition-transform duration-200"
      >
        <img
          src={user.avatar || '/default-avatar.png'}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
        />
        <div className=''>{user.username}</div>
        <svg
          className={`w-4 h-4 text-white ml-1 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
          <div className="py-2 text-sm text-gray-700">
            <Link
              href={`/dashboard/${user.id}`}
              className="block px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition"
            >
              User Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 focus:bg-red-100 focus:outline-none transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
