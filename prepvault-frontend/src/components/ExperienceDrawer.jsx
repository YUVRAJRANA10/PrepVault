import { motion, AnimatePresence } from 'framer-motion'

const DIFFICULTY_LABEL = { 1: 'Very Easy', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Very Hard' }
const DIFFICULTY_CLASS = { 1: 'easy', 2: 'easy', 3: 'medium', 4: 'hard', 5: 'hard' }
const TAG_COLORS = {
  DSA: '#818cf8', DBMS: '#34d399', OS: '#f97316',
  CN: '#38bdf8', HR: '#e879f9'
}

function DiffBar({ value }) {
  return (
    <div className="diff-bar-wrap">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`diff-bar-seg ${i <= value ? DIFFICULTY_CLASS[value] : 'empty'}`} />
      ))}
    </div>
  )
}

export default function ExperienceDrawer({ experience, isFav, onToggleFav, onClose }) {
  if (!experience) return null
  const { company, role, difficulty, questions = [], tags = [], tips, submittedBy, rounds, createdAt } = experience

  const date = createdAt ? new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : null

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="exp-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Centered panel */}
      <motion.div
        className="exp-modal"
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* ── Left column: identity + meta ── */}
        <div className="exp-modal-left">
          <div className="exp-modal-initial">
            {company.charAt(0).toUpperCase()}
          </div>
          <h2 className="exp-modal-company">{company}</h2>
          <p className="exp-modal-role">{role}</p>

          <div className="exp-modal-chips">
            {rounds && (
              <span className="meta-chip">
                🔁 {rounds} Round{rounds > 1 ? 's' : ''}
              </span>
            )}
            <span className={`meta-chip diff-chip ${DIFFICULTY_CLASS[difficulty]}`}>
              {DIFFICULTY_LABEL[difficulty]}
            </span>
          </div>

          <div className="exp-modal-diff-section">
            <p className="exp-modal-label">Difficulty</p>
            <DiffBar value={difficulty} />
          </div>

          {tags.length > 0 && (
            <div className="exp-modal-tags-section">
              <p className="exp-modal-label">Topics</p>
              <div className="card-tags">
                {tags.map(t => (
                  <span key={t} className="tag-pill"
                    style={{ color: TAG_COLORS[t] || '#aaa', borderColor: `${TAG_COLORS[t]}44` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="exp-modal-author-block">
            <p className="exp-modal-label">Shared by</p>
            <p className="exp-modal-author">{submittedBy || 'Anonymous'}</p>
            {date && <p className="exp-modal-date">{date}</p>}
          </div>

          <div className="exp-modal-actions">
            <button
              className={`fav-btn-large ${isFav ? 'active' : ''}`}
              onClick={() => onToggleFav(experience.id)}
            >
              {isFav ? '♥ Saved' : '♡ Save'}
            </button>
            <button className="drawer-close" onClick={onClose}>✕ Close</button>
          </div>
        </div>

        {/* ── Right column: questions + tips ── */}
        <div className="exp-modal-right">
          <div className="exp-modal-right-header">
            <h3 className="exp-modal-questions-title">
              Questions Asked
              <span className="exp-modal-q-count">{questions.length}</span>
            </h3>
          </div>

          <ol className="exp-modal-questions">
            {questions.map((q, i) => (
              <li key={i} className="exp-modal-question-item">
                <span className="exp-q-num">{i + 1}</span>
                <span className="exp-q-text">{q}</span>
              </li>
            ))}
          </ol>

          {tips && (
            <div className="exp-modal-tips">
              <p className="exp-modal-tips-label">💡 Preparation Tips</p>
              <p className="exp-modal-tips-text">{tips}</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
