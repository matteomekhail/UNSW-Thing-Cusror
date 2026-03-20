import { ArrowUp, Loader2 } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  disabled?: boolean
  placeholder?: string
  controls?: React.ReactNode
}

export function ChatInput({ value, onChange, onSubmit, loading, disabled, placeholder, controls }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (!disabled && !loading && value.trim()) onSubmit()
    }
  }

  return (
    <div className="shrink-0 border-t border-surface-300 bg-surface-0 w-full">
      <div className="px-5 sm:px-8 lg:px-10 py-4 pb-5 md:pb-4">
        {controls && <div className="mb-3">{controls}</div>}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Paste your notes here...'}
            rows={4}
            className="w-full resize-none rounded-xl bg-surface-100 border border-surface-300 px-4 py-3 pr-14 text-[14px] leading-relaxed text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-surface-500 transition-all duration-200 font-body"
          />
          <button
            onClick={onSubmit}
            disabled={loading || disabled || !value.trim()}
            className="absolute right-3 bottom-3 w-10 h-10 rounded-lg bg-surface-900 text-surface-0 flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={18} />}
          </button>
        </div>
        <p className="text-[10px] text-surface-500 mt-1.5 text-right font-mono tracking-wider">⌘+enter to send</p>
      </div>
    </div>
  )
}
