'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Hexagon, ShieldCheck, Trophy, BookOpen, LogOut, Mail, Phone, ExternalLink } from 'lucide-react';
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

          {user && (
            <nav className="hidden items-center gap-2 md:flex">
              <Link href="/dashboard" className={pathname.startsWith('/dashboard') ? 'rounded-full bg-[#081229] px-4 py-2 text-sm font-semibold text-[#eef7ff] shadow-sm shadow-[#0d1640]/40' : 'rounded-full px-4 py-2 text-sm text-[#94a9c8] transition hover:bg-[#081229] hover:text-[#f8fbff]'}>
                Quizzes
              </Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className={pathname === '/admin' ? 'rounded-full bg-[#081229] px-4 py-2 text-sm font-semibold text-[#eef7ff] shadow-sm shadow-[#0d1640]/40' : 'rounded-full px-4 py-2 text-sm text-[#94a9c8] transition hover:bg-[#081229] hover:text-[#f8fbff]'}>
                  Admin Dashboard
                </Link>
              )}
            </nav>
          )}

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

      <main className="pt-16">{children}</main>

      <footer className="border-t border-white/10 bg-[#020613]/95 px-6 py-10 text-slate-300 backdrop-blur-xl sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.12)]">
              Next-gen assessment hub
            </div>
            <h2 className="text-2xl font-semibold text-white">PulseQuiz is built for immersive learning, simplified admin control, and real-time insight.</h2>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              A modern quiz platform with student progress tracking, secure role-based navigation, and polished analytics wrapped in a premium dark UI.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-[#081229]/90 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Skill focus</p>
                <p className="mt-2 text-sm text-slate-200">Quizzes, categories, students, and admin insights.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-[#081229]/90 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Design style</p>
                <p className="mt-2 text-sm text-slate-200">Dark glassmorphism, vibrant gradients, and polished interface hierarchy.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Quick links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="/dashboard" className="text-slate-200 transition hover:text-cyan-300">Student Dashboard</a>
              </li>
              <li>
                <a href="/admin" className="text-slate-200 transition hover:text-cyan-300">Admin Hub</a>
              </li>
              <li>
                <a href="/login" className="text-slate-200 transition hover:text-cyan-300">Secure Login</a>
              </li>
              <li>
                <a href="/register" className="text-slate-200 transition hover:text-cyan-300">Create Account</a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Contact & credits</h3>
            <p className="text-sm text-slate-400">Need a demo or help extending the platform? Reach out anytime.</p>
            <div className="rounded-3xl border border-slate-800 bg-[#081229]/90 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">{siteBranding.productName}</p>
              <p className="mt-2 text-slate-400">{siteBranding.footerCredit}</p>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-300" />
                <a href={`mailto:${siteBranding.contacts.email}`} className="text-cyan-300 hover:text-cyan-200">{siteBranding.contacts.email}</a>
              </p>
              <p className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-300" />
                <a href="tel:+918720026790" className="text-cyan-300 hover:text-cyan-200">+918720026790</a>
              </p>
              <p className="inline-flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-cyan-300" />
                <a href={siteBranding.contacts.github} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200">{siteBranding.contacts.githubLabel}</a>
              </p>
              <p className="inline-flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-cyan-300" />
                <a href={siteBranding.contacts.linkedin} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200">{siteBranding.contacts.linkedinLabel}</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
