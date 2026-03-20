import { useState } from 'react'
import { motion } from 'motion/react'
import { Copy, Check, ArrowRight } from 'lucide-react'
import type { Summary } from '../../types'

interface SummaryDisplayProps {
  summary: Summary
  streaming?: boolean
}

function StreamCursor() {
  return <span className="inline-block w-1.5 h-4 ml-1 align-[-3px] bg-surface-600 animate-pulse rounded-sm" aria-hidden />
}

export function SummaryDisplay({ summary, streaming }: SummaryDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = [
      'KEY POINTS',
      ...summary.bulletPoints.map((b) => `- ${b}`),
      '',
      'KEY CONCEPTS',
      summary.keyConcepts.join(', '),
      '',
      'CONNECTIONS',
      ...summary.connections.map((c) => `- ${c}`),
    ].join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasPoints = summary.bulletPoints.length > 0
  const hasConcepts = summary.keyConcepts.length > 0
  const hasConnections = summary.connections.length > 0
  const isEmpty = !hasPoints && !hasConcepts && !hasConnections

  const cursorInPoints = streaming && hasPoints && !hasConcepts && !hasConnections
  const cursorInConcepts = streaming && hasConcepts && !hasConnections
  const cursorInConnections = streaming && hasConnections

  return (
    <div className="space-y-6">
      {!streaming && !isEmpty && (
        <div className="flex justify-end">
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-[12px] text-surface-600 hover:text-surface-900 transition-colors">
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy all'}
          </button>
        </div>
      )}

      {/* Loading state */}
      {streaming && isEmpty && (
        <div className="rounded-2xl border border-surface-200 bg-surface-100/50 p-6">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-surface-500"
                animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Key Points */}
      {hasPoints && (
        <section className="rounded-2xl border border-surface-300 bg-surface-100/50 p-6">
          <h3 className="text-[11px] font-bold text-surface-900 uppercase tracking-[0.15em] font-display mb-4">Key Points</h3>
          <div className="space-y-3">
            {summary.bulletPoints.map((point, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: streaming ? 0 : i * 0.07 }} className="flex items-start gap-3">
                <ArrowRight size={14} className="shrink-0 mt-1 text-surface-500" />
                <p className="text-[14px] text-surface-800 leading-relaxed">
                  {point}
                  {cursorInPoints && i === summary.bulletPoints.length - 1 && <StreamCursor />}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Key Concepts */}
      {hasConcepts && (
        <section>
          <h3 className="text-[11px] font-bold text-surface-900 uppercase tracking-[0.15em] font-display mb-4">Key Concepts</h3>
          <div className="flex flex-wrap gap-2">
            {summary.keyConcepts.map((concept, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: streaming ? 0 : 0.3 + i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                className="px-4 py-2 rounded-xl border border-surface-300 bg-surface-100/50 text-[13px] text-surface-800 font-semibold"
              >
                {concept}
                {cursorInConcepts && !cursorInConnections && i === summary.keyConcepts.length - 1 && <StreamCursor />}
              </motion.span>
            ))}
          </div>
        </section>
      )}

      {/* Connections */}
      {hasConnections && (
        <section>
          <h3 className="text-[11px] font-bold text-surface-900 uppercase tracking-[0.15em] font-display mb-4">Connections</h3>
          <div className="space-y-2.5">
            {summary.connections.map((conn, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: streaming ? 0 : 0.5 + i * 0.08 }}
                className="p-4 rounded-2xl border-l-2 border-l-surface-400 border border-surface-300 bg-surface-100/50 text-[13px] text-surface-800 leading-relaxed"
              >
                {conn}
                {cursorInConnections && i === summary.connections.length - 1 && <StreamCursor />}
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
