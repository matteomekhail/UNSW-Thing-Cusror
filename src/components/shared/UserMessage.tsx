import { motion } from 'motion/react'

interface UserMessageProps {
  text: string
}

export function UserMessage({ text }: UserMessageProps) {
  const preview = text.length > 800 ? text.slice(0, 800) + '…' : text

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] sm:max-w-[70%] border border-surface-300 bg-surface-100 px-5 py-3 text-[13px] text-surface-800 leading-relaxed font-body">
        {preview}
      </div>
    </motion.div>
  )
}
