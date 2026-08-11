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
      className="min-h-screen text-slate-100"
      style={{
        backgroundImage:
          'radial-gradient(circle at top left, rgba(124, 58, 237, 0.14), transparent 26%), ' +
          'radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.12), transparent 30%), ' +
          'linear-gradient(180deg, #070b1e 0%, #050816 45%, #0b1330 100%)',
      }}
    >
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-500 via-violet-600 to-cyan-400 shadow-lg shadow-slate-900/30">
              <Hexagon className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{siteBranding.productTagline}</p>
              <h1 className="text-lg font-semibold text-slate-100">{siteBranding.productName}</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/dashboard" className={pathname.startsWith('/dashboard') ? 'rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm shadow-slate-900/40' : 'rounded-full px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-slate-100'}>
              Quizzes
            </Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className={pathname === '/admin' ? 'rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm shadow-slate-900/40' : 'rounded-full px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-slate-100'}>
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-slate-800 shimmer" />
            ) : user ? (
              <>
                <div className="hidden rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-2 text-xs text-slate-300 sm:block">
                  {user.role} • {user.name}
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:brightness-110"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 transition hover:border-slate-500 hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24">{children}</main>

      <footer className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-6 text-slate-400 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>© {new Date().getFullYear()} {siteBranding.productName}. {siteBranding.footerCredit}</p>
          <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center sm:justify-between">
            <div className="text-sm text-slate-400">
              {siteBranding.footerCredit}
            </div>
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
        </div>
      </footer>
    </div>
  );
}
