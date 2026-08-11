'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function QuizRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Tracks { questionId: selectedOptionId }
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadAssessment() {
      try {
        // 1. First establish or resume an official session entry on our database logs
        const startRes = await apiClient.post('/student/attempts/start', { quizId });
        const currentAttempt = startRes.data.data.attempt;
        setAttempt(currentAttempt);

        // 2. Fetch the quiz layout containing questions (Cheat prevention scrub rules applied)
        const quizRes = await apiClient.get(`/student/quizzes/${quizId}`);
        const currentQuiz = quizRes.data.data.quiz;
        setQuiz(currentQuiz);

        // 3. Compute remaining server time dynamically in seconds
        const startTime = new Date(currentAttempt.startedAt).getTime();
        const endTime = startTime + currentQuiz.duration * 60 * 1000;
        const secondsRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(secondsRemaining);
      } catch (err: any) {
        alert(err.message || 'Initialization security fault.');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [quizId, router]);

  // COUNTDOWN TIMER EFFECT LOOP
  useEffect(() => {
    if (timeLeft <= 0 || loading || !quiz) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit(); // Automatic execution trigger once timer hits zero boundary
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, quiz]);

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleAutoSubmit = () => {
    if (submitting) return;
    submitAssessment();
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    try {
      // Reformat the dictionary cache object cleanly matching our Zod payload requirements array structures
      const formattedResponses = Object.entries(answers).map(([qId, optId]) => ({
        questionId: qId,
        selectedOptionId: optId,
      }));

      const res = await apiClient.post('/student/grading/submit', {
        attemptId: attempt.id,
        responses: formattedResponses,
      });

      alert(`Assessment Finished! Result Status: ${res.data.data.result.status} | Score: ${res.data.data.result.percentage}%`);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Submission grading runtime failure.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quiz) return <div className="p-6 text-sm text-slate-400">Loading secure evaluation workspace matrix...</div>;

  const currentQuestion = quiz.questions[currentIndex];
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 space-y-6">
      {/* Header Stat Panel View Layout */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-slate-200 text-sm truncate max-w-xs">{quiz.title}</h3>
          <span className="text-[10px] text-slate-400 font-medium">Question {currentIndex + 1} of {quiz.questions.length}</span>
        </div>
        <div className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-widest ${timeLeft < 60 ? 'bg-rose-500/10 text-rose-400 animate-pulse' : 'bg-slate-950 text-emerald-400'}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Text Window */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-slate-100">{currentQuestion.questionText}</h4>
        
        {/* Render Scrubbed Options Choices List */}
        <div className="space-y-2">
          {currentQuestion.options.map((opt: any) => {
            const isSelected = answers[currentQuestion.id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => selectOption(currentQuestion.id, opt.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs font-medium border transition ${
                  isSelected 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' 
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.optionText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls Button Bar Footer Layout */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="px-4 py-2 font-bold text-slate-400 hover:text-slate-200 disabled:opacity-30 transition"
        >
          Previous
        </button>

        {currentIndex < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold px-5 py-2 rounded-lg transition"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={submitAssessment}
            disabled={submitting}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black px-6 py-2 rounded-lg transition tracking-wide active:scale-[0.98]"
          >
            {submitting ? 'Scoring...' : 'Finish Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}
