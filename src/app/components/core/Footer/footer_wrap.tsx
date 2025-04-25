'use client';
import { usePathname } from 'next/navigation';
import Footer from './footer';

export default function FooterWrap() {
  const pathname = usePathname();
  const hideNavbarOn = ['/login', '/signup','/verify-email','/admin/login','/admin/dashboard',`/admin/dashboard/lawyers`,`/admin/dashboard/lawyers`,`admin/dashboard/users`];

  if (hideNavbarOn.includes(pathname)) {
    return null;
  }

  return <Footer />;
}