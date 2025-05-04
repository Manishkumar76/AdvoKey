'use client';

import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import AdvoKey_Logo from '@/app/assets/images/Logo.png';
import UserDropdown from './drop_down';

import { User } from '@/helpers/interfaces/user';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/users/me');
        setUser(response.data?.data);
      } catch {
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
    } catch {
      toast.error('An error occurred while logging out.');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10 rounded-bl-xl rounded-br-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={AdvoKey_Logo}
            alt="AdvoKey Logo"
            className="h-10 w-auto drop-shadow-cyan-500/50"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-blue-400 transition font-medium">Home</Link>
          <Link href="/lawyers" className="hover:text-blue-400 transition font-medium">Lawyers</Link>
          <Link href="/about" className="hover:text-blue-400 transition font-medium">About</Link>

          {user ? (
            <UserDropdown
              user={{ id: user._id, username: user.username, avatar: user.profile_image_url }}
              handleLogout={handleLogout}
            />
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-black/90 min-h-screen backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col items-center gap-4 py-6 text-sm text-white ">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition font-medium">
            Home
          </Link>
          <Link href="/lawyers" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition font-medium">
            Lawyers
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition font-medium">
            About
          </Link>

          {user ? (
            <div className="flex flex-col items-center ">
              <UserDropdown
                user={{ id: user._id, username: user.username, avatar: user.profile_image_url }}
                handleLogout={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
              />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
