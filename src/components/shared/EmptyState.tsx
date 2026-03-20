import type { ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  illustration?: 'cards' | 'quiz' | 'summary'
}

function CardsIllustration() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back card */}
      <rect x="30" y="10" width="100" height="70" rx="12" className="fill-surface-200 stroke-surface-300" strokeWidth="1.5" />
      <rect x="44" y="26" width="50" height="5" rx="2.5" className="fill-surface-400" opacity="0.5" />
      <rect x="44" y="38" width="35" height="5" rx="2.5" className="fill-surface-400" opacity="0.3" />
      {/* Front card */}
      <rect x="20" y="40" width="120" height="80" rx="14" className="fill-surface-100 stroke-accent/30" strokeWidth="1.5" />
      <circle cx="50" cy="68" r="8" className="fill-accent/20" />
      <rect x="68" y="64" width="52" height="5" rx="2.5" className="fill-surface-300" />
      <rect x="68" y="76" width="36" height="5" rx="2.5" className="fill-surface-300" opacity="0.5" />
      <rect x="38" y="94" width="64" height="5" rx="2.5" className="fill-surface-300" opacity="0.3" />
      {/* Flip arrow */}
      <path d="M134 75c0-8-6-14-14-14" className="stroke-accent" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M130 63l-4-2 2 4" className="fill-accent" />
    </svg>
  )
}

function QuizIllustration() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Paper */}
      <rect x="30" y="15" width="100" height="110" rx="12" className="fill-surface-100 stroke-surface-300" strokeWidth="1.5" />
      {/* Question mark */}
      <text x="80" y="58" textAnchor="middle" className="fill-accent" fontSize="32" fontWeight="700" fontFamily="var(--font-display)">?</text>
      {/* Option rows */}
      <g opacity="0.7">
        <rect x="46" y="72" width="10" height="10" rx="3" className="stroke-accent/40 fill-accent/10" strokeWidth="1.2" />
        <rect x="62" y="74" width="48" height="5" rx="2.5" className="fill-surface-300" />
      </g>
      <g opacity="0.5">
        <rect x="46" y="90" width="10" height="10" rx="3" className="stroke-surface-400" strokeWidth="1.2" fill="none" />
        <rect x="62" y="92" width="40" height="5" rx="2.5" className="fill-surface-300" />
      </g>
      <g opacity="0.35">
        <rect x="46" y="108" width="10" height="10" rx="3" className="stroke-surface-400" strokeWidth="1.2" fill="none" />
        <rect x="62" y="110" width="44" height="5" rx="2.5" className="fill-surface-300" />
      </g>
    </svg>
  )
}

function SummaryIllustration() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document */}
      <rect x="30" y="10" width="100" height="115" rx="12" className="fill-surface-100 stroke-surface-300" strokeWidth="1.5" />
      {/* Header line */}
      <rect x="46" y="28" width="68" height="6" rx="3" className="fill-accent/25" />
      {/* Bullet points */}
      <circle cx="50" cy="52" r="2.5" className="fill-accent/60" />
      <rect x="58" y="49" width="56" height="5" rx="2.5" className="fill-surface-300" />
      <circle cx="50" cy="68" r="2.5" className="fill-accent/40" />
      <rect x="58" y="65" width="48" height="5" rx="2.5" className="fill-surface-300" opacity="0.7" />
      <circle cx="50" cy="84" r="2.5" className="fill-accent/30" />
      <rect x="58" y="81" width="52" height="5" rx="2.5" className="fill-surface-300" opacity="0.5" />
      {/* Concept chips */}
      <rect x="46" y="100" width="30" height="14" rx="7" className="fill-accent/10 stroke-accent/20" strokeWidth="1" />
      <rect x="82" y="100" width="36" height="14" rx="7" className="fill-accent/10 stroke-accent/20" strokeWidth="1" />
    </svg>
  )
}

const illustrationComponents: Record<string, () => ReactElement> = {
  cards: CardsIllustration,
  quiz: QuizIllustration,
  summary: SummaryIllustration,
}

export function EmptyState({ icon: Icon, title, description, illustration }: EmptyStateProps) {
  const Illust = illustration ? illustrationComponents[illustration] : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      {Illust ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-4"
        >
          <Illust />
        </motion.div>
      ) : (
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-2xl bg-accent/5 blur-xl scale-150" />
          <div className="relative p-5 rounded-2xl border border-surface-200 bg-surface-100">
            <Icon size={28} strokeWidth={1.5} className="text-surface-500" />
          </div>
        </div>
      )}
      <h3 className="font-display font-bold text-[16px] text-surface-800 mb-1.5">{title}</h3>
      <p className="text-[13px] text-surface-500 max-w-[300px] leading-relaxed">{description}</p>
    </motion.div>
  )
}
