import { ArrowRight, Loader2 } from 'lucide-react'

interface GenerateButtonProps {
  onClick: () => void
  loading: boolean
  disabled?: boolean
  label?: string
}

export function GenerateButton({ onClick, loading, disabled, label = 'Generate' }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="group flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-none border-2 border-surface-900 bg-transparent text-surface-900 font-modern text-[14px] tracking-[0.08em] lowercase transition-all duration-200 hover:bg-surface-900 hover:text-surface-0 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>generating...</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  )
}
