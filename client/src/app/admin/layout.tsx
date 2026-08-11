'use client';

import React from 'react';
import { AdminGuard } from '@/components/admin-guard';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-transparent text-slate-100">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
