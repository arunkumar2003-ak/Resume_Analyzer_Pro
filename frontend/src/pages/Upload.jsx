import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadResume, analyzeResume } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import Layout from '../components/Layout.jsx'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function Upload() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [success, setSuccess] = useState(null)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    setError('')
    setSuccess(null)
    const selected = e.target.files[0]
    if (!selected) return
    if (selected.type !== 'application/pdf') {
      setError('Only PDF files are allowed')
      setFile(null)
      return
    }
    if (selected.size > MAX_SIZE) {
      setError('File size must be under 5MB')
      setFile(null)
      return
    }
    setFile(selected)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose a PDF file first')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await uploadResume(file)
      setSuccess(res.data)
      showToast('Resume uploaded successfully', 'success')
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!success) return
    setAnalyzing(true)
    setError('')
    try {
      const res = await analyzeResume(success.id)
      navigate(`/analysis/${success.id}`, { state: { result: res.data } })
    } catch (err) {
      showToast(err.response?.data?.detail || 'Analysis failed', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Upload Resume</h1>
        <p className="text-sm text-muted">PDF only, max 5MB</p>

        <div className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-surface p-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-slate-900"
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full rounded-lg bg-gold py-2 font-semibold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>

          {success && (
            <div className="space-y-2 rounded-lg border border-border bg-background p-3 text-left text-sm">
              <p className="font-semibold text-success">Uploaded: {success.filename}</p>
              <p className="text-muted">Resume ID: {success.id}</p>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full rounded-lg bg-gold py-2 font-semibold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
              >
                {analyzing ? 'Analyzing with AI...' : 'Analyze Now'}
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/dashboard')} className="text-sm text-gold underline">
          Back to Dashboard
        </button>
      </div>
    </Layout>
  )
}

export default Upload
