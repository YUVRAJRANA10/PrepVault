import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CompanyBurst from './CompanyBurst'

const BOLT_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

function VaultDoor({ isOpen }) {
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="doorBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1c1c3a" />
          <stop offset="100%" stopColor="#080814" />
        </radialGradient>
        <radialGradient id="innerBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#242448" />
          <stop offset="100%" stopColor="#0e0e20" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer glow ring */}
      <circle cx="140" cy="140" r="136" fill="none" stroke="#c89b3c" strokeWidth="0.5" opacity="0.5" />

      {/* Door body */}
      <circle cx="140" cy="140" r="130" fill="url(#doorBg)" />
      <circle cx="140" cy="140" r="130" fill="none" stroke="#c89b3c" strokeWidth="2.5" filter="url(#glow)" />

      {/* Middle decorative ring */}
      <circle cx="140" cy="140" r="95" fill="url(#innerBg)" stroke="#c89b3c" strokeWidth="1.5" opacity="0.8" />

      {/* Inner ring */}
      <circle cx="140" cy="140" r="58" fill="none" stroke="#c89b3c" strokeWidth="1" opacity="0.5" />

      {/* Spokes */}
      {BOLT_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        return (
          <line
            key={i}
            x1={140 + 58 * Math.cos(rad)} y1={140 + 58 * Math.sin(rad)}
            x2={140 + 95 * Math.cos(rad)} y2={140 + 95 * Math.sin(rad)}
            stroke="#c89b3c" strokeWidth="1" opacity="0.25"
          />
        )
      })}

      {/* Bolts */}
      {BOLT_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x = 140 + 113 * Math.cos(rad)
        const y = 140 + 113 * Math.sin(rad)
        return (
          <motion.circle
            key={i} cx={x} cy={y} r="10"
            fill="#12122a" stroke="#c89b3c" strokeWidth="2"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={isOpen ? { scale: 0.3, opacity: 0.2 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: i * 0.025 }}
          />
        )
      })}

      {/* Handle */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: '140px 140px' }}
        animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
        transition={{ duration: 0.35, delay: 0.28 }}
      >
        <circle cx="140" cy="140" r="32" fill="#0c0c22" stroke="#c89b3c" strokeWidth="3" />
        <line x1="108" y1="140" x2="172" y2="140" stroke="#c89b3c" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="140" y1="108" x2="140" y2="172" stroke="#c89b3c" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="140" cy="140" r="7" fill="#c89b3c" />
      </motion.g>
    </svg>
  )
}

export default function VaultHero() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <section className="hero">
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="hero-eyebrow">Interview Experiences · Real People · Real Companies</p>
        <h1 className="hero-title">
          Every interview<br />has a story.<br />
          <span className="gold">Find yours.</span>
        </h1>
        <p className="hero-sub">
          Browse real experiences shared by students and professionals.<br />
          Know what to expect before you walk in.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ position: 'relative' }}
      >
        {/* Company logos burst outward from vault center */}
        <CompanyBurst />

        {/* 
          Hover zone is a STATIC div — it never moves.
          Only the inner door animates with rotateY.
          This prevents the flapping loop where rotating away triggers onHoverEnd.
        */}
        <div
          className="vault-scene"
          style={{ perspective: '1200px', position: 'relative', zIndex: 1 }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => navigate('/explore')}
        >
          {/* Behind the door — always visible */}
          <div className="vault-reveal">
            <div className="vault-reveal-inner">
              <span className="vault-unlock-icon">🔓</span>
              <span className="vault-unlock-text">Enter the Vault</span>
            </div>
          </div>

          {/* Animated door — rotates away on hover, hover detection stays on parent */}
          <motion.div
            className="vault-door-wrap"
            animate={{ rotateY: isOpen ? -145 : 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: isOpen ? 0.28 : 0 }}
            style={{ transformOrigin: 'left center', cursor: 'pointer', backfaceVisibility: 'hidden' }}
          >
            <VaultDoor isOpen={isOpen} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="hero-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button className="btn-primary" onClick={() => navigate('/explore')}>
          Explore Experiences
        </button>
        <button className="btn-ghost" onClick={() => navigate('/explore')}>
          Share Your Story →
        </button>
      </motion.div>
    </section>
  )
}
