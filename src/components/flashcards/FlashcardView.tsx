import { useState, useRef, useEffect } from 'react'
import { Brain, RotateCcw, Keyboard, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import type { AISettings, Flashcard } from '../../types'
import { useAI } from '../../hooks/useAI'
import { flashcardPrompt } from '../../lib/prompts'
import { ChatInput } from '../shared/ChatInput'
import { FeatureCard } from '../shared/FeatureCard'
import { SampleNotes } from '../shared/SampleNotes'
import { UserMessage } from '../shared/UserMessage'
import { TypingIndicator } from '../shared/TypingIndicator'
import { FlashcardDeck } from './FlashcardDeck'

interface FlashcardViewProps { settings: AISettings }
interface Message { id: number; type: 'user' | 'result' | 'error'; text?: string; cards?: Flashcard[] }

export function FlashcardView({ settings }: FlashcardViewProps) {
  const [notes, setNotes] = useState('')
  const [count, setCount] = useState(10)
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const { generate } = useAI<Flashcard[]>(settings)
  const bottomRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)

  const handleGenerate = async () => {
    if (!notes.trim() || isThinking) return
    const text = notes; setNotes('')
    const uid = ++idRef.current
    setMessages((m) => [...m, { id: uid, type: 'user', text }])
    setIsThinking(true)
    const result = await generate(flashcardPrompt(text, count), text)
    setIsThinking(false)
    const rid = ++idRef.current
    if (result && result.length > 0) {
      setMessages((m) => [...m, { id: rid, type: 'result', cards: result }])
    } else {
      setMessages((m) => [...m, { id: rid, type: 'error', text: 'Failed to generate flashcards. Try again.' }])
    }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'instant' }) }, [messages, isThinking])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 lg:px-10 pt-8 pb-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="font-display text-[clamp(2.5rem,8vw,5rem)] font-extrabold text-surface-900 lowercase leading-[0.9] tracking-[0.01em]">
            flashcards
          </h2>
          <p className="font-modern text-[14px] tracking-[0.06em] lowercase text-surface-600 mt-3">generate interactive study cards from your notes</p>
        </motion.div>

        {messages.some((m) => m.type === 'error') && null}

        {messages.length === 0 && !isThinking && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-collapse">
              <FeatureCard icon={Brain} title="ai-powered" description="Smart flashcards from your notes. Front = question, back = answer." delay={0.15} />
              <FeatureCard icon={RotateCcw} title="3d flip cards" description="Beautiful 3D flip animation. Click or tap to reveal." delay={0.25} />
              <FeatureCard icon={Keyboard} title="keyboard nav" description="Arrow keys to browse. Dot indicators show position." delay={0.35} />
            </div>
            <SampleNotes onSelect={setNotes} />
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-6">
            {messages.map((msg) => {
              if (msg.type === 'user') return <UserMessage key={msg.id} text={msg.text!} />
              if (msg.type === 'result' && msg.cards) return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 border border-surface-300 flex items-center justify-center shrink-0"><Sparkles size={14} className="text-surface-600" /></div>
                    <p className="text-[13px] text-surface-600 pt-2 font-body">here are your <span className="text-surface-900">{msg.cards.length} flashcards</span></p>
                  </div>
                  <FlashcardDeck cards={msg.cards} />
                </motion.div>
              )
              if (msg.type === 'error') return (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-fail/30 flex items-center justify-center text-[14px] shrink-0">⚠️</div>
                  <div className="border border-fail/20 bg-fail/5 px-4 py-3 text-[13px] text-fail font-body">{msg.text}</div>
                </div>
              )
              return null
            })}
            {isThinking && <TypingIndicator />}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={notes} onChange={setNotes} onSubmit={handleGenerate} loading={isThinking}
        placeholder="paste your study notes here..."
        controls={
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 font-modern uppercase tracking-[0.12em]">cards</span>
              {[5, 10, 15, 20].map((n) => (
                <button key={n} onClick={() => setCount(n)}
                  className={`px-2.5 py-1 text-[11px] font-modern tracking-[0.04em] transition-all ${count === n ? 'bg-surface-900 text-surface-0' : 'text-surface-500 border border-surface-300 hover:text-surface-800'}`}
                >{n}</button>
              ))}
            </div>
            {messages.length > 0 && <SampleNotes onSelect={setNotes} compact />}
          </div>
        }
      />
    </div>
  )
}
