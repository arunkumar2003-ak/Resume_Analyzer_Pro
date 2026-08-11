import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory, analyzeResume } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Layout from '../components/Layout.jsx'

function Dashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [analyzingId, setAnalyzingId] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    setLoading(true)
    getHistory()
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }

  const handleAnalyze = async (resumeId) => {
    setAnalyzingId(resumeId)
    try {
      const res = await analyzeResume(resumeId)
      navigate(`/analysis/${resumeId}`, { state: { result: res.data } })
    } catch (err) {
      showToast(err.response?.data?.detail || 'Analysis failed', 'error')
    } finally {
      setAnalyzingId(null)
    }
  }

  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center gap-8 px-4 py-12">
        <div className="w-full max-w-2xl flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Welcome, {user?.name}</h1>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                user?.plan === 'premium' ? 'bg-gold text-slate-900' : 'bg-background text-muted border border-border'
              }`}
            >
              {user?.plan === 'premium' ? 'PREMIUM' : 'FREE PLAN'}
            </span>
            {user?.plan !== 'premium' && (
              <button
                onClick={() => navigate('/pricing')}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-110"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="rounded-lg bg-gold px-6 py-3 font-semibold text-slate-900 transition hover:brightness-110"
        >
          + Upload New Resume
        </button>

        <div className="w-full max-w-2xl">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">Resume History</h2>

          {loading && <p className="text-sm text-muted">Loading...</p>}
          {!loading && history.length === 0 && (
            <p className="text-sm text-muted">No resumes uploaded yet. Upload your first one above.</p>
          )}

          <div className="grid gap-4">
            {history.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-gold/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="text-left">
                  <p className="font-semibold text-ink">{r.filename}</p>
                  <p className="text-xs text-muted">
                    Uploaded {new Date(r.uploaded_at).toLocaleDateString()}
                  </p>
                </div>

                {r.score !== null && r.score !== undefined ? (
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-muted">Score</p>
                      <p className="font-bold text-gold">{r.score}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted">ATS</p>
                      <p className="font-bold text-gold">{r.ats_score}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/analysis/${r.id}`)}
                      className="rounded-lg border border-border px-4 py-2 text-sm text-ink transition hover:border-gold"
                    >
                      View
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAnalyze(r.id)}
                    disabled={analyzingId === r.id}
                    className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {analyzingId === r.id ? 'Analyzing...' : 'Analyze'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
