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
        <div className="border-b border-slate-800/80 bg-[#020613]/90 backdrop-blur-xl shadow-[0_25px_90px_-40px_rgba(14,165,233,0.45)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300/80">PulseQuiz</p>
                <h1 className="text-lg font-semibold text-slate-50">Admin Console</h1>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                live system
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              {adminLinks.map((link) => {
                const active = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${active
                      ? 'bg-gradient-to-r from-cyan-500/18 to-violet-500/18 text-white shadow-[0_0_0_1px_rgba(96,165,250,0.3)]'
                      : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'} hover:-translate-y-0.5`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
