import { useNavigate } from 'react-router-dom'

function PaymentFailed() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-3xl font-bold text-red-400">Payment Failed</h1>
      <p className="text-slate-300">Something went wrong. Please try again.</p>
      <button
        onClick={() => navigate('/pricing')}
        className="px-6 py-2 rounded-lg bg-gold text-slate-900 font-semibold"
      >
        Try Again
      </button>
    </div>
  )
}

export default PaymentFailed
