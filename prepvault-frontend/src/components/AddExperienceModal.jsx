import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createExperience } from '../api'
import { useNavigate } from 'react-router-dom'

const AVAILABLE_TAGS = ['DSA', 'DBMS', 'OS', 'CN', 'HR']

const EMPTY_FORM = {
  company: '', role: '', rounds: '', difficulty: 3,
  questions: '', tags: [], tips: '', submittedBy: ''
}

export default function AddExperienceModal({ onClose, onAdded }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('') // Clear error when user changes any field
  }

  const handleFile = (e) => {
    setFile(e.target.files[0] || null)
    setError('') // Clear error when user selects file
  }

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
    setError('') // Clear error when user changes tags
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate difficulty is a number between 1 and 5
    const diffValue = Number(form.difficulty)
    if (isNaN(diffValue) || diffValue < 1 || diffValue > 5) {
      setError('Difficulty must be a number between 1 and 5')
      setLoading(false)
      return
    }

    const questionsArray = form.questions
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0)

    try {
      // if a file is attached, send as FormData
      if (file) {
        const fd = new FormData()
        fd.append('company', form.company)
        fd.append('role', form.role)
        fd.append('rounds', Number(form.rounds) || 1)
        fd.append('difficulty', Number(form.difficulty))
        fd.append('questions', JSON.stringify(questionsArray))
        fd.append('tags', JSON.stringify(form.tags))
        fd.append('tips', form.tips)
        fd.append('submittedBy', form.submittedBy.trim() || 'Anonymous')
        fd.append('attachments', file)
        await createExperience(fd)
      } else {
        await createExperience({
          company: form.company,
          role: form.role,
          rounds: Number(form.rounds) || 1,
          difficulty: Number(form.difficulty),
          questions: questionsArray,
          tags: form.tags,
          tips: form.tips,
          submittedBy: form.submittedBy.trim() || 'Anonymous'
        })
      }
      onAdded()
      onClose()
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login first to submit an experience')
        setTimeout(() => navigate('/login'), 800)
        return
      }
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Share Your Experience</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          <form onSubmit={handleSubmit} className="exp-form">
            <div className="form-row">
              <div className="form-group">
                <label>Company *</label>
                <input name="company" value={form.company} onChange={handleChange}
                  placeholder="e.g. Amazon" required />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <input name="role" value={form.role} onChange={handleChange}
                  placeholder="e.g. SDE Intern" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rounds</label>
                <input name="rounds" type="number" min="1" max="10"
                  value={form.rounds} onChange={handleChange} placeholder="e.g. 3" />
              </div>
              <div className="form-group">
                <label>Difficulty (1-5): <span className="gold">{Math.max(1, Math.min(5, Number(form.difficulty) || 3))}/5</span></label>
                <input name="difficulty" type="range" min="1" max="5"
                  value={form.difficulty} onChange={handleChange} className="slider" />
              </div>
            </div>

            <div className="form-group">
              <label>Questions Asked * <span className="muted">(one per line)</span></label>
              <textarea name="questions" value={form.questions} onChange={handleChange}
                placeholder={"What is REST API?\nExplain normalization\nDifference between stack and queue"}
                rows={5} required />
            </div>

            <div className="form-group">
              <label>Topics Covered</label>
              <div className="tag-selector">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag} type="button"
                    className={`tag-toggle ${form.tags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Preparation Tips</label>
              <textarea name="tips" value={form.tips} onChange={handleChange}
                placeholder="What helped you prepare..." rows={3} />
            </div>

            <div className="form-group">
              <label>Attachment (optional)</label>
              <input type="file" name="attachment" onChange={handleFile} />
            </div>

            <div className="form-group">
              <label>Your Name <span className="muted">(optional)</span></label>
              <input name="submittedBy" value={form.submittedBy} onChange={handleChange}
                placeholder="e.g. Priya S." maxLength={40} />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn-primary full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Experience'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
