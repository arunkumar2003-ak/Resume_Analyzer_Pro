import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg font-semibold text-ink">
          Resume<span className="text-gold">AI</span> Pro
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="text-muted transition hover:text-ink">
                Dashboard
              </Link>
              {user.plan !== 'premium' && (
                <Link to="/pricing" className="text-muted transition hover:text-ink">
                  Pricing
                </Link>
              )}
              {user.is_admin && (
                <Link to="/admin" className="text-muted transition hover:text-ink">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 pl-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-xs font-semibold text-gold">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <button onClick={handleLogout} className="text-muted transition hover:text-ink">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-muted transition hover:text-ink">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gold px-4 py-1.5 font-semibold text-slate-900 transition hover:brightness-110"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
