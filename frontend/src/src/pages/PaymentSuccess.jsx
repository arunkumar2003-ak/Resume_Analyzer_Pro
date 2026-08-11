import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function PaymentSuccess() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  useEffect(() => {
    refreshUser()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-3xl font-bold text-gold">Payment Successful 🎉</h1>
      <p className="text-slate-300">You are now a Premium member!</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-6 py-2 rounded-lg bg-gold text-slate-900 font-semibold"
      >
        Go to Dashboard
      </button>
    </div>
  )
}

export default PaymentSuccess
