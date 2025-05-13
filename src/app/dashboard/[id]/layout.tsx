'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { User } from '@/helpers/interfaces/user';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userData, setUserData] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: `/dashboard/${userData?._id}` },
    { name: 'Chat', href: `/dashboard/${userData?._id}/chat` },
    { name: 'Settings', href: `/dashboard/${userData?._id}/settings` },
  ];

  const handleNavClick = () => {
    setSidebarOpen(false); // close sidebar on nav click (mobile)
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 p-4 flex justify-between items-center z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="text-white w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* Push content below mobile navbar */}
      <div className="h-16 md:hidden" />

      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'block' : 'hidden'} md:block 
          w-full md:w-64 bg-gray-800 text-gray-300 p-4 pt-6 md:pt-20 
          transition-all duration-300 ease-in-out
        `}>
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={userData?.profile_image_url || '/user.jpg'}
              alt="Profile"
              className="w-12 h-12 rounded-full bg-gray-500 object-cover"
            />
            <div>
              <h2 className="text-base font-semibold">{userData?.username || 'User Name'}</h2>
              <p className="text-sm truncate">{userData?.email || 'User Email'}</p>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            {navLinks.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                onClick={handleNavClick}
                className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                  pathname === href
                    ? 'bg-gray-300 text-black'
                    : 'hover:bg-gray-200 hover:text-black'
                }`}
              >
                <span className="w-5 h-5 bg-gray-400 rounded-full mr-3" />
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
