'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface QuizOption {
  id: string;
  title: string;
  category: { name: string };
}

interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

interface QuestionPayload {
  quizId: string;
  questionText: string;
  marks: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  options: Array<{ optionText: string; isCorrect: boolean }>;
}

export default function AdminQuestionsPage() {
  const [quizzes, setQuizzes] = useState<QuizOption[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<QuestionPayload>({
    quizId: '',
    questionText: '',
    marks: 1,
    explanation: '',
    difficulty: 'MEDIUM',
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
    ],
  });

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const quizzesRes = await apiClient.get('/admin/quizzes');
        setQuizzes(quizzesRes.data.data.quizzes);
      } catch (err: any) {
        setError(err.message || 'Unable to load quizzes.');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedQuiz) {
        setQuestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await apiClient.get(`/admin/questions/quiz/${selectedQuiz}`);
        setQuestions(res.data.data.questions);
      } catch (err: any) {
        setError(err.message || 'Unable to load questions for selected quiz.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedQuiz]);

  const addOption = () => {
    if (form.options.length >= 6) return;
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { optionText: '', isCorrect: false }],
    }));
  };

  const updateOption = (index: number, optionText: string) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, idx) => (idx === index ? { ...opt, optionText } : opt)),
    }));
  };

  const setCorrectOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, idx) => ({ ...opt, isCorrect: idx === index })),
    }));
  };

  const submitQuestion = async () => {
    if (!form.quizId || !form.questionText || form.options.some((opt) => !opt.optionText)) {
      setError('Please complete the quiz selection, question text, and all answer options.');
      return;
    }

    try {
      const res = await apiClient.post('/admin/questions', form);
      setQuestions((prev) => [...prev, res.data.data.question]);
      setForm((prev) => ({
        ...prev,
        questionText: '',
        explanation: '',
        marks: 1,
        difficulty: 'MEDIUM',
        options: [{ optionText: '', isCorrect: false }, { optionText: '', isCorrect: false }],
      }));
      setError('');
    } catch (err: any) {
      setError(err.message || 'Unable to save question.');
    }
  };

  const removeQuestion = async (id: string) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await apiClient.delete(`/admin/questions/${id}`);
      setQuestions((prev) => prev.filter((question) => question.id !== id));
    } catch (err: any) {
      setError(err.message || 'Unable to delete question.');
    }
  };

  const quizTitle = useMemo(
    () => quizzes.find((quiz) => quiz.id === selectedQuiz)?.title || 'Choose a quiz',
    [selectedQuiz, quizzes],
  );

  if (loading) {
    return <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Loading quiz questions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Question editor</p>
            <h1 className="text-3xl font-bold text-slate-100">Manage quiz questions</h1>
            <p className="mt-2 text-slate-400">Add or remove questions for any published assessment.</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-4xl border border-rose-600/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/20">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Quiz</label>
            <select
              value={selectedQuiz}
              onChange={(e) => {
                const quizId = e.target.value;
                setSelectedQuiz(quizId);
                setForm((prev) => ({ ...prev, quizId }));
              }}
              className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="">Select quiz</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Marks</label>
            <input
              type="number"
              min={1}
              value={form.marks}
              onChange={(e) => setForm((prev) => ({ ...prev, marks: Number(e.target.value) }))}
              className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <div>
            <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Question text</label>
            <textarea
              value={form.questionText}
              onChange={(e) => setForm((prev) => ({ ...prev, questionText: e.target.value }))}
              rows={3}
              placeholder="Enter the question prompt here"
              className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' }))}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-500">Explanation</label>
              <input
                type="text"
                value={form.explanation}
                onChange={(e) => setForm((prev) => ({ ...prev, explanation: e.target.value }))}
                placeholder="Optional explanation"
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Answer options</p>
              <button
                type="button"
                onClick={addOption}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-slate-500"
              >
                Add option
              </button>
            </div>

            {form.options.map((option, index) => (
              <div key={index} className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
                <input
                  value={option.optionText}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <button
                  type="button"
                  onClick={() => setCorrectOption(index)}
                  className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${option.isCorrect ? 'border border-emerald-500 bg-emerald-500/10 text-emerald-200' : 'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500'}`}
                >
                  {option.isCorrect ? 'Correct answer' : 'Mark correct'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={submitQuestion}
              className="rounded-3xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Save question
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Current quiz</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-100">{quizTitle}</h2>
          </div>
          <div className="text-sm text-slate-400">{questions.length} questions</div>
        </div>

        {questions.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">Select a quiz to view its question list.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{question.difficulty} • {question.marks} marks</p>
                    <p className="mt-2 text-slate-100">{question.questionText}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="rounded-full border border-rose-500 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
