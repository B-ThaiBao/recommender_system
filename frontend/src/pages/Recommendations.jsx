import React, { useEffect, useState } from 'react';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { ENDPOINTS } from '../config/api';
import { getUserKey } from '../lib/auth';

const Recommendations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      const userKey = getUserKey();
      const query = new URLSearchParams(userKey.username ? { username: userKey.username } : {}).toString();
      const response = await fetch(`${ENDPOINTS.core.latestRecommendations}${query ? `?${query}` : ''}`);
      const payload = await response.json();
      setData(payload);
    } catch {
      setError('Không tải được kết quả gợi ý');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  if (loading) {
    return <div className="text-silver-500">Loading recommendations...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pastel-blue text-silver-700 text-sm mb-4">
            <Lightbulb className="w-4 h-4" /> Recommendation center
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-silver-900">Kết quả gợi ý ngành và trường</h1>
          <p className="mt-3 text-silver-600">
            Đây là trung tâm kết quả của Insight: bạn có thể xem gợi ý mới nhất, kiểm tra lý do và cập nhật lại bất cứ lúc nào.
          </p>
        </div>

        <button onClick={loadRecommendations} className="btn-primary px-4 py-3 rounded-xl inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{error}</div>}

      {data ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="bg-white rounded-2xl border border-silver-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-silver-800">Tóm tắt điểm số</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {Object.entries(data.score_summary || {}).map(([label, value]) => (
                <div key={label} className="rounded-xl bg-silver-50 border border-silver-200 p-4">
                  <div className="text-silver-500 capitalize">{label.replace('_', ' ')}</div>
                  <div className="text-2xl font-semibold text-silver-800 mt-1">{value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm text-silver-600">
              {data.why_recommended?.map((item) => <p key={item}>• {item}</p>)}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-silver-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-silver-800">Cảnh báo và bước tiếp theo</h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-silver-700 mb-1">Risk flags</div>
                <div className="space-y-1 text-silver-600">
                  {data.risk_flags?.length ? data.risk_flags.map((item) => <p key={item}>• {item}</p>) : <p>Không có cảnh báo lớn.</p>}
                </div>
              </div>
              <div>
                <div className="font-medium text-silver-700 mb-1">Next actions</div>
                <div className="space-y-1 text-silver-600">
                  {data.next_actions?.map((item) => <p key={item}>• {item}</p>)}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-silver-200 shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-silver-800 mb-4">Top careers</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.top_careers?.map((career) => (
                <div key={career.id} className="rounded-xl border border-silver-200 bg-silver-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-silver-800">{career.name}</h3>
                      <p className="text-xs uppercase tracking-wider text-silver-400">{career.domain}</p>
                    </div>
                    <div className="text-sm font-semibold text-silver-800">{career.score}</div>
                  </div>
                  <div className="mt-3 text-sm text-silver-600 space-y-2">
                    {career.why?.map((item) => <p key={item}>• {item}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-silver-200 shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-silver-800 mb-4">Top universities</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {data.top_universities?.map((university) => (
                <div key={university.code} className="rounded-xl border border-silver-200 p-4">
                  <div className="font-medium text-silver-800">{university.name}</div>
                  <div className="text-sm text-silver-500">{university.city}</div>
                  <div className="text-sm text-silver-500 mt-1">{university.tuition_range}</div>
                  <div className="text-sm text-silver-500">{university.admission_score}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-silver-200 p-6 text-silver-500">
          Chưa có dữ liệu. Hãy làm quiz hoặc lưu điểm trước.
        </div>
      )}
    </div>
  );
};

export default Recommendations;