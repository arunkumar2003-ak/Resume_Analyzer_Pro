import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkHealth } from '../services/api.js'
import Layout from '../components/Layout.jsx'

function Home() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    checkHealth()
      .then((res) => setStatus(res.data.database === 'connected' ? 'online' : 'issue'))
      .catch(() => setStatus('offline'))
  }, [])

  const statusDot =
    status === 'online' ? 'bg-success' : status === 'offline' ? 'bg-danger' : 'bg-gold'
  const statusLabel =
    status === 'online'
      ? 'Systems operational'
      : status === 'offline'
      ? 'Backend unreachable'
      : 'Checking systems...'

  return (
    <Layout>
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot} animate-pulse`} />
            {statusLabel}
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
            Get your resume past the bots.
            <span className="block text-gold">Then past the humans.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Upload your resume and our AI scores it, flags what's missing, and tells you
            exactly what to fix — before a recruiter ever sees it.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="w-full rounded-lg bg-gold px-6 py-3 text-center font-semibold text-slate-900 transition hover:brightness-110 sm:w-auto"
            >
              Analyze my resume
            </Link>
            <Link
              to="/login"
              className="w-full rounded-lg border border-border px-6 py-3 text-center font-semibold text-ink transition hover:border-gold sm:w-auto"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-3">
          <FeatureCard title="ATS Score" desc="See exactly how applicant tracking systems read your resume." />
          <FeatureCard title="Skill Gaps" desc="Find the missing keywords holding your applications back." />
          <FeatureCard title="Instant Feedback" desc="Grammar, projects, and experience — reviewed in seconds." />
        </div>
      </section>
    </Layout>
  )
}

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 text-left transition hover:border-gold/40">
      <p className="font-display font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{desc}</p>
    </div>
  )
}

export default Home
