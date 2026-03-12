import { motion } from 'framer-motion'

const COMPANIES = [
  'google.com', 'amazon.com', 'microsoft.com', 'meta.com',
  'apple.com', 'netflix.com', 'spotify.com', 'linkedin.com',
  'atlassian.com', 'adobe.com', 'github.com', 'stripe.com',
  'slack.com', 'uber.com', 'airbnb.com', 'salesforce.com',
  'notion.so', 'figma.com', 'zoom.us', 'oracle.com',
]

// ── Design: multiple waves, each wave shoots all directions at once ──
// At any moment multiple waves are mid-flight → feels like continuous stream
const NUM_DIRECTIONS = 10   // angles per wave (36° apart)
const NUM_WAVES = 4         // overlapping waves
const DURATION = 5.5        // seconds per logo journey — slow enough to recognise
const WAVE_OFFSET = DURATION / NUM_WAVES  // 1.375s between wave starts

const PARTICLES = []
for (let w = 0; w < NUM_WAVES; w++) {
  for (let d = 0; d < NUM_DIRECTIONS; d++) {
    // Each wave rotated slightly so logos don't stack exactly on top
    const angle = (d * 360) / NUM_DIRECTIONS + w * 9
    const rad = (angle * Math.PI) / 180
    // Vary distance so waves look like different "depth" streams
    const dist = 160 + (w * 22) + (d % 3) * 18
    PARTICLES.push({
      id: w * NUM_DIRECTIONS + d,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      initialDelay: w * WAVE_OFFSET,
      domain: COMPANIES[(w * NUM_DIRECTIONS + d) % COMPANIES.length],
    })
  }
}

export default function CompanyBurst() {
  return (
    <div className="burst-container" aria-hidden="true">
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="burst-particle"
          animate={{
            x: [0, p.tx * 0.08, p.tx],
            y: [0, p.ty * 0.08, p.ty],
            opacity: [0, 0, 1, 1, 0],
            scale:   [0.3, 0.65, 1.2, 1.1, 0.5],
          }}
          transition={{
            duration: DURATION,
            delay: p.initialDelay,
            repeat: Infinity,
            repeatDelay: 0,
            ease: 'easeOut',
            times: [0, 0.05, 0.15, 0.78, 1],  // stays at full opacity until 78% of journey
          }}
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=64`}
            alt=""
            width={36}
            height={36}
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  )
}

