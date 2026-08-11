'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/admin/categories')
      .then((res) => setCategories(res.data.data.categories))
      .catch((err: any) => setError(err.message || 'Unable to load categories.'))
      .finally(() => setLoading(false));
  }, []);

  const addCategory = async () => {
    try {
      const res = await apiClient.post('/admin/categories', newCategory);
      setCategories((prev) => [...prev, res.data.data.category]);
      setNewCategory({ name: '', description: '' });
    } catch (err: any) {
      setError(err.message || 'Unable to create category.');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await apiClient.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err: any) {
      setError(err.message || 'Unable to delete category.');
    }
  };

  const updateCategory = async (id: string) => {
    const updatedName = prompt('Category name', categories.find((cat) => cat.id === id)?.name || '');
    if (!updatedName) return;

    try {
      const res = await apiClient.patch(`/admin/categories/${id}`, { name: updatedName });
      setCategories((prev) => prev.map((cat) => (cat.id === id ? res.data.data.category : cat)));
    } catch (err: any) {
      setError(err.message || 'Unable to update category.');
    }
  };

  if (loading) {
    return <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Loading categories...</div>;
  }

  if (error) {
    return <div className="rounded-4xl border border-rose-600/20 bg-rose-500/10 p-8 text-rose-200">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Category Manager</p>
            <h1 className="text-3xl font-bold text-slate-100">Manage quiz categories</h1>
            <p className="mt-2 text-slate-400">Create, rename, or remove category groupings for your quizzes.</p>
          </div>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-8 shadow-xl shadow-slate-950/20">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={newCategory.name}
            onChange={(event) => setNewCategory((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="New category name"
            className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <button
            onClick={addCategory}
            className="rounded-3xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-4xl border border-slate-800 bg-slate-950/95 shadow-xl shadow-slate-950/20">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Category</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Description</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Created</th>
              <th className="px-6 py-3 text-right font-semibold uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 text-slate-100">{category.name}</td>
                <td className="px-6 py-4 text-slate-400">{category.description || 'No description'}</td>
                <td className="px-6 py-4 text-slate-400">{new Date(category.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => updateCategory(category.id)}
                    className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-slate-500"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
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
