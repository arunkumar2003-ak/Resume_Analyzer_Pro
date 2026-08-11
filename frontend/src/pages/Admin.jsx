import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminStats } from '../services/api.js'
import Layout from '../components/Layout.jsx'

function Admin() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.detail || 'Access denied'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-1 items-center justify-center text-muted">Loading...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-danger">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="text-gold underline">
            Back to Dashboard
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center gap-8 px-4 py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">Admin Dashboard</h1>

        <div className="flex flex-wrap justify-center gap-4">
          <StatCard label="Total Users" value={stats.total_users} />
          <StatCard label="Total Payments" value={stats.total_payments} />
          <StatCard label="Total Revenue" value={`₹${stats.total_revenue}`} />
        </div>

        <div className="w-full max-w-3xl overflow-x-auto">
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">Recent Users</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-muted">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Plan</th>
                  <th className="px-4 py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-4 py-2 text-ink">{u.name}</td>
                    <td className="px-4 py-2 text-muted">{u.email}</td>
                    <td className="px-4 py-2 capitalize text-muted">{u.plan}</td>
                    <td className="px-4 py-2 text-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full max-w-3xl overflow-x-auto">
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">Recent Payments</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-muted">
                <tr>
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_payments.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-2 text-ink">{p.user_id}</td>
                    <td className="px-4 py-2 text-muted">₹{(p.amount / 100).toFixed(2)}</td>
                    <td
                      className={`px-4 py-2 capitalize ${
                        p.status === 'success'
                          ? 'text-success'
                          : p.status === 'failed'
                          ? 'text-danger'
                          : 'text-muted'
                      }`}
                    >
                      {p.status}
                    </td>
                    <td className="px-4 py-2 text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button onClick={() => navigate('/dashboard')} className="text-sm text-gold underline">
          Back to Dashboard
        </button>
      </div>
    </Layout>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="min-w-[140px] rounded-xl border border-border bg-surface px-6 py-4 text-center">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-2xl font-bold text-gold">{value}</p>
    </div>
  )
}

export default Admin
