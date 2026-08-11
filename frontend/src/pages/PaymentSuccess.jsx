import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'

function PaymentSuccess() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  useEffect(() => {
    refreshUser()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-3xl font-semibold text-gold">Payment Successful 🎉</h1>
        <p className="text-muted">You are now a Premium member!</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-lg bg-gold px-6 py-2 font-semibold text-slate-900 transition hover:brightness-110"
        >
          Go to Dashboard
        </button>
      </div>
    </Layout>
  )
}

export default PaymentSuccess
