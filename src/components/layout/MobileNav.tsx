import { NavLink } from 'react-router'
import { Layers, HelpCircle, FileText, Sun, Moon } from 'lucide-react'
import type { Theme } from '../../types'

const links = [
  { to: '/', label: 'Cards', icon: Layers, activeColor: 'text-violet' },
  { to: '/quiz', label: 'Quiz', icon: HelpCircle, activeColor: 'text-rose' },
  { to: '/summary', label: 'Summary', icon: FileText, activeColor: 'text-sky' },
] as const

interface MobileNavProps {
  theme: Theme
  onToggleTheme: () => void
}

export function MobileNav({ theme, onToggleTheme }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-surface-200 bg-surface-50/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {links.map(({ to, label, icon: Icon, activeColor }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? activeColor : 'text-surface-500'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          onClick={onToggleTheme}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-surface-500"
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
          <span>Theme</span>
        </button>
      </div>
    </nav>
  )
}
