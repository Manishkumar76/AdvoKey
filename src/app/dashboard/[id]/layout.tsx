'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@/helpers/interfaces/user';
import { usePathname } from 'next/navigation';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [userData, setUserData] = useState<User | null>(null);

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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with top space */}
     <div className=' min-h-screen'> <aside className="w-60 bg-gray text-gray-300 p-4 pt-20 h-full rounded-tr-xl ">
        
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={userData?.profile_image_url}
            alt="Profile"
            className="w-12 h-12 rounded-full bg-gray-500"
          />
          <div>
            <h2 className="text-lg font-semibold">{userData?.username || 'User Name'}</h2>
            <Link href="/profile" className="text-xs hover:underline text-gray-600">
              View profile
            </Link>
          </div>
        </div>

        <nav className="space-y-1 text-sm">
  {[{ name: 'Dashboard', href: `/dashboard/${userData?._id}` }, { name: 'Chat', href: '/dashboard/chat' }].map(
    ({ name, href }) => (
      <Link
        key={name}
        href={href}
        className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
          pathname === href ? 'bg-gray-300 text-black' : 'hover:bg-gray-200 hover:text-black'
        }`}
      >
        <span className="w-5 h-5 bg-gray-400 rounded-full mr-3" />
        {name}
      </Link>
    )
  )}

  <hr className="my-4 border-gray-400" />

  <Link
    href={`./${userData?._id}/settings`}
    className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
      pathname === `/dashboard/${userData?._id}/settings` ? 'bg-gray-300 text-black' : 'hover:bg-gray-200 hover:text-black'
    }`}
  >
    <span className="w-5 h-5 bg-gray-400 rounded-full mr-3" />
    Settings
  </Link>
</nav>

      </aside></div>

      {/* Main content with top gap */}
      <main className="flex-1 p-6 pt-20 bg-white overflow-y-auto bg-gray-900 ">
        {children}
      </main>
    </div>
  );
}
