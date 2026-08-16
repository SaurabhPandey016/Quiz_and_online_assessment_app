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
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('');
    setResetLink('');
    setSubmitting(true);

    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      const generatedResetLink = res.data?.data?.resetUrl || '';

      if (generatedResetLink) {
        setResetLink(generatedResetLink);
        setStatus(res.data.message || 'A reset link has been generated successfully.');
      } else {
        setStatus(res.data.message || 'If the email exists, a reset link has been generated below.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to process password reset request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!resetLink) return;

    try {
      await navigator.clipboard.writeText(resetLink);
      setStatus('Reset link copied. Paste it in the browser to continue.');
    } catch {
      setError('Copy failed. You can still select and copy the reset link manually.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030b] p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-[#1b2d58] bg-[#081229]/95 p-8 shadow-[0_28px_90px_-42px_rgba(8,18,41,0.92)] backdrop-blur-xl">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[#94a9c8]">Password recovery</p>
          <h1 className="text-3xl font-extrabold text-[#eef7ff]">Reset your {siteBranding.productName} password</h1>
          <p className="text-sm text-[#b8c7e1]">Enter the email address for your account and we will send a reset token.</p>
        </div>

        {status && (
          <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <p>{status}</p>
            {resetLink && (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-emerald-400/30 bg-slate-950/40 p-3 text-[11px] break-all text-emerald-50">
                  {resetLink}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href={resetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-500/20"
                  >
                    Open link
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-sky-400 hover:text-white"
                  >
                    Copy link
                  </button>
                </div>
              </div>
            )}
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
