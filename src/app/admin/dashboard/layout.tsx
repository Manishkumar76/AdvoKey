// app/admin/layout.tsx
'use client';
import React from 'react';
import Sidebar from '@/app/components/admin/sideBar';
import Topbar from '@/app/components/admin/topBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
