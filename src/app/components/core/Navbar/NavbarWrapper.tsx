'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbarOn = ['/login', '/signup','/verify-email','/admin/login','/admin/dashboard','/admin/dashboard/lawyers','/admin/dashboard/users','/admin/dashboard/consultations','/admin/dashboard/payments','/admin/dashboard/reviews','/admin/dashboard/settings'];

  if (hideNavbarOn.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}
