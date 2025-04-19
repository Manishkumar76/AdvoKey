'use client';
import { usePathname } from 'next/navigation';
import Footer from './footer';

export default function FooterWrap() {
  const pathname = usePathname();
  const hideNavbarOn = ['/login', '/signup'];

  if (hideNavbarOn.includes(pathname)) {
    return null;
  }

  return <Footer />;
}