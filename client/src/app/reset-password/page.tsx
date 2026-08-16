'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { siteBranding } from '@/lib/site-config';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromParams = params.get('token');

    if (!tokenFromParams) {
      setError('Missing reset token. Please request a new password reset link.');
      return;
    }

    setToken(tokenFromParams);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await apiClient.post('/auth/reset-password', { token, password });
      setStatus('Your password has been reset successfully. Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Unable to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030b] p-4">
      <div className="w-full max-w-md rounded-4xl border border-[#1b2d58] bg-[#081229]/95 p-8 shadow-[0_28px_90px_-42px_rgba(8,18,41,0.92)] backdrop-blur-xl">
        <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-[#94a9c8]">Confirm reset</p>
            <h1 className="text-3xl font-extrabold text-[#eef7ff]">Choose a new password</h1>
            <p className="text-sm text-[#b8c7e1]">Set a fresh password for your {siteBranding.productName} account.</p>
          </div>
        {status && (
          <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {status}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Confirm password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !token}
            className="w-full rounded-3xl bg-linear-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          <Link href="/login" className="font-semibold text-slate-100 hover:text-white">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
