import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Check, X, ChevronDown } from 'lucide-react'
import type { QuizQuestion } from '../../types'

interface QuizResultsProps {
  questions: QuizQuestion[]
  answers: boolean[]
  onRestart: () => void
}

function ScoreRing({ pct, displayPct }: { pct: number; displayPct: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  const color = pct >= 80 ? 'var(--color-ok)' : pct >= 50 ? 'var(--color-amber)' : 'var(--color-fail)'

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-surface-200)" strokeWidth="7" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[38px] sm:text-[44px] font-display font-extrabold leading-none tabular-nums text-surface-900">
          {displayPct}
        </span>
        <span className="text-[13px] text-surface-500 -mt-0.5">percent</span>
      </div>
    </div>
  )
}

function ReviewCard({ question, answer, index, delay }: { question: QuizQuestion; answer: boolean; index: number; delay: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`border rounded-xl overflow-hidden transition-colors ${
        answer ? 'border-ok/20 bg-ok/[0.03]' : 'border-fail/20 bg-fail/[0.03]'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3.5 sm:p-4 text-left"
      >
        <div className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
          answer ? 'bg-ok/15 text-ok' : 'bg-fail/15 text-fail'
        }`}>
          {answer ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
        </div>
        <span className="text-[11px] font-bold text-surface-500 font-display shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 min-w-0 text-[13px] text-surface-800 leading-snug truncate">
          {question.question}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-surface-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="border-t border-surface-200"
        >
          <div className="px-4 py-3 space-y-2.5">
            {question.options.map((opt, i) => {
              const isCorrect = i === question.correctIndex
              let style = 'text-surface-500'
              if (isCorrect) style = 'text-ok font-semibold'
              else if (!answer && i !== question.correctIndex) style = 'text-surface-400'

              return (
                <div key={i} className={`flex items-start gap-2 text-[12px] ${style}`}>
                  <span className="shrink-0 w-4 text-right font-display font-bold opacity-60">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                  {isCorrect && <Check size={11} className="shrink-0 mt-0.5 text-ok" />}
                </div>
              )
            })}
            {question.explanation && (
              <p className="text-[11px] text-surface-500 leading-relaxed pt-1 border-t border-surface-200/60">
                {question.explanation}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export function QuizResults({ questions, answers }: QuizResultsProps) {
  const score = answers.filter(Boolean).length
  const total = questions.length
  const pct = Math.round((score / total) * 100)

  const [displayPct, setDisplayPct] = useState(0)
  useEffect(() => {
    let frame: number
    const start = performance.now()
    const duration = 1400
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayPct(Math.round(eased * pct))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [pct])

  const grade = pct >= 80 ? 'Excellent work' : pct >= 60 ? 'Good effort' : pct >= 40 ? 'Keep practicing' : 'Keep studying'

  const wrongOnes = questions.map((q, i) => ({ q, i, correct: answers[i] })).filter((x) => !x.correct)
  const rightOnes = questions.map((q, i) => ({ q, i, correct: answers[i] })).filter((x) => x.correct)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Score hero - compact, centered */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center gap-4 py-8"
      >
        <ScoreRing pct={pct} displayPct={displayPct} />
        <div className="text-center">
          <p className="text-[14px] font-semibold text-surface-800">{grade}</p>
          <p className="text-[12px] text-surface-500 mt-0.5">
            {score} of {total} correct
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-ok" />
            <span className="text-[12px] text-surface-600 tabular-nums">{score} correct</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-fail" />
            <span className="text-[12px] text-surface-600 tabular-nums">{total - score} wrong</span>
          </div>
        </div>
      </motion.div>

      {/* Review - wrong first */}
      {wrongOnes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-fail uppercase tracking-[0.15em] font-display px-1">
            Missed ({wrongOnes.length})
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {wrongOnes.map((item, idx) => (
              <ReviewCard
                key={item.i}
                question={item.q}
                answer={false}
                index={item.i}
                delay={0.8 + idx * 0.05}
              />
            ))}
          </div>
        </div>
      )}

      {rightOnes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-ok uppercase tracking-[0.15em] font-display px-1">
            Correct ({rightOnes.length})
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {rightOnes.map((item, idx) => (
              <ReviewCard
                key={item.i}
                question={item.q}
                answer={true}
                index={item.i}
                delay={0.8 + (wrongOnes.length + idx) * 0.05}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
