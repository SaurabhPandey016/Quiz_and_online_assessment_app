'use client';

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Platform Analytics Control Matrix</h1>
        <p className="text-slate-400 text-sm mt-1">Live metrics compiled from your Supabase PostgreSQL cluster variables.</p>
      </div>

      {/* Summary Scorecard Grid Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</h3>
          <p className="text-3xl font-black text-slate-100 mt-2">{stats.totalStudents}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Quizzes</h3>
          <p className="text-3xl font-black text-slate-100 mt-2">{stats.totalQuizzes}</p>
          <span className="text-[10px] text-slate-500 block mt-1">{stats.publishedQuizzes} Published | {stats.draftQuizzes} Drafts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Questions</h3>
          <p className="text-3xl font-black text-slate-100 mt-2">{stats.totalQuestions}</p>
        </div>
      </div>

      {/* RENDER THE CHART GRAPH SYSTEM INFRASTRUCTURE */}
      <AdminCharts 
        registrationTrends={chartsData.registrationTrends}
        attemptTrends={chartsData.attemptTrends}
        popularQuizzes={chartsData.popularQuizzes}
      />
    </div>
  );
}