import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="border border-surface-300 p-5 hover:bg-surface-100 transition-colors duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 border border-surface-400 flex items-center justify-center text-surface-700">
          <Icon size={16} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <h4 className="font-modern text-[13px] tracking-[0.04em] lowercase text-surface-900 mb-0.5">{title}</h4>
          <p className="text-[11px] text-surface-600 leading-relaxed font-body">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
