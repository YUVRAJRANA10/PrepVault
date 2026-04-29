import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clearAuthToken, getAuthToken, getMe } from '../api'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(getAuthToken())
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (isLoggedIn) {
      getMe().then(res => setUser(res.data.data)).catch(() => {})
    }
  }, [isLoggedIn])

  const handleLogout = () => {
    clearAuthToken()
    setUser(null)
    navigate('/')
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">🔐</span>
        <span className="logo-text">Prep<span className="gold">Vault</span></span>
      </Link>

      <div className="navbar-links">
        <Link to="/explore" className="nav-link">Explore</Link>
        {isLoggedIn ? (
          <>
            <button className="btn-primary small" onClick={() => navigate('/explore')}>
              + Share Story
            </button>
            <button className="btn-ghost small" onClick={() => navigate('/profile')}>
              👤 {user?.name || 'Profile'}
            </button>
            <button className="btn-ghost small" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="btn-ghost small" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-primary small" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </motion.nav>
  )
}
