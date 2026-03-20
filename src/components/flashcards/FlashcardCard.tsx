import { useState } from 'react'
import { motion } from 'motion/react'

interface FlashcardCardProps {
  front: string
  back: string
}

export function FlashcardCard({ front, back }: FlashcardCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full min-h-[260px]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 26 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 border border-surface-300 bg-surface-50 p-8 flex flex-col items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <span className="text-[10px] font-modern tracking-[0.2em] uppercase text-surface-600 mb-5">question</span>
          <p className="text-[17px] text-center text-surface-900 font-body leading-relaxed">{front}</p>
          <span className="absolute bottom-5 text-[11px] text-surface-500 font-body">tap to reveal</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 border border-surface-300 bg-surface-100 p-8 flex flex-col items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-[10px] font-modern tracking-[0.2em] uppercase text-ok mb-5">answer</span>
          <p className="text-[17px] text-center text-surface-900 font-body leading-relaxed">{back}</p>
          <span className="absolute bottom-5 text-[11px] text-surface-500 font-body">tap to go back</span>
        </div>
      </motion.div>
    </div>
  )
}
