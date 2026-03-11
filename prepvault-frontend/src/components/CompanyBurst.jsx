import { motion } from 'framer-motion'

// Real company favicons via Google's favicon API
const COMPANIES = [
  'google.com',
  'amazon.com',
  'microsoft.com',
  'meta.com',
  'apple.com',
  'netflix.com',
  'spotify.com',
  'linkedin.com',
  'atlassian.com',
  'adobe.com',
  'github.com',
  'stripe.com',
  'slack.com',
  'uber.com',
  'airbnb.com',
  'salesforce.com',
  'notion.so',
  'figma.com',
  'zoom.us',
  'oracle.com',
]

const NUM = 20           // total particle lanes
const STAGGER = 0.3      // seconds between each launch
const DURATION = 3.4     // seconds to travel from center to edge
const CYCLE = NUM * STAGGER   // = 6s full cycle
const REPEAT_DELAY = CYCLE - DURATION  // = 2.6s wait before repeating

// Pre-compute all particle paths (deterministic, no runtime Math.random)
const PARTICLES = Array.from({ length: NUM }, (_, i) => {
  const angle = (i * 360) / NUM            // evenly spaced angles around 360°
  const rad = (angle * Math.PI) / 180
  const dist = 190 + (i % 4) * 28         // 190, 218, 246, 274px — varied depth
  return {
    id: i,
    tx: Math.cos(rad) * dist,
    ty: Math.sin(rad) * dist,
    delay: i * STAGGER,
    domain: COMPANIES[i % COMPANIES.length],
    name: COMPANIES[i % COMPANIES.length].split('.')[0],
  }
})

export default function CompanyBurst() {
  return (
    <div className="burst-container" aria-hidden="true">
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="burst-particle"
          animate={{
            x: [0, p.tx * 0.1, p.tx],
            y: [0, p.ty * 0.1, p.ty],
            opacity: [0, 0, 1, 1, 0],
            scale:   [0.3, 0.6, 1.15, 1, 0.55],
          }}
          transition={{
            duration: DURATION,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: REPEAT_DELAY,
            ease: 'easeOut',
            times: [0, 0.05, 0.15, 0.68, 1],
          }}
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=64`}
            alt={p.name}
            width={30}
            height={30}
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  )
}
