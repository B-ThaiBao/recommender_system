import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ENDPOINTS } from '../config/api';
import { getUserKey } from '../lib/auth';

const defaultAnswer = 3;

const Quiz = () => {
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [grades, setGrades] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const userKey = getUserKey();
        const templateResponse = await fetch(ENDPOINTS.core.templates);
        const templatePayload = await templateResponse.json();
        const quizTemplate = templatePayload.templates?.[0];

        if (!quizTemplate) {
          throw new Error('Không tải được bộ câu hỏi');
        }

        const detailResponse = await fetch(`${ENDPOINTS.core.templates}/${quizTemplate.id}`);
        const detailPayload = await detailResponse.json();
        setTemplate(detailPayload);

        const initialAnswers = {};
        detailPayload.questions.forEach((question) => {
          initialAnswers[question.id] = defaultAnswer;
        });
        setAnswers(initialAnswers);

        const gradeQuery = new URLSearchParams(userKey.username ? { username: userKey.username } : {}).toString();
        const gradeResponse = await fetch(`${ENDPOINTS.grade.latest}${gradeQuery ? `?${gradeQuery}` : ''}`);
        if (gradeResponse.ok) {
          const gradePayload = await gradeResponse.json();
          setGrades(gradePayload);
        } else if (gradeResponse.status === 404) {
          setGrades(null);
        } else {
          const gradePayload = await gradeResponse.json().catch(() => ({}));
          throw new Error(gradePayload.detail || 'Không tải được dữ liệu điểm học gần nhất');
        }
      } catch (fetchError) {
        setError(fetchError.message || 'Không tải được dữ liệu quiz');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((current) => ({ ...current, [questionId]: Number(value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const userKey = getUserKey();
      const response = await fetch(ENDPOINTS.core.submitAttempt, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userKey.username,
          user_id: userKey.user_id,
          answers: template.questions.map((question) => answers[question.id] ?? defaultAnswer),
          grades: grades?.subjects || null,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.detail || 'Không thể chấm quiz');
      }

      setResult(payload.result);
    } catch (submitError) {
      setError(submitError.message || 'Quiz submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-silver-500">Loading quiz...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pastel-pinkLight text-silver-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" /> Insight Quiz
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-silver-900">Khám phá nhóm nghề phù hợp</h1>
          <p className="mt-3 text-silver-600 max-w-2xl">
            Trả lời 6 câu hỏi ngắn, hệ thống sẽ kết hợp tính cách và điểm học tập gần nhất để đề xuất ngành học, trường và hướng đi tiếp theo.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-56 h-56 bg-pastel-pink rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-4">
          {template.questions.map((question) => (
            <div key={question.id} className="bg-white rounded-2xl p-5 border border-silver-200 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-silver-400">Question {question.id}</div>
                  <h2 className="text-lg font-semibold text-silver-800 mt-1">{question.text}</h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-pastel-pinkLight text-silver-600">{question.dimension}</span>
              </div>

              <div className="grid grid-cols-5 gap-2 text-sm">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-xl border px-3 py-2 text-center transition-all ${
                      answers[question.id] === value
                        ? 'border-slate-800 bg-slate-800 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={value}
                      className="sr-only"
                      checked={answers[question.id] === value}
                      onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? 'Đang phân tích...' : 'Xem kết quả'} <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-silver-200 shadow-sm">
            <h3 className="font-semibold text-silver-800 mb-3">Điểm học gần nhất</h3>
            {grades ? (
              <div className="space-y-2 text-sm text-silver-600">
                <p>Average: <span className="font-semibold text-silver-800">{grades.average_score}</span></p>
                <p>Academic fit: <span className="font-semibold text-silver-800">{grades.academic_fit}%</span></p>
                <p>Strengths: <span className="font-semibold text-silver-800">{grades.strengths?.join(', ') || 'Chưa có'}</span></p>
              </div>
            ) : (
              <p className="text-sm text-silver-500">Chưa có dữ liệu điểm.</p>
            )}
          </div>

          {result && (
            <div className="bg-silver-900 text-white rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <div className="text-sm text-silver-300">Top recommendation</div>
                <h3 className="text-xl font-semibold mt-1">{result.top_careers?.[0]?.name}</h3>
                <p className="text-sm text-silver-300 mt-2">Score: {result.top_careers?.[0]?.score}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.why_recommended?.map((item) => <p key={item}>• {item}</p>)}
              </div>
            </div>
          )}
        </aside>
      </form>

      {result && (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-2xl p-6 border border-silver-200 shadow-sm">
            <h3 className="text-lg font-semibold text-silver-800 mb-4">Top careers</h3>
            <div className="space-y-4">
              {result.top_careers?.map((career) => (
                <div key={career.id} className="rounded-xl border border-silver-200 p-4 bg-silver-50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-silver-800">{career.name}</h4>
                      <p className="text-xs text-silver-500 uppercase tracking-wider">{career.domain}</p>
                    </div>
                    <div className="text-sm font-semibold text-silver-800">{career.score}</div>
                  </div>
                  <div className="mt-3 text-sm text-silver-600 space-y-2">
                    {career.why?.map((item) => <p key={item}>• {item}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-silver-200 shadow-sm">
            <h3 className="text-lg font-semibold text-silver-800 mb-4">Top universities</h3>
            <div className="space-y-3">
              {result.top_universities?.map((university) => (
                <div key={university.code} className="rounded-xl border border-silver-200 p-4">
                  <div className="font-medium text-silver-800">{university.name}</div>
                  <div className="text-sm text-silver-500">{university.city} • {university.tuition_range} • {university.admission_score}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Quiz;