import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthModal from './AuthModal'

export default function Navbar() {
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const handleShareStory = () => {
    if (user) {
      navigate('/explore')
    } else {
      setShowAuth(true)
    }
  }

  return (
    <>
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
          
          {user ? (
            <div className="user-menu">
              <span className="user-name">👤 {user.username}</span>
              <button className="btn-secondary small" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-primary small" onClick={handleShareStory}>
              + Share Story
            </button>
          )}
        </div>
      </motion.nav>

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onSuccess={() => {
            const userData = localStorage.getItem('user')
            setUser(JSON.parse(userData))
          }}
        />
      )}
    </>
  )
}
