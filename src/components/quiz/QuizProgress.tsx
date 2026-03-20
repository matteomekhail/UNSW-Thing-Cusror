import { motion } from 'motion/react'

interface QuizProgressProps {
  current: number
  total: number
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const pct = (current / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="font-display font-bold text-[13px] text-surface-700">
          Question <span className="text-rose">{current + 1}</span>
          <span className="text-surface-500"> / {total}</span>
        </span>
        <span className="text-[11px] text-surface-500 tabular-nums">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-200 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ boxShadow: '0 0 10px rgba(244,63,94,0.4)' }}
        />
      </div>
    </div>
  )
}
