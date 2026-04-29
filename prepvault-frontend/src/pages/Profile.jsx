import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMe, getUserExperiences } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [myExperiences, setMyExperiences] = useState([])
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
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="muted">{user?.email}</p>
            <p className="muted">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">{myExperiences.length}</span>
            <span className="stat-label">Experiences Shared</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user?.savedFavorites?.length || 0}</span>
            <span className="stat-label">Saved Experiences</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Your Submitted Experiences</h2>
          {myExperiences.length === 0 ? (
            <p className="muted">You haven't submitted any experiences yet.</p>
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
                    <h3>{exp.company} - {exp.role}</h3>
                    <span className={`diff-badge ${exp.difficulty <= 2 ? 'easy' : exp.difficulty === 3 ? 'medium' : 'hard'}`}>
                      {exp.difficulty <= 2 ? 'Easy' : exp.difficulty === 3 ? 'Medium' : 'Hard'}
                    </span>
                  </div>
                  <p className="exp-meta">{exp.questions?.length || 0} questions • {exp.rounds || 1} rounds</p>
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
        </div>

        <button className="btn-ghost" onClick={() => navigate('/explore')}>
          ← Back to Explore
        </button>
      </motion.div>
    </main>
  )
}
