import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      const res = await registerUser(form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
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
          <h1 className="font-display text-2xl font-semibold text-ink text-center">Create your account</h1>
          {error && <p className="text-center text-sm text-danger">{error}</p>}
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-ink outline-none focus:border-gold"
          />
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
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-ink outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-2 font-semibold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
          <p className="text-center text-sm text-muted">
            Already have an account? <Link to="/login" className="text-gold">Login</Link>
          </p>
        </form>
      </div>
    </Layout>
  )
}

export default Register
