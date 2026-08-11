'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Home, ShieldCheck, Trophy, BookOpen, LogOut, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BookOpen, visible: true },
  { href: '/admin', label: 'Admin Hub', icon: ShieldCheck, visible: false },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_25%),#030512] text-slate-100">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-violet-500 to-emerald-400 shadow-lg shadow-slate-900/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Labmentix</p>
              <h1 className="text-lg font-semibold text-slate-100">Quiz Platform</h1>
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
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:brightness-110"
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
          <p>© {new Date().getFullYear()} Labmentix Quiz Platform. Built for secure assessment workflows.</p>
          <div className="flex flex-wrap items-center gap-3 text-slate-500">
            <span>Built with Next.js, Tailwind, Prisma, Express</span>
            <span className="hidden sm:inline">•</span>
            <Link href="/login" className="text-slate-300 hover:text-white">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
