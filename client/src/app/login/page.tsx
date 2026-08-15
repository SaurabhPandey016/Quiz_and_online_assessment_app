'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { siteBranding } from '@/lib/site-config';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    const registered = params.get('registered');
    if (redirect) setRedirectPath(redirect);
    if (registered === '1') setRegisteredSuccess(true);
  }, []);

  React.useEffect(() => {
    if (user) {
      const target = redirectPath.startsWith('/') ? redirectPath : user.role === 'ADMIN' ? '/admin' : '/dashboard';
      router.replace(target);
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const user = await login(formData);
      const target = redirectPath.startsWith('/') ? redirectPath : user?.role === 'ADMIN' ? '/admin' : '/dashboard';
      router.replace(target);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030b] p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-[#1b2d58] bg-[#081229]/95 p-8 shadow-[0_28px_90px_-42px_rgba(8,18,41,0.92)] backdrop-blur-xl">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#94a9c8]">Secure Portal</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#eef7ff]">Sign in to {siteBranding.productName}</h1>
          <p className="text-sm text-[#b8c7e1]">Access quizzes, review results, and manage your learning experience.</p>
        </div>

        {registeredSuccess && (
          <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            Registration successful. Please sign in with your new account.
          </div>
        )}

        {errorMsg && (
          <div className="mt-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@domain.com"
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-3xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            New to PulseQuiz?{' '}
            <Link href="/register" className="font-semibold text-slate-100 hover:text-white">
              Create an account
            </Link>
          </p>
          <Link href="/forgot-password" className="font-semibold text-slate-100 hover:text-white">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
