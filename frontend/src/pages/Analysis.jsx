import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getAnalysis, downloadReport } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Layout from '../components/Layout.jsx'

function Analysis() {
  const { resumeId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
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
      showToast('Report downloaded', 'success')
    } catch (err) {
      showToast(err.response?.data?.detail || 'Download failed', 'error')
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
    return (
      <Layout>
        <div className="flex flex-1 items-center justify-center text-muted">Analyzing...</div>
      </Layout>
    )
  }
  if (error) {
    return (
      <Layout>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-danger">{error}</p>
          <button onClick={() => navigate('/upload')} className="text-gold underline">
            Go back to Upload
          </button>
        </div>
      </Layout>
    )
  }

  const feedback = typeof data.feedback === 'string' ? JSON.parse(data.feedback) : data.feedback

  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center gap-6 px-4 py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">Resume Analysis</h1>

        <div className="flex gap-4">
          <div className="rounded-xl border border-border bg-surface px-6 py-4 text-center">
            <p className="text-sm text-muted">Resume Score</p>
            <p className="text-3xl font-bold text-gold">{feedback.resume_score}/100</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-6 py-4 text-center">
            <p className="text-sm text-muted">ATS Score</p>
            <p className="text-3xl font-bold text-gold">{feedback.ats_score}/100</p>
          </div>
        </div>

        <div className="grid w-full max-w-2xl gap-4">
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
            className="rounded-lg bg-gold px-6 py-2 font-semibold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
          >
            {downloading ? 'Downloading...' : 'Download Report'}
          </button>
        ) : (
          <button
            onClick={() => navigate('/pricing')}
            className="rounded-lg border border-border px-6 py-2 text-sm text-ink transition hover:border-gold"
          >
            Upgrade to Premium to Download Report
          </button>
        )}

        <button onClick={() => navigate('/dashboard')} className="text-sm text-gold underline">
          Back to Dashboard
        </button>
      </div>
    </Layout>
  )
}

function Section({ title, items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-left">
      <h2 className="mb-2 font-semibold text-gold">{title}</h2>
      <ul className="list-inside list-disc space-y-1 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function TextBlock({ title, text }) {
  if (!text) return null
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-left">
      <h2 className="mb-2 font-semibold text-gold">{title}</h2>
      <p className="text-sm text-muted">{text}</p>
    </div>
  )
}

export default Analysis
