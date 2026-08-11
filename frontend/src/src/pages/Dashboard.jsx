import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { getHistory, analyzeResume } from '../services/api.js'

function Dashboard() {
  const { user, logout } = useAuth()
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAnalyze = async (resumeId) => {
    setAnalyzingId(resumeId)
    try {
      const res = await analyzeResume(resumeId)
      navigate(`/analysis/${resumeId}`, { state: { result: res.data } })
    } catch (err) {
      alert(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setAnalyzingId(null)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-8">
      {/* Profile card */}
      <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gold">Welcome, {user?.name}</h1>
          <p className="text-slate-400 text-sm">{user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              user?.plan === 'premium' ? 'bg-gold text-slate-900' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {user?.plan === 'premium' ? 'PREMIUM' : 'FREE PLAN'}
          </span>
          {user?.plan !== 'premium' && (
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90 text-sm"
            >
              Upgrade
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-gold text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Upload button */}
      <button
        onClick={() => navigate('/upload')}
        className="px-6 py-3 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90"
      >
        + Upload New Resume
      </button>

      {/* Resume history */}
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gold mb-4">Resume History</h2>

        {loading && <p className="text-slate-400 text-sm">Loading...</p>}
        {!loading && history.length === 0 && (
          <p className="text-slate-400 text-sm">No resumes uploaded yet. Upload your first one above.</p>
        )}

        <div className="grid gap-4">
          {history.map((r) => (
            <div
              key={r.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="text-left">
                <p className="font-semibold">{r.filename}</p>
                <p className="text-slate-400 text-xs">
                  Uploaded {new Date(r.uploaded_at).toLocaleDateString()}
                </p>
              </div>

              {r.score !== null && r.score !== undefined ? (
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Score</p>
                    <p className="text-gold font-bold">{r.score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">ATS</p>
                    <p className="text-gold font-bold">{r.ats_score}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/analysis/${r.id}`)}
                    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-gold text-sm"
                  >
                    View
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAnalyze(r.id)}
                  disabled={analyzingId === r.id}
                  className="px-4 py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90 disabled:opacity-50 text-sm"
                >
                  {analyzingId === r.id ? 'Analyzing...' : 'Analyze'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
