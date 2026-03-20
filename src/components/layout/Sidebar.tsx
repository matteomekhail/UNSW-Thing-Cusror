import { NavLink } from 'react-router'
import { Layers, HelpCircle, FileText, Sun, Moon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Theme } from '../../types'

const links = [
  { to: '/', label: 'flashcards', icon: Layers },
  { to: '/quiz', label: 'quiz', icon: HelpCircle },
  { to: '/summary', label: 'summary', icon: FileText },
] as const

interface SidebarProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Sidebar({ theme, onToggleTheme }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 h-dvh w-[220px] border-r border-surface-200 bg-surface-0 flex flex-col z-20 max-md:hidden"
    >
      <div className="px-6 pt-8 pb-12">
        <h1 className="font-display text-[22px] font-extrabold text-surface-900 lowercase">
          study buddy
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-2.5 text-[14px] font-modern tracking-[0.06em] lowercase transition-all duration-200 ${
                isActive ? 'text-surface-900' : 'text-surface-500 hover:text-surface-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-line"
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-surface-900"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}
                <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-modern tracking-[0.06em] lowercase text-surface-500 hover:text-surface-700 transition-all duration-200"
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          <span>{theme === 'dark' ? 'light mode' : 'dark mode'}</span>
        </button>
      </div>
    </motion.aside>
  )
}
