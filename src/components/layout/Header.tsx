import { Settings } from 'lucide-react'
import { motion } from 'motion/react'

interface HeaderProps {
  onOpenSettings: () => void
}

export function Header({ onOpenSettings }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center justify-between px-4 sm:px-8 pt-8 pb-6"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-3 h-3 rounded-full bg-ember"
            style={{ animation: 'pulse-glow 3s ease-in-out infinite', boxShadow: '0 0 12px rgba(255,138,0,0.4)' }}
          />
          <div className="w-3 h-3 rounded-full bg-ember" />
        </div>
        <h1 className="font-display text-[22px] sm:text-[26px] font-bold tracking-tight text-white">
          study buddy<span className="text-ember">.</span>
        </h1>
      </div>
      <button
        onClick={onOpenSettings}
        className="group p-2.5 rounded-xl border border-void-700 hover:border-void-500 bg-void-900/50 hover:bg-void-800 transition-all duration-200"
        aria-label="Settings"
      >
        <Settings size={18} className="text-void-400 group-hover:text-void-200 transition-colors" />
      </button>
    </motion.header>
  )
}
