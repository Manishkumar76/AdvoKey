'use client';

import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import AdvoKey_Logo from '@/app/assets/images/Advokey.png';
import UserDropdown from './profile_menu';


interface User {
  username: string;
  email?: string;
  role?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/users/me');
        setUser(response.data?.data);
      } catch (error: any) {
        
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/users/logout', { withCredentials: true });
      if (response.status === 200) {
        toast.success('Logout successful');
        setUser(null);
        router.push('/login');
      }
    } catch (error: any) {
      toast.error('An error occurred while logging out.');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={AdvoKey_Logo}
            alt="AdvoKey Logo"
            className="h-10 w-auto drop-shadow-lg shadow-white"
            priority
          />

        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-blue-400 transition font-medium">Home</Link>
          <Link href="/lawyers" className="hover:text-blue-400 transition font-medium">Lawyers</Link>
          <Link href="/about" className="hover:text-blue-400 transition font-medium">About</Link>

          {user ? (
            <>
              <UserDropdown
                user={{ username: user.username, avatar: 'https://i.pravatar.cc/150?img=3' }}
                handleLogout={() => handleLogout()}
              />

            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </nav>
    </header>
  );
}
