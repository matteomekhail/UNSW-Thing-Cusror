interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
}

export function TextInput({ value, onChange, placeholder, maxLength = 10000 }: TextInputProps) {
  return (
    <div className="relative group">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Paste your notes here...'}
        maxLength={maxLength}
        rows={7}
        className="w-full resize-none rounded-2xl bg-surface-100 border border-surface-300 px-5 py-4 text-[14px] leading-relaxed text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-violet/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all duration-300"
      />
      <div className="absolute bottom-3.5 right-4">
        <span className="text-[11px] text-surface-500 tabular-nums">
          {value.length.toLocaleString()}<span className="text-surface-400"> / {maxLength.toLocaleString()}</span>
        </span>
      </div>
    </div>
  )
}
