import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadResume, analyzeResume } from '../services/api.js'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function Upload() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [success, setSuccess] = useState(null)
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
      setError(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold text-gold">Upload Resume</h1>
      <p className="text-slate-400 text-sm">PDF only, max 5MB</p>

      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold file:text-slate-900 file:font-semibold"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {success && (
          <div className="text-left text-sm bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-2">
            <p className="text-green-400 font-semibold">Uploaded: {success.filename}</p>
            <p className="text-slate-400">Resume ID: {success.id}</p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {analyzing ? 'Analyzing with AI...' : 'Analyze Now'}
            </button>
          </div>
        )}
      </div>

      <button onClick={() => navigate('/dashboard')} className="text-gold text-sm underline">
        Back to Dashboard
      </button>
    </div>
  )
}

export default Upload
