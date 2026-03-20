import { motion } from 'motion/react'
import type { TabId } from '../../types'

const tabs: { id: TabId; label: string }[] = [
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'summary', label: 'Summary' },
]

interface TabBarProps {
  active: TabId
  onChange: (id: TabId) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="flex gap-0 border-b border-void-800 max-w-[680px] mx-auto w-full"
    >
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`relative py-3 px-5 text-[14px] font-medium tracking-wide transition-colors duration-200 ${
            active === id
              ? 'text-ember'
              : 'text-void-400 hover:text-void-200'
          }`}
        >
          {label}
          {active === id && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-ember"
              style={{ boxShadow: '0 1px 8px rgba(255,138,0,0.3)' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>
      ))}
    </motion.nav>
  )
}
