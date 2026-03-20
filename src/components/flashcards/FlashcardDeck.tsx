import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { Flashcard } from '../../types'
import { FlashcardCard } from './FlashcardCard'

interface FlashcardDeckProps {
  cards: Flashcard[]
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const prev = useCallback(() => { if (index > 0) { setDirection(-1); setIndex((i) => i - 1) } }, [index])
  const next = useCallback(() => { if (index < cards.length - 1) { setDirection(1); setIndex((i) => i + 1) } }, [index, cards.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  useEffect(() => { setIndex(0) }, [cards])

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction > 0 ? 150 : -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -150 : 150, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <FlashcardCard front={cards[index].front} back={cards[index].back} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button onClick={prev} disabled={index === 0} className="p-2.5 border border-surface-300 text-surface-600 hover:text-surface-900 hover:bg-surface-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-1.5">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
              className={`rounded-full transition-all duration-300 ${i === index ? 'w-6 h-2 bg-surface-900' : 'w-2 h-2 bg-surface-400 hover:bg-surface-600'}`}
            />
          ))}
        </div>
        <button onClick={next} disabled={index === cards.length - 1} className="p-2.5 border border-surface-300 text-surface-600 hover:text-surface-900 hover:bg-surface-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
          <ChevronRight size={18} />
        </button>
      </div>
      <p className="text-center text-[11px] text-surface-500 font-body tracking-wide">Arrow keys to navigate · Click card to flip</p>
    </div>
  )
}
