import { useState, useRef, useEffect } from 'react'
import { Lightbulb, CheckCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { AISettings, QuizQuestion as QuizQ } from '../../types'
import { useAI } from '../../hooks/useAI'
import { quizPrompt } from '../../lib/prompts'
import { ChatInput } from '../shared/ChatInput'
import { FeatureCard } from '../shared/FeatureCard'
import { SampleNotes } from '../shared/SampleNotes'
import { UserMessage } from '../shared/UserMessage'
import { TypingIndicator } from '../shared/TypingIndicator'
import { QuizProgress } from './QuizProgress'
import { QuizQuestion } from './QuizQuestion'
import { QuizResults } from './QuizResults'

interface QuizViewProps {
  settings: AISettings
}

interface QuizSession {
  id: number
  notes: string
  questions: QuizQ[]
  currentQ: number
  answers: boolean[]
  done: boolean
}

export function QuizView({ settings }: QuizViewProps) {
  const [notes, setNotes] = useState('')
  const [count, setCount] = useState(10)
  const [sessions, setSessions] = useState<QuizSession[]>([])
  const [sentTexts, setSentTexts] = useState<{ id: number; text: string }[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingAnswer, setPendingAnswer] = useState<{ sessionIdx: number; correct: boolean } | null>(null)
  const { generate } = useAI<QuizQ[]>(settings)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)

  const handleGenerate = async () => {
    if (!notes.trim() || isThinking) return
    const text = notes
    setNotes('')
    setError(null)
    const uid = ++idRef.current
    setSentTexts((t) => [...t, { id: uid, text }])
    setIsThinking(true)

    const result = await generate(quizPrompt(text, count), text)
    setIsThinking(false)
    if (result && result.length > 0) {
      setSessions((s) => [...s, { id: uid, notes: text, questions: result, currentQ: 0, answers: [], done: false }])
    } else {
      setError('Failed to generate quiz. Try again.')
    }
  }

  const handleSelect = (sessionIdx: number, correct: boolean) => {
    setPendingAnswer({ sessionIdx, correct })
  }

  const handleNext = () => {
    if (!pendingAnswer) return
    const { sessionIdx, correct } = pendingAnswer
    setSessions((prev) => {
      const s = [...prev]
      const session = { ...s[sessionIdx] }
      session.answers = [...session.answers, correct]
      if (session.answers.length >= session.questions.length) {
        session.done = true
      } else {
        session.currentQ++
      }
      s[sessionIdx] = session
      return s
    })
    setPendingAnswer(null)
  }

  useEffect(() => {
    // When a quiz finishes, scroll to top; otherwise scroll to bottom
    const justFinished = sessions.some((s) => s.done && s.answers.length === s.questions.length)
    if (justFinished) {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' })
    }
  }, [sentTexts, sessions, isThinking])

  const hasContent = sentTexts.length > 0

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 sm:px-8 lg:px-10 pt-8 pb-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="font-display font-extrabold text-[30px] sm:text-[38px] tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-rose to-orange-400 bg-clip-text text-transparent">Quiz</span>
          </h2>
          <p className="text-[14px] text-surface-600 mt-1">Test your knowledge with AI-generated questions</p>
        </motion.div>

        {!hasContent && !isThinking && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FeatureCard icon={Lightbulb} title="Smart Questions" description="AI creates targeted MCQs that test real understanding." color="rose" delay={0.15} />
              <FeatureCard icon={CheckCircle} title="Instant Feedback" description="See if you're right immediately with explanations." color="teal" delay={0.25} />
              <FeatureCard icon={Trophy} title="Score Tracking" description="Get your final score with a full review." color="amber" delay={0.35} />
            </div>
            <SampleNotes onSelect={setNotes} />
          </div>
        )}

        {hasContent && (
          <div className="space-y-6">
            {sentTexts.map((sent, i) => {
              const session = sessions.find((s) => s.id === sent.id)
              return (
                <div key={sent.id} className="space-y-5">
                  <UserMessage text={sent.text} />
                  {session && !session.done && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-soft to-amber/10 border border-surface-200 flex items-center justify-center shrink-0"><Sparkles size={14} className="text-surface-600" /></div>
                        <p className="text-[13px] text-surface-600 pt-2"><span className="font-semibold text-rose">{session.questions.length} questions</span> — good luck!</p>
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex-1 min-w-0">
                          <QuizProgress current={session.currentQ} total={session.questions.length} />
                        </div>
                        <button
                          onClick={handleNext}
                          disabled={!pendingAnswer || pendingAnswer.sessionIdx !== i}
                          className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-surface-900 text-surface-0 text-[12px] font-semibold transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed enabled:hover:opacity-90"
                        >
                          Next
                          <ArrowRight size={12} />
                        </button>
                      </div>

                      <QuizQuestion key={`${session.id}-${session.currentQ}`} question={session.questions[session.currentQ]} onSelect={(c) => handleSelect(i, c)} />
                    </motion.div>
                  )}
                  {session && session.done && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                      <QuizResults questions={session.questions} answers={session.answers} onRestart={() => {}} />
                    </motion.div>
                  )}
                </div>
              )
            })}
            {isThinking && <TypingIndicator />}
            {error && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-fail/10 border border-fail/20 flex items-center justify-center text-[14px] shrink-0">⚠️</div>
                <div className="rounded-2xl rounded-bl-md bg-fail/5 border border-fail/15 px-4 py-3 text-[13px] text-fail">{error}</div>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={notes}
        onChange={setNotes}
        onSubmit={handleGenerate}
        loading={isThinking}
        placeholder="Paste your study notes here..."
        controls={
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-surface-500 uppercase tracking-wider font-bold font-display">Questions</span>
            {[5, 10, 15, 20].map((n) => (
              <button key={n} onClick={() => setCount(n)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${count === n ? 'bg-rose-bold text-rose border border-rose/30' : 'text-surface-500 border border-surface-300 hover:border-rose/30'}`}
              >{n}</button>
            ))}
          </div>
        }
      />
    </div>
  )
}
