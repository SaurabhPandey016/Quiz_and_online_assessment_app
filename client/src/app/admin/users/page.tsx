'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'USER',
  });

  useEffect(() => {
    apiClient
      .get('/admin/users')
      .then((res) => {
        setUsers(res.data.data.users);
      })
      .catch((err: any) => setError(err.message || 'Unable to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setCreating(true);

    try {
      const res = await apiClient.post('/admin/users', formState);
      setUsers((prev) => [res.data.data.user, ...prev]);
      setFormState({ name: '', email: '', password: '', role: 'USER' });
    } catch (err: any) {
      setError(err.message || 'Unable to create user account.');
    } finally {
      setCreating(false);
    }
  }; 

  const updateUserStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiClient.patch(`/admin/users/${id}`, { status: newStatus });
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user)));
    } catch (err: any) {
      setError(err.message || 'Unable to update user status.');
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      setError(err.message || 'Unable to remove user.');
    }
  };

  if (loading) {
    return <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Loading users...</div>;
  }

  if (error) {
    return <div className="rounded-4xl border border-rose-600/20 bg-rose-500/10 p-8 text-rose-200">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Admin User Management</p>
            <h1 className="text-3xl font-bold text-slate-100">Manage platform accounts</h1>
            <p className="mt-2 text-slate-400">Create, review, and moderate registered students and administrators.</p>
          </div>
        </div>

        <form onSubmit={createUser} className="mt-6 grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 md:grid-cols-[1.2fr_1.2fr_1fr_0.8fr_auto]">
          <input
            type="text"
            required
            value={formState.name}
            onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Full name"
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <input
            type="email"
            required
            value={formState.email}
            onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email address"
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <input
            type="password"
            required
            minLength={6}
            value={formState.password}
            onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Password"
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <select
            value={formState.role}
            onChange={(e) => setFormState((prev) => ({ ...prev, role: e.target.value as 'ADMIN' | 'USER' }))}
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            disabled={creating}
            className="rounded-2xl bg-linear-to-r from-sky-500 to-violet-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:brightness-110 disabled:opacity-60"
          >
            {creating ? 'Saving...' : 'Create'}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-4xl border border-slate-800 bg-slate-950/95 shadow-xl shadow-slate-950/20">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Name</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Email</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Role</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-3 text-right font-semibold uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-slate-100">{user.name}</td>
                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                <td className="px-6 py-4 text-slate-400">{user.role}</td>
                <td className="px-6 py-4 text-slate-400">{user.status}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => updateUserStatus(user.id, user.status)}
                    className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-slate-500"
                  >
                    {user.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
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
