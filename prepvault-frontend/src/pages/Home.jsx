import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VaultHero from '../components/VaultHero'
import { getExperiences, getDifficultySummary } from '../api'

function StatCard({ value, label, delay }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <span className="stat-value gold">{value}</span>
      <span className="stat-label">{label}</span>
    </motion.div>
  )
}

export default function Home() {
  const [stats, setStats] = useState({ total: 0, companies: 0, questions: 0 })
  const [topCompanies, setTopCompanies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getExperiences().then(res => {
      const data = res.data
      const companies = [...new Set(data.map(e => e.company))]
      const totalQ = data.reduce((sum, e) => sum + (e.questions?.length || 0), 0)
      setStats({ total: data.length, companies: companies.length, questions: totalQ })

      // count per company
      const counts = {}
      data.forEach(e => { counts[e.company] = (counts[e.company] || 0) + 1 })
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
      setTopCompanies(sorted)
    }).catch(() => {})
  }, [])

  return (
    <main className="home">
      <VaultHero />

      {/* Stats strip */}
      <section className="stats-section">
        <StatCard value={stats.total} label="Experiences Shared" delay={0.6} />
        <StatCard value={stats.companies} label="Companies Covered" delay={0.7} />
        <StatCard value={stats.questions} label="Questions Archived" delay={0.8} />
      </section>

      {/* Top Companies */}
      {topCompanies.length > 0 && (
        <section className="companies-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Popular Companies
          </motion.h2>
          <div className="companies-grid">
            {topCompanies.map(([company, count], i) => (
              <motion.button
                key={company}
                className="company-pill"
                onClick={() => navigate(`/explore?company=${company}`)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <span>{company}</span>
                <span className="company-count">{count}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
