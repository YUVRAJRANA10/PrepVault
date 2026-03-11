import { motion } from 'framer-motion'

const DIFFICULTY_LABEL = { 1: 'Very Easy', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Very Hard' }
const DIFFICULTY_CLASS = { 1: 'easy', 2: 'easy', 3: 'medium', 4: 'hard', 5: 'hard' }

const TAG_COLORS = {
  DSA: '#818cf8', DBMS: '#34d399', OS: '#f97316',
  CN: '#38bdf8', HR: '#e879f9'
}

function CompanyInitial({ name }) {
  const colors = ['#c89b3c', '#818cf8', '#34d399', '#f97316', '#38bdf8', '#e879f9', '#f87171']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className="company-initial" style={{ background: `${color}22`, border: `1.5px solid ${color}55`, color }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function ExperienceCard({ experience, onClick, isFav, onToggleFav }) {
  const { company, role, difficulty, questions = [], tags = [], tips, submittedBy } = experience

  return (
    <motion.div
      className="exp-card"
      whileHover={{ y: -4, boxShadow: '0 0 0 1px rgba(200,155,60,0.4), 0 12px 40px rgba(0,0,0,0.5)' }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(experience)}
    >
      <div className="card-header">
        <CompanyInitial name={company} />
        <div className="card-title">
          <h3 className="card-company">{company}</h3>
          <p className="card-role">{role}</p>
        </div>
        <div className="card-header-right">
          <span className={`diff-badge ${DIFFICULTY_CLASS[difficulty]}`}>
            {DIFFICULTY_LABEL[difficulty]}
          </span>
          <button
            className={`fav-btn ${isFav ? 'active' : ''}`}
            onClick={e => { e.stopPropagation(); onToggleFav && onToggleFav(experience.id) }}
            title={isFav ? 'Remove from saved' : 'Save'}
          >
            {isFav ? '♥' : '♡'}
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="card-questions">
          {questions.slice(0, 3).map((q, i) => (
            <p key={i} className="question-item">
              <span className="q-dot">›</span> {q}
            </p>
          ))}
          {questions.length > 3 && (
            <p className="more-questions">+{questions.length - 3} more questions</p>
          )}
        </div>
      )}

      <div className="card-footer">
        <div className="card-tags">
          {(tags || []).map(tag => (
            <span key={tag} className="tag-pill"
              style={{ color: TAG_COLORS[tag] || '#aaa', borderColor: `${TAG_COLORS[tag]}44` || '#333' }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="card-bottom-row">
          {submittedBy && (
            <p className="card-author">by {submittedBy}</p>
          )}
          {tips && <p className="card-tip">💡 {tips.slice(0, 55)}{tips.length > 55 ? '...' : ''}</p>}
        </div>
      </div>
    </motion.div>
  )
}

