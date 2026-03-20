import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { List, Network, Copy, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import type { AISettings, Summary } from '../../types'
import { chatCompletionStream } from '../../lib/ai'
import { summaryStreamPrompt } from '../../lib/prompts'
import { parseSummaryFromStream, parsePartialSummary } from '../../lib/parseResponse'
import { ChatInput } from '../shared/ChatInput'
import { FeatureCard } from '../shared/FeatureCard'
import { SampleNotes } from '../shared/SampleNotes'
import { UserMessage } from '../shared/UserMessage'
import { SummaryDisplay } from './SummaryDisplay'

interface SummaryViewProps {
  settings: AISettings
}

interface Message {
  id: number
  type: 'user' | 'result' | 'error' | 'streaming'
  text?: string
  summary?: Summary
  streamText?: string
}

function StreamingSummary({ text }: { text: string }) {
  const partial = useMemo(() => parsePartialSummary(text), [text])
  return <SummaryDisplay summary={partial} streaming />
}

export function SummaryView({ settings }: SummaryViewProps) {
  const [notes, setNotes] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!notes.trim() || isStreaming) return
    if (!settings.apiKey) {
      const eid = ++idRef.current
      setMessages((m) => [...m, { id: eid, type: 'error', text: 'Please configure your API key in Settings.' }])
      return
    }

    const text = notes
    setNotes('')
    const uid = ++idRef.current
    const rid = ++idRef.current
    setMessages((m) => [...m, { id: uid, type: 'user', text }, { id: rid, type: 'streaming', streamText: '' }])
    setIsStreaming(true)

    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    try {
      const full = await chatCompletionStream(
        settings,
        [
          { role: 'system', content: summaryStreamPrompt(text) },
          { role: 'user', content: text },
        ],
        (cumulative) => {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === rid && msg.type === 'streaming' ? { ...msg, streamText: cumulative } : msg,
            ),
          )
        },
        ac.signal,
      )

      let summary: Summary
      try {
        summary = parseSummaryFromStream(full)
      } catch {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === rid && msg.type === 'streaming'
              ? {
                  id: rid,
                  type: 'error',
                  text: 'Could not parse the summary. Try again or shorten your notes.',
                }
              : msg,
          ),
        )
        return
      }
      const hasContent =
        summary.bulletPoints.length + summary.keyConcepts.length + summary.connections.length > 0
      if (!hasContent) {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === rid && msg.type === 'streaming'
              ? {
                  id: rid,
                  type: 'error',
                  text: 'Could not parse the summary. Try again or shorten your notes.',
                }
              : msg,
          ),
        )
      } else {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === rid && msg.type === 'streaming' ? { id: rid, type: 'result', summary } : msg,
          ),
        )
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      const message =
        err instanceof Error ? err.message : 'Failed to generate summary. Try again.'
      setMessages((m) =>
        m.map((msg) =>
          msg.id === rid && msg.type === 'streaming' ? { id: rid, type: 'error', text: message } : msg,
        ),
      )
    } finally {
      setIsStreaming(false)
    }
  }, [notes, isStreaming, settings])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [messages, isStreaming])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 lg:px-10 pt-8 pb-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="font-display font-extrabold text-[30px] sm:text-[38px] tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-sky to-teal bg-clip-text text-transparent">Summary</span>
          </h2>
          <p className="text-[14px] text-surface-600 mt-1">Get structured summaries with key concepts</p>
        </motion.div>

        {!hasMessages && !isStreaming && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FeatureCard icon={List} title="Key Points" description="AI extracts the most important takeaways as clear bullet points." color="sky" delay={0.15} />
              <FeatureCard icon={Network} title="Concept Mapping" description="Identifies core concepts and maps connections between ideas." color="violet" delay={0.25} />
              <FeatureCard icon={Copy} title="Copy & Share" description="One-click copy your entire summary as formatted text." color="teal" delay={0.35} />
            </div>
            <SampleNotes onSelect={setNotes} />
          </div>
        )}

        {hasMessages && (
          <div className="space-y-6">
            {messages.map((msg) => {
              if (msg.type === 'user') return <UserMessage key={msg.id} text={msg.text!} />
              if (msg.type === 'streaming')
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-soft to-teal-soft border border-surface-200 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-surface-600" />
                      </div>
                      <p className="text-[13px] text-surface-600 pt-2">
                        Writing your <span className="font-semibold text-sky">summary</span>…
                      </p>
                    </div>
                    <StreamingSummary text={msg.streamText ?? ''} />
                  </motion.div>
                )
              if (msg.type === 'result' && msg.summary)
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-soft to-teal-soft border border-surface-200 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-surface-600" />
                      </div>
                      <p className="text-[13px] text-surface-600 pt-2">
                        Here&apos;s your <span className="font-semibold text-sky">summary</span>
                      </p>
                    </div>
                    <SummaryDisplay summary={msg.summary} />
                  </motion.div>
                )
              if (msg.type === 'error')
                return (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-fail/10 border border-fail/20 flex items-center justify-center text-[14px] shrink-0">
                      ⚠️
                    </div>
                    <div className="rounded-2xl rounded-bl-md bg-fail/5 border border-fail/15 px-4 py-3 text-[13px] text-fail">
                      {msg.text}
                    </div>
                  </div>
                )
              return null
            })}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={notes}
        onChange={setNotes}
        onSubmit={handleGenerate}
        loading={isStreaming}
        placeholder="Paste your study notes here..."
        controls={hasMessages ? <SampleNotes onSelect={setNotes} compact /> : undefined}
      />
    </div>
  )
}
