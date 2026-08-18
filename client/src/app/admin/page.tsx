'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import AdminCharts from '@/components/admin-charts'; // Import our new chart component

interface Stats {
  totalStudents: number;
  totalQuizzes: number;
  publishedQuizzes: number;
  draftQuizzes: number;
  totalQuestions: number;
  totalAttempts: number;
  averageScore: number;
}

interface ChartPayload {
  registrationTrends: Array<{ date: string; count: number }>;
  attemptTrends: Array<{ date: string; count: number }>;
  popularQuizzes: Array<{ title: string; attemptCount: number }>;
}

function LinkCard({ href, title, description }: { href: string; title: string; description: string }) {
  const isAnchor = href.startsWith('#');

  const cardContent = (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">Admin Navigation</p>
      <h2 className="mt-3 text-xl font-semibold text-slate-100 transition group-hover:text-cyan-300">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      <span className="mt-4 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Open</span>
    </>
  );

  const commonClassName =
    'premium-card group block rounded-[28px] p-6 transition-all duration-200';

  return isAnchor ? (
    <a href={href} className={commonClassName}>
      {cardContent}
    </a>
  ) : (
    <Link href={href} className={commonClassName}>
      {cardContent}
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartsData, setChartsData] = useState<ChartPayload | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiClient.get('/admin/analytics/dashboard')
      .then((res) => {
        if (res.data.status === 'success') {
          // Extract both the summary stats and the time-series arrays
          setStats(res.data.data.statistics);
          setChartsData(res.data.data.charts);
        }
      })
      .catch((err: { message: string }) => {
        setError(err.message || 'Failed to sync platform intelligence metrics.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-400 font-medium">Syncing live analytics matrices...</div>;
  }
  
  if (error || !stats || !chartsData) {
    return <div className="p-6 text-rose-400 font-semibold">⚠️ Error: {error || 'No active metrics returned.'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-800/80 bg-slate-950/60 p-6 shadow-[0_25px_90px_-38px_rgba(59,130,246,0.38)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-300/80">Overview</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-100">Platform Analytics Control Matrix</h1>
        <p className="mt-2 text-sm text-slate-400">Live metrics compiled from your assessment system and engagement activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href="/admin/users" title="Manage Users" description="Approve, block, or delete accounts." />
        <LinkCard href="/admin/categories" title="Manage Categories" description="Create and organize quiz topics." />
        <LinkCard href="/admin/quizzes" title="Manage Quizzes" description="Publish quizzes and control status." />
        <LinkCard href="/admin/questions" title="Manage Questions" description="Add questions and correct answers." />
        <LinkCard href="/admin#analytics" title="Analytics" description="Scroll to analytics metrics and charts." />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="premium-card rounded-[28px] p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Total Students</h3>
          <p className="mt-4 text-3xl font-black text-slate-100">{stats.totalStudents}</p>
        </div>

        <div className="premium-card rounded-[28px] p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Total Quizzes</h3>
          <p className="mt-4 text-3xl font-black text-slate-100">{stats.totalQuizzes}</p>
          <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-slate-400">{stats.publishedQuizzes} Published • {stats.draftQuizzes} Drafts</span>
        </div>

        <div className="premium-card rounded-[28px] p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Total Questions</h3>
          <p className="mt-4 text-3xl font-black text-slate-100">{stats.totalQuestions}</p>
        </div>
      </div>

      <section id="analytics" className="scroll-mt-24">
        <AdminCharts 
          registrationTrends={chartsData.registrationTrends}
          attemptTrends={chartsData.attemptTrends}
          popularQuizzes={chartsData.popularQuizzes}
        />
      </section>
    </div>
  );
}