import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder, verifyPayment } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleChoosePlan = async (plan) => {
    setMessage('')
    setLoadingPlan(plan)

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      setMessage('Failed to load payment gateway. Check your internet connection.')
      setLoadingPlan(null)
      return
    }

    try {
      const res = await createOrder({ plan })
      const { order_id, amount, currency, key_id } = res.data

      const options = {
        key: key_id,
        amount,
        currency,
        name: 'AI Resume Analyzer Pro',
        description: plan === 'monthly' ? 'Monthly Premium Plan' : 'Yearly Premium Plan',
        order_id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            navigate('/payment-success')
          } catch (err) {
            navigate('/payment-failed')
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#FFD54A',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        navigate('/payment-failed')
      })
      rzp.open()
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Could not start payment')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center">
      <h1 className="text-3xl font-bold text-gold">Upgrade to Premium</h1>
      <p className="text-slate-400 text-sm max-w-md">
        Unlimited analysis, detailed AI feedback, downloadable reports, and a premium badge.
      </p>

      {message && <p className="text-red-400 text-sm">{message}</p>}

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-64 bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gold">Monthly</h2>
          <p className="text-3xl font-bold">₹299<span className="text-sm text-slate-400">/mo</span></p>
          <button
            onClick={() => handleChoosePlan('monthly')}
            disabled={loadingPlan === 'monthly'}
            className="w-full py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loadingPlan === 'monthly' ? 'Processing...' : 'Choose Monthly'}
          </button>
        </div>

        <div className="w-64 bg-slate-800 border border-gold rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gold">Yearly</h2>
          <p className="text-3xl font-bold">₹2499<span className="text-sm text-slate-400">/yr</span></p>
          <p className="text-xs text-slate-400">Save ~30% vs monthly</p>
          <button
            onClick={() => handleChoosePlan('yearly')}
            disabled={loadingPlan === 'yearly'}
            className="w-full py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loadingPlan === 'yearly' ? 'Processing...' : 'Choose Yearly'}
          </button>
        </div>
      </div>

      <button onClick={() => navigate('/dashboard')} className="text-gold text-sm underline">
        Back to Dashboard
      </button>
    </div>
  )
}

export default Pricing
