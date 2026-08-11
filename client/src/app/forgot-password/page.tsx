'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { siteBranding } from '@/lib/site-config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('');
    setSubmitting(true);

    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      setStatus(res.data.message || 'If the email exists, a reset token has been generated.');
    } catch (err: any) {
      setError(err.message || 'Unable to process password reset request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-4xl border border-slate-800 bg-slate-900/95 p-8 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.9)]">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Password recovery</p>
          <h1 className="text-3xl font-extrabold text-slate-100">Reset your {siteBranding.productName} password</h1>
          <p className="text-sm text-slate-400">Enter the email address for your account and we will send a reset token.</p>
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
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-3xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? 'Sending reset request...' : 'Send reset token'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Remembered your password?{' '}
          <Link href="/login" className="font-semibold text-slate-100 hover:text-white">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
