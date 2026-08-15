'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

const difficultyOptions = [
  { value: '', label: 'All Difficulty' },
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

export default function DashboardPage() {
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    categoryId: '',
    difficulty: '',
    minDuration: '',
    maxDuration: '',
  });

  const fetchQuizzes = async (currentFilters = filters) => {
    setIsSearching(true);
    try {
      const res = await apiClient.get('/student/quizzes', {
        params: {
          search: searchInput.trim() || undefined,
          categoryId: currentFilters.categoryId || undefined,
          difficulty: currentFilters.difficulty || undefined,
          minDuration: currentFilters.minDuration || undefined,
          maxDuration: currentFilters.maxDuration || undefined,
        },
      });

      setAllQuizzes(res.data.data.quizzes || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load quizzes.');
      setAllQuizzes([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setInitialLoading(true);
      setError('');

      try {
        const [quizzesRes, categoriesRes, historyRes, leaderboardRes] = await Promise.all([
          apiClient.get('/student/quizzes', {
            params: {
              search: searchInput.trim() || undefined,
              categoryId: filters.categoryId || undefined,
              difficulty: filters.difficulty || undefined,
              minDuration: filters.minDuration || undefined,
              maxDuration: filters.maxDuration || undefined,
            },
          }),
          apiClient.get('/student/categories'),
          apiClient.get('/student/attempts/history'),
          apiClient.get('/student/leaderboard'),
        ]);

        setAllQuizzes(quizzesRes.data.data.quizzes || []);
        setCategories(categoriesRes.data.data.categories || []);
        setHistory(historyRes.data.data.history || []);
        setLeaderboard(leaderboardRes.data.data.leaderboard || []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load the student dashboard.');
        setAllQuizzes([]);
        setHistory([]);
        setLeaderboard([]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuizzes();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput, filters.categoryId, filters.difficulty, filters.minDuration, filters.maxDuration]);

  const stats = useMemo(() => {
    const completedAttempts = history.filter((item) => item.status === 'COMPLETED' && Number.isFinite(Number(item.percentage)));
    const validScores = completedAttempts.map((item) => Number(item.percentage) || 0);
    const averageScore = validScores.length ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0;
    const highestScore = validScores.length ? Math.max(...validScores) : 0;
    const passed = completedAttempts.filter((item) => Number(item.percentage || 0) >= Number(item.quiz?.passingScore || 0)).length;
    const failed = history.filter((item) => item.status === 'FAILED').length + completedAttempts.filter((item) => Number(item.percentage || 0) < Number(item.quiz?.passingScore || 0)).length;

    return {
      attempted: history.length,
      passed,
      failed,
      averageScore: Number(averageScore.toFixed(2)),
      highestScore: Number(highestScore.toFixed(2)),
    };
  }, [history]);

  if (initialLoading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400 shadow-lg shadow-slate-950/30">
        Loading your student dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-600/20 bg-rose-500/10 p-8 text-rose-200">
        <strong>Unable to load dashboard:</strong> {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Student Summary</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-100">Welcome back to your learning center.</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">
                  Discover published quizzes, track progress, and view your recent performance history all in one place.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Attempts', value: stats.attempted, tone: 'from-sky-500 to-violet-500' },
                { label: 'Passed', value: stats.passed, tone: 'from-emerald-500 to-teal-500' },
                { label: 'Average', value: `${stats.averageScore}%`, tone: 'from-fuchsia-500 to-violet-500' },
                { label: 'Best Score', value: `${stats.highestScore}%`, tone: 'from-amber-500 to-orange-500' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner shadow-slate-950/10">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-100">{stat.value}</p>
                  <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${stat.tone}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Find your next quiz</h3>
                <p className="text-sm text-slate-500">Search, filter, and choose the right assessment for your skills.</p>
              </div>
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-3">
                <div className="relative min-w-0">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search quizzes"
                    aria-label="Search quizzes"
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300 transition hover:border-sky-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                >
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {isSearching ? (
              <div className="rounded-4xl border border-dashed border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">
                Searching quizzes...
              </div>
            ) : allQuizzes.length === 0 ? (
              <div className="rounded-4xl border border-dashed border-slate-800 bg-slate-900/80 p-10 text-center text-slate-500">
                No published quizzes match the selected filters.
              </div>
            ) : (
              allQuizzes.map((quiz) => (
                <div key={quiz.id} className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{quiz.category?.name || 'General'}</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-100">{quiz.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{quiz.description || 'No description provided.'}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${quiz.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-300' : quiz.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-300' : 'bg-rose-500/10 text-rose-300'}`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-sm text-slate-400">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Duration</p>
                      <p className="mt-2 text-base text-slate-100">{quiz.duration} min</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-sm text-slate-400">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Passing Score</p>
                      <p className="mt-2 text-base text-slate-100">{quiz.passingScore}%</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-400">{quiz._count?.questions || 0} questions • {quiz.maxAttempts} attempts allowed</div>
                    <Link
                      href={`/dashboard/runner/${quiz.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                    >
                      Start Quiz
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Leaderboard</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-100">Top performers</h3>

            {leaderboard.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">No leaderboard data is available yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {leaderboard.map((entry, index) => (
                  <div key={entry.userId} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{index + 1}. {entry.name}</p>
                        <p className="text-xs text-slate-500">{entry.completedQuizzes} completed</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-100">{entry.averageScore.toFixed(0)}%</p>
                        <p className="text-xs text-slate-500">Best {entry.highestScore.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Attempt history</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-100">Recent scores</h3>
              </div>
            </div>

            {history.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">You have not taken any quizzes yet.</p>
            ) : (
              <div className="mt-6 space-y-3">
                {history.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
                      <div>
                        <p className="font-semibold text-slate-100">{item.quiz.title}</p>
                        <p>{new Date(item.startedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-100">{item.percentage.toFixed(0)}%</p>
                        <p className={item.status === 'COMPLETED' ? 'text-emerald-400' : 'text-rose-400'}>{item.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
