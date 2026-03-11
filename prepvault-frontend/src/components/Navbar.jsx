import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const navigate = useNavigate()

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
        <button className="btn-primary small" onClick={() => navigate('/explore')}>
          + Share Story
        </button>
      </div>
    </motion.nav>
  )
}
