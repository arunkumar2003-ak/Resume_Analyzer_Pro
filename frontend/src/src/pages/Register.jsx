import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gold text-center">Create Account</h1>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required
          className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-gold" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
          className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-gold" />
        <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required minLength={6}
          className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-gold" />
        <button type="submit" disabled={loading}
          className="w-full py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90 disabled:opacity-50">
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p className="text-sm text-slate-400 text-center">
          Already have an account? <Link to="/login" className="text-gold">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
