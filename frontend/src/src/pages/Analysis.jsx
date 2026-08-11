import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getAnalysis, downloadReport } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

function Analysis() {
  const { resumeId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [data, setData] = useState(location.state?.result || null)
  const [loading, setLoading] = useState(!location.state?.result)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await downloadReport(resumeId)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `resume_analysis_report_${resumeId}.txt`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(err.response?.data?.detail || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    if (data) return
    getAnalysis(resumeId)
      .then((res) => setData(res.data))
      .catch(() => setError('No analysis found. Please analyze this resume first.'))
      .finally(() => setLoading(false))
  }, [resumeId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-300">Analyzing...</div>
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-red-400">{error}</p>
        <button onClick={() => navigate('/upload')} className="text-gold underline">Go back to Upload</button>
      </div>
    )
  }

  const feedback = typeof data.feedback === 'string' ? JSON.parse(data.feedback) : data.feedback

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-gold">Resume Analysis</h1>

      <div className="flex gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-center">
          <p className="text-slate-400 text-sm">Resume Score</p>
          <p className="text-3xl font-bold text-gold">{feedback.resume_score}/100</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-center">
          <p className="text-slate-400 text-sm">ATS Score</p>
          <p className="text-3xl font-bold text-gold">{feedback.ats_score}/100</p>
        </div>
      </div>

      <div className="w-full max-w-2xl grid gap-4">
        <Section title="Skills Found" items={feedback.skills} />
        <Section title="Missing Skills" items={feedback.missing_skills} />
        <Section title="Grammar Issues" items={feedback.grammar_issues} />
        <TextBlock title="Projects Feedback" text={feedback.projects_feedback} />
        <TextBlock title="Experience Feedback" text={feedback.experience_feedback} />
        <Section title="Suggestions" items={feedback.suggestions} />
      </div>

      {user?.plan === 'premium' ? (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-6 py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {downloading ? 'Downloading...' : 'Download Report'}
        </button>
      ) : (
        <button
          onClick={() => navigate('/pricing')}
          className="px-6 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-gold text-sm"
        >
          Upgrade to Premium to Download Report
        </button>
      )}

      <button onClick={() => navigate('/dashboard')} className="text-gold underline text-sm">
        Back to Dashboard
      </button>
    </div>
  )
}

function Section({ title, items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-left">
      <h2 className="text-gold font-semibold mb-2">{title}</h2>
      <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}

function TextBlock({ title, text }) {
  if (!text) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-left">
      <h2 className="text-gold font-semibold mb-2">{title}</h2>
      <p className="text-slate-300 text-sm">{text}</p>
    </div>
  )
}

export default Analysis
