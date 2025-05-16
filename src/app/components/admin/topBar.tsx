'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/helpers/interfaces/user';

const Topbar = () => {
  const [user, setUser] = useState<User |null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/users/logout', { method: 'GET' });
      if (res.ok) {
        router.push('/login');
      } else {
        const error = await res.json();
        console.error('Logout failed:', error);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <header className="bg-white border-b shadow-sm p-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">{user?.username|| 'Welcome Admin'}</h1>
      <div className="flex items-center gap-4">
        {!loading && user ? (
          <>
            <span className="text-sm text-gray-700">Welcome, {user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-500">Loading...</span>
        )}
      </div>
    </header>
  );
};

export default Topbar;
