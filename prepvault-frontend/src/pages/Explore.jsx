import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ExperienceCard from '../components/ExperienceCard'
import AddExperienceModal from '../components/AddExperienceModal'
import ExperienceDrawer from '../components/ExperienceDrawer'
import { getAuthToken, getExperiences, toggleFavorite, getMe } from '../api'
import socket from '../utils/socket'

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

function difficultyMatch(difficulty, filter) {
  if (filter === 'All') return true
  if (filter === 'Easy') return difficulty <= 2
  if (filter === 'Medium') return difficulty === 3
  if (filter === 'Hard') return difficulty >= 4
}

export default function Explore() {
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('All')
  const [selectedDiff, setSelectedDiff] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showFavsOnly, setShowFavsOnly] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [toast, setToast] = useState(null)
  const [searchParams] = useSearchParams()
  const selectedRef = useRef(null)

  const getExpId = (exp) => exp._id || exp.id

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getExperiences()
      setExperiences(res.data)
      
      // Load user's saved favorites from DB if logged in
      if (getAuthToken()) {
        try {
          const userRes = await getMe()
          const favIds = userRes.data.data.savedFavorites?.map(f => f._id || f) || []
          setFavorites(favIds)
        } catch (err) {
          console.warn('Failed to load user favorites:', err)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    if (searchParams.get('company')) setSelectedCompany(searchParams.get('company'))
    let toastTimer = null

    const upsertExperience = (incoming) => {
      setExperiences(prev => {
        const incomingId = getExpId(incoming)
        const existingIndex = prev.findIndex(item => getExpId(item) === incomingId)
        if (existingIndex === -1) return [incoming, ...prev]
        const next = [...prev]
        next[existingIndex] = { ...next[existingIndex], ...incoming }
        return next
      })
    }

    socket.on('new-experience', (exp) => {
      upsertExperience(exp)
      setToast({ message: `New experience: ${exp.company} - ${exp.role}`, expId: exp._id || exp.id })
      if (toastTimer) clearTimeout(toastTimer)
      toastTimer = setTimeout(() => setToast(null), 6000)
    })

    socket.on('experience-updated', (exp) => {
      upsertExperience(exp)
      if (selectedRef.current && getExpId(selectedRef.current) === getExpId(exp)) {
        setSelected(prev => ({ ...prev, ...exp }))
      }
    })

    return () => {
      socket.off('new-experience')
      socket.off('experience-updated')
      if (toastTimer) clearTimeout(toastTimer)
    }
  }, [])

  useEffect(() => {
    selectedRef.current = selected
  }, [selected])

  const companies = ['All', ...new Set(experiences.map(e => e.company))]

  const toggleFav = async (id) => {
    if (!getAuthToken()) {
      navigate('/login')
      return
    }
    
    try {
      await toggleFavorite(id)
      setFavorites(prev => {
        const idx = prev.indexOf(id)
        if (idx > -1) {
          return prev.filter((_, i) => i !== idx)
        } else {
          return [...prev, id]
        }
      })
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  const filtered = experiences.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q || e.company.toLowerCase().includes(q)
      || e.role.toLowerCase().includes(q)
      || e.questions?.some(qs => qs.toLowerCase().includes(q))
    const matchCompany = selectedCompany === 'All' || e.company === selectedCompany
    const matchDiff = difficultyMatch(e.difficulty, selectedDiff)
    const matchFav = !showFavsOnly || favorites.includes(getExpId(e))
    return matchSearch && matchCompany && matchDiff && matchFav
  })

  return (
    <main className="explore">
      {/* Header */}
      <div className="explore-header">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          Explore <span className="gold">Experiences</span>
        </motion.h1>
        <motion.p className="muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {filtered.length} experience{filtered.length !== 1 ? 's' : ''} found
        </motion.p>
      </div>

      {/* Search + Filters */}
      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="🔍  Search by company, role or question..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="filter-section">
          <div className="filter-group">
            <span className="filter-label">Company</span>
            <div className="filter-pills">
              {companies.slice(0, 9).map(c => (
                <button
                  key={c}
                  className={`filter-pill ${selectedCompany === c ? 'active' : ''}`}
                  onClick={() => setSelectedCompany(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Difficulty</span>
            <div className="filter-pills">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  className={`filter-pill diff-pill ${d.toLowerCase()} ${selectedDiff === d ? 'active' : ''}`}
                  onClick={() => setSelectedDiff(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Show</span>
            <div className="filter-pills">
              <button
                className={`filter-pill fav-filter-pill ${showFavsOnly ? 'active' : ''}`}
                onClick={() => setShowFavsOnly(p => !p)}
              >
                {showFavsOnly ? '♥ Saved' : '♡ Saved'}
                {favorites.length > 0 && <span className="fav-count">{favorites.length}</span>}
              </button>
            </div>
          </div>

          {(selectedCompany !== 'All' || selectedDiff !== 'All' || search || showFavsOnly) && (
            <button
              className="clear-filters"
              onClick={() => { setSelectedCompany('All'); setSelectedDiff('All'); setSearch(''); setShowFavsOnly(false) }}
            >
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="loading">
          <motion.div className="spinner" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            🔐
          </motion.div>
          <p>Loading vault...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>🔍 No experiences found.</p>
          <p className="muted">Be the first to share one!</p>
        </div>
      ) : (
        <motion.div
          className="cards-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } }
          }}
        >
          {filtered.map(exp => (
            <motion.div
              key={getExpId(exp)}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            >
              <ExperienceCard
                experience={exp}
                onClick={setSelected}
                isFav={favorites.includes(getExpId(exp))}
                onToggleFav={toggleFav}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <ExperienceDrawer
            experience={selected}
            isFav={favorites.includes(getExpId(selected))}
            onToggleFav={toggleFav}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Add Button */}
      <motion.button
        className="fab"
        onClick={() => {
          if (!getAuthToken()) {
            navigate('/login')
            return
          }
          setShowModal(true)
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Share your experience"
      >
        +
      </motion.button>

      {showModal && (
        <AddExperienceModal
          onClose={() => setShowModal(false)}
          onAdded={fetchData}
        />
      )}
      {toast && (
        <div className="socket-toast" onClick={() => {
          if (toast.expId) setSelected(experiences.find(e => (e._id || e.id) === toast.expId))
          setToast(null)
        }}>
          {toast.message} — click to open
        </div>
      )}
    </main>
  )
}
