'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Hexagon, ShieldCheck, Trophy, BookOpen, LogOut } from 'lucide-react';
import { siteBranding } from '../lib/site-config';

const navItems = [
  { href: '/dashboard', label: 'Assessments', icon: BookOpen, visible: true },
  { href: '/admin', label: 'Admin Hub', icon: ShieldCheck, visible: false },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <div
      className="min-h-screen text-[#eef7ff]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 10% 12%, rgba(94, 234, 212, 0.18), transparent 20%), ' +
          'radial-gradient(circle at 82% 14%, rgba(129, 140, 248, 0.16), transparent 18%), ' +
          'linear-gradient(180deg, #02030b 0%, #030613 40%, #060918 100%)',
      }}
    >
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1a2c55]/70 bg-[#020613]/95 backdrop-blur-xl shadow-[0_18px_60px_-40px_rgba(12,20,44,0.9)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-violet-500 to-fuchsia-500 shadow-lg shadow-cyan-500/20">
              <Hexagon className="h-5 w-5 text-[#020617]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#94a9c8]">{siteBranding.productTagline}</p>
              <h1 className="text-lg font-semibold text-[#f4f8ff]">{siteBranding.productName}</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/dashboard" className={pathname.startsWith('/dashboard') ? 'rounded-full bg-[#081229] px-4 py-2 text-sm font-semibold text-[#eef7ff] shadow-sm shadow-[#0d1640]/40' : 'rounded-full px-4 py-2 text-sm text-[#94a9c8] transition hover:bg-[#081229] hover:text-[#f8fbff]'}>
              Quizzes
            </Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className={pathname === '/admin' ? 'rounded-full bg-[#081229] px-4 py-2 text-sm font-semibold text-[#eef7ff] shadow-sm shadow-[#0d1640]/40' : 'rounded-full px-4 py-2 text-sm text-[#94a9c8] transition hover:bg-[#081229] hover:text-[#f8fbff]'}>
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-[#0b163a] shimmer" />
            ) : user ? (
              <>
                <div className="hidden rounded-2xl border border-[#1f3564] bg-[#071127]/90 px-4 py-2 text-xs text-[#94a9c8] sm:block">
                  {user.role} • {user.name}
                </div>
                <button
                  onClick={() => logout(`/login?redirect=${encodeURIComponent(pathname)}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-[#020617] shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="rounded-full border border-[#334364] bg-[#081229] px-4 py-2 text-sm text-[#a8c7ef] transition hover:border-cyan-400/50 hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#020617] transition hover:brightness-110">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24">{children}</main>

      <footer className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-6 text-slate-400 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>© {new Date().getFullYear()} {siteBranding.productName}. {siteBranding.footerCredit}</p>
          <div className="space-y-1 text-sm text-slate-400 sm:text-right">
            <div>
              <span className="font-semibold text-slate-100">Email:</span>{' '}
              <a href={`mailto:${siteBranding.contacts.email}`} className="text-sky-300 hover:text-sky-200">{siteBranding.contacts.email}</a>
            </div>
            <div>
              <span className="font-semibold text-slate-100">LinkedIn:</span>{' '}
              <a href={siteBranding.contacts.linkedin} target="_blank" rel="noreferrer" className="text-sky-300 hover:text-sky-200">{siteBranding.contacts.linkedinLabel}</a>
            </div>
            <div>
              <span className="font-semibold text-slate-100">GitHub:</span>{' '}
              <a href={siteBranding.contacts.github} target="_blank" rel="noreferrer" className="text-sky-300 hover:text-sky-200">{siteBranding.contacts.githubLabel}</a>
            </div>
            <div>
              <span className="font-semibold text-slate-100">Contact:</span>{' '}
              <a href={`tel:${siteBranding.contacts.phone}`} className="text-sky-300 hover:text-sky-200">{siteBranding.contacts.phone}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
