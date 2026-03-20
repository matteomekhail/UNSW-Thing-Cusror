import { useState } from 'react'
import { motion } from 'motion/react'
import { Copy, Check, ArrowRight } from 'lucide-react'
import type { Summary } from '../../types'

interface SummaryDisplayProps {
  summary: Summary
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
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

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[12px] text-surface-600 hover:text-sky transition-colors">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy all'}
        </button>
      </div>

      {/* Key Points */}
      <section className="rounded-2xl border border-sky/15 bg-sky-soft p-6">
        <h3 className="text-[11px] font-bold text-sky uppercase tracking-[0.15em] font-display mb-4">Key Points</h3>
        <div className="space-y-3">
          {summary.bulletPoints.map((point, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-start gap-3">
              <ArrowRight size={14} className="shrink-0 mt-1 text-sky/60" />
              <p className="text-[14px] text-surface-800 leading-relaxed">{point}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Concepts */}
      <section>
        <h3 className="text-[11px] font-bold text-violet uppercase tracking-[0.15em] font-display mb-4">Key Concepts</h3>
        <div className="flex flex-wrap gap-2">
          {summary.keyConcepts.map((concept, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              className="px-4 py-2 rounded-xl border border-violet/20 bg-violet-soft text-[13px] text-violet font-semibold"
            >
              {concept}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Connections */}
      <section>
        <h3 className="text-[11px] font-bold text-teal uppercase tracking-[0.15em] font-display mb-4">Connections</h3>
        <div className="space-y-2.5">
          {summary.connections.map((conn, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="p-4 rounded-2xl border-l-2 border-l-teal/40 border border-teal/10 bg-teal-soft text-[13px] text-surface-800 leading-relaxed"
            >
              {conn}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
