'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbarOn = ['/login', '/signup','/verify-email','/admin/login','/admin/dashboard','/admin/dashboard/lawyers','/admin/dashboard/users','/admin/dashboard/appointments','/admin/dashboard/categories','/admin/dashboard/reviews','/admin/dashboard/settings'];

  if (hideNavbarOn.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}
