import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-surface p-6"
        >
          <h1 className="font-display text-2xl font-semibold text-ink text-center">Welcome back</h1>
          {error && <p className="text-center text-sm text-danger">{error}</p>}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-ink outline-none focus:border-gold"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-ink outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-2 font-semibold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center text-sm text-muted">
            No account? <Link to="/register" className="text-gold">Register</Link>
          </p>
        </form>
      </div>
    </Layout>
  )
}

export default Login
