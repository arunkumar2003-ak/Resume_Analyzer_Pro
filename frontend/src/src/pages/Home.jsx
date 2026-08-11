import { useEffect, useState } from 'react'
import { checkHealth } from '../services/api.js'

function Home() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    checkHealth()
      .then((res) => setStatus(`${res.data.status} (db: ${res.data.database})`))
      .catch(() => setStatus('backend not reachable'))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-gold">AI Resume Analyzer Pro</h1>
      <p className="text-slate-300">Phase 1: Project Setup</p>
      <div className="mt-6 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700">
        Backend status: <span className="text-gold font-semibold">{status}</span>
      </div>
    </div>
  )
}

export default Home
