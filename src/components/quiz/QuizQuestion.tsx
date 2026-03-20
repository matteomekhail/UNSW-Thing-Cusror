import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import type { QuizQuestion as QuizQ } from '../../types'

interface QuizQuestionProps {
  question: QuizQ
  onSelect: (correct: boolean) => void
}

export function QuizQuestion({ question, onSelect }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
    onSelect(i === question.correctIndex)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-5"
    >
      <h3 className="text-[18px] font-semibold text-surface-950 leading-relaxed">{question.question}</h3>

      <div className="space-y-2.5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex
          const isSelected = i === selected

          let cls = 'border-surface-300 hover:border-violet/30 hover:bg-violet-soft/50'
          let labelCls = 'text-surface-500 border-surface-400'
          let textCls = 'text-surface-800'

          if (answered) {
            if (isCorrect) {
              cls = 'border-ok/40 bg-ok/8'
              labelCls = 'text-ok border-ok/40 bg-ok/15'
              textCls = 'text-ok'
            } else if (isSelected) {
              cls = 'border-fail/40 bg-fail/8'
              labelCls = 'text-fail border-fail/40 bg-fail/15'
              textCls = 'text-fail'
            } else {
              cls = 'border-surface-200 opacity-30'
              textCls = 'text-surface-500'
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              layout
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${cls}`}
            >
              <span className={`shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center text-[12px] font-bold font-display transition-all ${labelCls}`}>
                {answered && isCorrect ? <Check size={14} /> : answered && isSelected ? <X size={14} /> : String.fromCharCode(65 + i)}
              </span>
              <span className={`text-[14px] leading-relaxed ${textCls}`}>{opt}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
