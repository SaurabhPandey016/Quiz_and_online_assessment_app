'use client';

import React from 'react';
import { AdminGuard } from '@/components/admin-guard';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-900 p-6 border-b md:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-indigo-400">Quiz Admin Portal</h2>
            <div className="mt-6 text-sm font-semibold px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              📊 Control Matrix
            </div>
          </div>
        </aside>
        <main className="flex-1 p-8 md:p-12">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
