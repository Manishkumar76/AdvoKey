import { Home, Users, Calendar, DollarSign, MessageCircle, Settings } from 'lucide-react';

export const sidebarItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/dashboard/users', icon: Users },
  { name: 'Lawyers', href: '/admin/dashboard/lawyers', icon: Users },
  { name: 'Consultations', href: '/admin/dashboard/consultations', icon: Calendar },
  { name: 'Payments', href: '/admin/dashboard/payments', icon: DollarSign },
  { name: 'Reviews', href: '/admin/dashboard/reviews', icon: MessageCircle },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },

  ];
  