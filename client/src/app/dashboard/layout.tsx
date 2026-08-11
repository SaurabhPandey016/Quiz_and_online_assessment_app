'use client';
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, BookOpen, Award } from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Dynamic Header Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-2 w-2 bg-emerald-500 rounded-full" />
          <h1 className="font-bold tracking-tight text-emerald-400">Assessment Hub</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Logged in as: <strong className="text-slate-200">{user?.name}</strong>
          </span>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-rose-400 transition"
          >
            <LogOut className="h-3 w-3" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Screen Layout Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
