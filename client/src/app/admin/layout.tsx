'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/components/admin-guard';

interface LayoutProps {
  children: React.ReactNode;
}

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/quizzes', label: 'Quizzes' },
  { href: '/admin/questions', label: 'Questions' },
];

export default function AdminLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#02030b] text-slate-100">
        <div className="border-b border-[#1c2f5d] bg-[#020613]/95 backdrop-blur-xl shadow-[0_20px_80px_-40px_rgba(8,18,41,0.88)]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${pathname === link.href ? 'bg-[#081229] text-[#eef7ff]' : 'text-[#94a9c8] hover:bg-[#081229] hover:text-[#f8fbff]'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
