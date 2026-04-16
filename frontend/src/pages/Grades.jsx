import React, { useEffect, useState } from 'react';
import { CheckCircle2, Upload } from 'lucide-react';
import { ENDPOINTS } from '../config/api';
import { getUserKey } from '../lib/auth';

const initialGrades = {
  math: '',
  literature: '',
  english: '',
  physics: '',
  economics: '',
  art: '',
};

const Grades = () => {
  const [grades, setGrades] = useState(initialGrades);
  const [latest, setLatest] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadLatestGrades = async () => {
      try {
        const userKey = getUserKey();
        const query = new URLSearchParams(userKey.username ? { username: userKey.username } : {}).toString();
        const response = await fetch(`${ENDPOINTS.grade.latest}${query ? `?${query}` : ''}`);
        const payload = await response.json();
        setLatest(payload);
        if (payload.subjects) {
          setGrades((current) => ({ ...current, ...payload.subjects }));
        }
      } catch {
        setError('Không tải được dữ liệu điểm gần nhất');
      }
    };

    loadLatestGrades();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGrades((current) => ({ ...current, [name]: value }));
  };

  const submitGrades = async (endpoint) => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const userKey = getUserKey();
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userKey.username,
          user_id: userKey.user_id,
          math: Number(grades.math || 0),
          literature: Number(grades.literature || 0),
          english: Number(grades.english || 0),
          physics: grades.physics ? Number(grades.physics) : null,
          economics: grades.economics ? Number(grades.economics) : null,
          art: grades.art ? Number(grades.art) : null,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Không thể lưu điểm');
      }

      setLatest(payload);
      setMessage('Đã lưu điểm thành công.');
    } catch (submitError) {
      setError(submitError.message || 'Lưu điểm thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleManualSubmit = (event) => {
    event.preventDefault();
    submitGrades(ENDPOINTS.grade.manual);
  };

  const handleAutoFill = () => submitGrades(ENDPOINTS.grade.uploadTranscript);

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-silver-900">Nhập điểm học tập</h1>
          <p className="mt-3 text-silver-600">
            Insight sử dụng điểm học để tăng độ chính xác cho khuyến nghị ngành học. Bạn có thể nhập tay hoặc dùng auto-fill mô phỏng OCR.
          </p>
        </div>
      </div>

      {(message || error) && (
        <div className={`${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'} p-3 rounded-xl text-sm`}>
          {error || message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleManualSubmit} className="bg-white rounded-2xl border border-silver-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-silver-800 font-semibold">
            <Upload className="w-4 h-4" /> Manual entry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(initialGrades).map((subject) => (
              <label key={subject} className="space-y-2 text-sm text-silver-600">
                <span className="capitalize">{subject}</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  name={subject}
                  value={grades[subject]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-silver-200 focus:ring-2 focus:ring-pastel-pink outline-none"
                />
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-5 py-3 rounded-xl font-medium disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save grades'}
            </button>
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={saving}
              className="btn-pastel px-5 py-3 rounded-xl font-medium disabled:opacity-60"
            >
              Auto-fill mock transcript
            </button>
          </div>
        </form>

        <aside className="bg-silver-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <div className="text-sm text-silver-300">Latest summary</div>
            <h2 className="text-2xl font-semibold mt-1">{latest ? latest.academic_fit + '%' : 'No data yet'}</h2>
          </div>

          {latest ? (
            <div className="space-y-3 text-sm text-silver-200">
              <p>Average score: <span className="text-white font-semibold">{latest.average_score}</span></p>
              <p>Strengths: <span className="text-white font-semibold">{latest.strengths?.join(', ') || 'None'}</span></p>
              <p>Attention points: <span className="text-white font-semibold">{latest.attention_points?.join(', ') || 'None'}</span></p>
              <p className="text-silver-300">Saved at: {latest.updated_at}</p>
            </div>
          ) : (
            <p className="text-sm text-silver-300">Chưa có dữ liệu lưu trữ. Hãy nhập điểm để gắn vào quiz.</p>
          )}

          {latest?.source === 'transcript-upload' && (
            <div className="inline-flex items-center gap-2 text-emerald-300 text-sm">
              <CheckCircle2 className="w-4 h-4" /> OCR auto-fill is active
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Grades;