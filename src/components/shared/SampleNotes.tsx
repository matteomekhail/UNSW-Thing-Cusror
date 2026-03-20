import { motion } from 'motion/react'

interface SampleNotesProps {
  onSelect: (text: string) => void
}

const samples = [
  {
    emoji: '🧬',
    label: 'biology',
    text: `Photosynthesis is the process by which green plants convert light energy into chemical energy. It occurs in the chloroplasts, specifically using chlorophyll. The process has two stages: light-dependent reactions (in thylakoid membranes) and the Calvin cycle (in the stroma). Water is split into oxygen and hydrogen. CO2 is fixed into glucose through carbon fixation. The overall equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2. Factors affecting rate: light intensity, CO2 concentration, temperature. Photosystem I and II work together in the light reactions. ATP and NADPH are produced and used in the Calvin cycle.`,
  },
  {
    emoji: '💻',
    label: 'computer science',
    text: `A binary search tree (BST) is a data structure where each node has at most two children. The left subtree contains only nodes with keys less than the parent. The right subtree contains only nodes with keys greater than the parent. Search, insert, and delete operations have O(log n) average time complexity. In the worst case (unbalanced tree), operations degrade to O(n). Balanced BSTs like AVL trees and Red-Black trees maintain O(log n) guarantees. In-order traversal of a BST produces sorted output. BSTs are used in databases, file systems, and symbol tables.`,
  },
  {
    emoji: '🏛️',
    label: 'history',
    text: `The French Revolution (1789-1799) was a period of radical political and societal change in France. Key causes: financial crisis, social inequality under the Estates system, Enlightenment ideas. Major events: Storming of the Bastille (July 14, 1789), Declaration of the Rights of Man, Reign of Terror under Robespierre, rise of Napoleon Bonaparte. The revolution abolished feudalism and the monarchy, established a republic, and introduced principles of citizenship and rights. It influenced democratic movements worldwide and led to the Napoleonic Wars.`,
  },
]

export function SampleNotes({ onSelect }: SampleNotesProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <p className="text-[11px] font-modern text-surface-500 uppercase tracking-[0.12em] mb-3">
        or try with sample notes
      </p>
      <div className="flex flex-wrap gap-2">
        {samples.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.text)}
            className="flex items-center gap-2 px-4 py-2.5 border border-surface-300 text-[13px] font-modern tracking-[0.04em] lowercase text-surface-700 hover:bg-surface-100 hover:text-surface-900 transition-all duration-200"
          >
            <span className="text-base">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
