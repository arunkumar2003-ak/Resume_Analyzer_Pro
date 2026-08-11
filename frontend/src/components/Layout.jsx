import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
