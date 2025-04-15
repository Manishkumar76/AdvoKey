'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbarOn = ['/login', '/signup'];

  if (hideNavbarOn.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}
