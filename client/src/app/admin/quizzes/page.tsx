'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import CreateSuccessAnimation from '@/components/create-success-animation';

interface CategoryOption {
  id: string;
  name: string;
}

interface QuizRecord {
  id: string;
  title: string;
  description?: string;
  category: { name: string };
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  duration: number;
  passingScore: number;
  maxAttempts: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
}

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizRecord[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    difficulty: 'MEDIUM',
    duration: 15,
    passingScore: 60,
    maxAttempts: 3,
    status: 'DRAFT',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createdMessage, setCreatedMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [quizzesRes, categoriesRes] = await Promise.all([
          apiClient.get('/admin/quizzes'),
          apiClient.get('/admin/categories'),
        ]);

        setQuizzes(quizzesRes.data.data.quizzes);
        setCategories(categoriesRes.data.data.categories);
      } catch (err: any) {
        setError(err.message || 'Unable to load quizzes or categories.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const createQuiz = async () => {
    if (!form.title || !form.categoryId) {
      setError('Title and category are required.');
      return;
    }
    try {
      const res = await apiClient.post('/admin/quizzes', form);
      setQuizzes((prev) => [res.data.data.quiz, ...prev]);
      setForm((prev) => ({ ...prev, title: '', description: '' }));
      setCreatedMessage(`Quiz “${res.data.data.quiz.title}” created`);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Unable to create quiz.');
    }
  };

  const deleteQuiz = async (id: string) => {
    if (!window.confirm('Delete this quiz permanently?')) return;
    try {
      await apiClient.delete(`/admin/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (err: any) {
      setError(err.message || 'Unable to delete quiz.');
    }
  };

  const togglePublish = async (quiz: QuizRecord) => {
    try {
      const nextStatus = quiz.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const res = await apiClient.patch(`/admin/quizzes/${quiz.id}`, { status: nextStatus });
      setQuizzes((prev) => prev.map((item) => (item.id === quiz.id ? res.data.data.quiz : item)));
    } catch (err: any) {
      setError(err.message || 'Unable to update quiz status.');
    }
  };

  const statusCount = useMemo(() => ({
    published: quizzes.filter((quiz) => quiz.status === 'PUBLISHED').length,
    draft: quizzes.filter((quiz) => quiz.status === 'DRAFT').length,
    archived: quizzes.filter((quiz) => quiz.status === 'ARCHIVED').length,
  }), [quizzes]);

  if (loading) {
    return <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Loading quiz manager...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Quiz Management</p>
            <h1 className="text-3xl font-bold text-slate-100">Create and maintain assessments</h1>
            <p className="mt-2 text-slate-400">Build quizzes, publish them live, and keep questions aligned to categories.</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-4xl border border-rose-600/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/20">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Quiz title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="New quiz title"
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Optional description"
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' })}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Duration (minutes)</label>
              <input
                type="number"
                min={1}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Passing score (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.passingScore}
                onChange={(e) => setForm({ ...form, passingScore: Number(e.target.value) })}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Max attempts</label>
              <input
                type="number"
                min={1}
                value={form.maxAttempts}
                onChange={(e) => setForm({ ...form, maxAttempts: Number(e.target.value) })}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' })}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <button
              onClick={createQuiz}
              className="cursor-pointer rounded-3xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Create quiz
            </button>
          </div>
        </div>
        {createdMessage && <CreateSuccessAnimation message={createdMessage} />}
      </div>

      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Published</p>
            <p className="mt-3 text-3xl font-semibold text-slate-100">{statusCount.published}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Draft</p>
            <p className="mt-3 text-3xl font-semibold text-slate-100">{statusCount.draft}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Archived</p>
            <p className="mt-3 text-3xl font-semibold text-slate-100">{statusCount.archived}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-4xl border border-slate-800 bg-slate-950/95 shadow-xl shadow-slate-950/20">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Quiz</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Category</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Difficulty</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Duration</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-3 text-right font-semibold uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950">
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="px-6 py-4 text-slate-100">{quiz.title}</td>
                <td className="px-6 py-4 text-slate-400">{quiz.category?.name || '—'}</td>
                <td className="px-6 py-4 text-slate-400">{quiz.difficulty}</td>
                <td className="px-6 py-4 text-slate-400">{quiz.duration}m</td>
                <td className="px-6 py-4 text-slate-400">{quiz.status}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => togglePublish(quiz)}
                    className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-slate-500"
                  >
                    {quiz.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
                    className="rounded-full border border-rose-500 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
