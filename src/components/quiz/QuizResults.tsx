import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { RotateCcw, Check, X } from 'lucide-react'
import type { QuizQuestion } from '../../types'

interface QuizResultsProps {
  questions: QuizQuestion[]
  answers: boolean[]
  onRestart: () => void
}

export function QuizResults({ questions, answers, onRestart }: QuizResultsProps) {
  const score = answers.filter(Boolean).length
  const total = questions.length
  const pct = Math.round((score / total) * 100)

  const [displayPct, setDisplayPct] = useState(0)
  useEffect(() => {
    let frame: number
    const start = performance.now()
    const duration = 1200
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayPct(Math.round(eased * pct))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [pct])

  const grade = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good job' : pct >= 40 ? 'Keep going' : 'Keep studying'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Score hero */}
      <div className="relative text-center py-10 rounded-3xl bg-gradient-to-br from-rose-soft to-amber/5 border border-rose/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-rose/10 blur-3xl" />
        </div>
        <div className="relative">
          <p className="text-[72px] font-display font-extrabold leading-none tabular-nums">
            <span className="bg-gradient-to-r from-rose to-orange-400 bg-clip-text text-transparent">{displayPct}</span>
            <span className="text-[36px] text-rose">%</span>
          </p>
          <p className="text-[14px] text-surface-600 mt-2">
            {score} of {total} correct &middot; <span className="text-rose font-semibold">{grade}</span>
          </p>
        </div>
      </div>

      {/* Review */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-bold text-surface-500 uppercase tracking-[0.15em] font-display mb-3">Review</h4>
        {questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.06 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border text-[13px] ${
              answers[i] ? 'border-ok/15 bg-ok/5' : 'border-fail/15 bg-fail/5'
            }`}
          >
            <div className={`shrink-0 mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center ${
              answers[i] ? 'bg-ok/15 text-ok' : 'bg-fail/15 text-fail'
            }`}>
              {answers[i] ? <Check size={12} /> : <X size={12} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-surface-800 leading-relaxed">{q.question}</p>
              {!answers[i] && (
                <p className="text-surface-600 mt-1">Answer: <span className="text-ok font-semibold">{q.options[q.correctIndex]}</span></p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-rose/20 bg-rose-soft text-rose text-[13px] font-semibold hover:bg-rose-bold transition-all"
      >
        <RotateCcw size={14} />
        Try Again
      </button>
    </motion.div>
  )
}
