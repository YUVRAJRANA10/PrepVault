import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMe, getUserExperiences } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [myExperiences, setMyExperiences] = useState([])
  const [savedFavorites, setSavedFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const [meRes, expRes] = await Promise.all([
          getMe(),
          getUserExperiences()
        ])
        setUser(meRes.data.data)
        setMyExperiences(expRes.data.data || [])
        setSavedFavorites(meRes.data.data?.savedFavorites || [])
      } catch (err) {
        console.error('Failed to load profile:', err)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [navigate])

  if (loading) {
    return (
      <main className="profile-page">
        <div className="loading">
          <motion.div className="spinner" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
            🔐
          </motion.div>
          <p>Loading profile...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <motion.section
          className="profile-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="profile-heading">
            <h1>{user?.name}</h1>
            <p className="muted">{user?.email}</p>
            <p className="muted">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div className="profile-badges">
            <span className="profile-badge">{myExperiences.length} stories shared</span>
            <span className="profile-badge">{savedFavorites.length} saved</span>
            <span className="profile-badge">Community contributor</span>
          </div>
        </motion.section>

        <div className="profile-grid">
          <motion.section
            className="profile-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="profile-section-title">
              <h2>Your Submitted Stories</h2>
              <span className="profile-badge">{myExperiences.length}</span>
            </div>

            {myExperiences.length === 0 ? (
              <div className="profile-empty">
                <p className="profile-empty-text">You haven't submitted any stories yet.</p>
                <p className="profile-empty-sub muted">Share an interview experience to build your profile here.</p>
                <button className="btn-primary profile-cta" onClick={() => navigate('/explore')}>
                  Share your first story
                </button>
              </div>
            ) : (
              <div className="experience-list">
                {myExperiences.map(exp => (
                  <motion.div
                    key={exp._id}
                    className="experience-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="exp-header">
                      <div>
                        <h3>{exp.company} - {exp.role}</h3>
                        <p className="exp-meta">{exp.questions?.length || 0} questions • {exp.rounds || 1} rounds</p>
                      </div>
                      <span className={`diff-badge ${exp.difficulty <= 2 ? 'easy' : exp.difficulty === 3 ? 'medium' : 'hard'}`}>
                        {exp.difficulty <= 2 ? 'Easy' : exp.difficulty === 3 ? 'Medium' : 'Hard'}
                      </span>
                    </div>
                    {exp.tags?.length > 0 && (
                      <div className="exp-tags">
                        {exp.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          <div className="profile-sidebar">
            <motion.section
              className="profile-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="profile-section-title">
                <h2>Saved Stories</h2>
                <span className="profile-badge">{savedFavorites.length}</span>
              </div>

              {savedFavorites.length === 0 ? (
                <div className="profile-empty">
                  <p className="profile-empty-text">No saved stories yet.</p>
                  <p className="profile-empty-sub muted">Use the heart icon on Explore to save stories here.</p>
                </div>
              ) : (
                <div className="saved-list">
                  {savedFavorites.map((fav) => (
                    <div className="saved-item" key={fav._id || fav.id}>
                      <strong>{fav.company}</strong>
                      <p className="muted">{fav.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

            <motion.section
              className="profile-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="profile-section-title">
                <h2>Quick Stats</h2>
              </div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="stat-value gold">{myExperiences.length}</span>
                  <span className="stat-label">Stories Shared</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-value gold">{savedFavorites.length}</span>
                  <span className="stat-label">Saved</span>
                </div>
              </div>
              <button className="btn-ghost profile-cta" onClick={() => navigate('/explore')}>
                ← Back to Explore
              </button>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  )
}
