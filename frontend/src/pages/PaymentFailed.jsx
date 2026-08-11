import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

function PaymentFailed() {
  const navigate = useNavigate()
  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-3xl font-semibold text-danger">Payment Failed</h1>
        <p className="text-muted">Something went wrong. Please try again.</p>
        <button
          onClick={() => navigate('/pricing')}
          className="rounded-lg bg-gold px-6 py-2 font-semibold text-slate-900 transition hover:brightness-110"
        >
          Try Again
        </button>
      </div>
    </Layout>
  )
}

export default PaymentFailed
