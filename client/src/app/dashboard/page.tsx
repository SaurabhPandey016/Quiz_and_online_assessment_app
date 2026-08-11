'use client';
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import useRouter from 'next/navigation';
import { useRouter as useNextRouter } from 'next/navigation';

export default function QuizBoardPage() {
  const router = useNextRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/student/quizzes')
      .then((res) => setQuizzes(res.data.data.quizzes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-400 text-sm">Loading assessment modules...</div>;
  if (error) return <div className="text-rose-400 text-sm">⚠️ Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Available Assessments</h2>
        <p className="text-slate-400 text-sm mt-1">Select an active module to initialize your testing session parameters.</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-800 text-center text-slate-500 rounded-xl text-sm">
          No live quizzes published yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-950 text-indigo-400 rounded-md">
                    {quiz.category?.name || 'General'}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    quiz.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400' :
                    quiz.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{quiz.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{quiz.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div>⏱️ {quiz.duration} Mins | 🎯 Pass: {quiz.passingScore}%</div>
                <button
                  onClick={() => router.push(`/dashboard/runner/${quiz.id}`)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg transition text-xs active:scale-[0.98]"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
