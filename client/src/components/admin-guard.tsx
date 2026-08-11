'use client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace('/login');
      else if (user.role !== 'ADMIN') router.replace('/dashboard'); // Protect admin from students
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Verifying Admin clearance...</div>;
  }

  return <>{children}</>;
}
