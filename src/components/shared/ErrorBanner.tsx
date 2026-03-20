import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface ErrorBannerProps {
  message: string | null
  onDismiss?: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-fail/8 border border-fail/20 text-[13px] text-fail/90 leading-relaxed"
        >
          <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-fail" />
          <p className="flex-1 font-body">{message}</p>
          {onDismiss && (
            <button onClick={onDismiss} className="shrink-0 text-fail/50 hover:text-fail transition-colors">
              <X size={14} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
