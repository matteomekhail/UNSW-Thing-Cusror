import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { AISettings } from '../../types'
import { testConnection } from '../../lib/ai'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  settings: AISettings
  onSave: (settings: AISettings) => void
}

export function SettingsModal({ open, onClose, settings, onSave }: SettingsModalProps) {
  const [draft, setDraft] = useState<AISettings>(settings)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<boolean | null>(null)

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const ok = await testConnection(draft)
      setTestResult(ok)
    } catch {
      setTestResult(false)
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    onSave(draft)
    onClose()
  }

  const inputCls =
    'w-full rounded-xl bg-surface-0 border border-surface-300 px-4 py-3 text-[14px] text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-accent/40 transition-all duration-200'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[440px] rounded-3xl bg-surface-100 border border-surface-300 p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-display font-bold text-[18px] text-surface-950">Settings</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-surface-500 hover:text-surface-800 hover:bg-surface-200 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              <Field label="API Base URL">
                <input type="url" value={draft.apiUrl} onChange={(e) => setDraft({ ...draft, apiUrl: e.target.value })} placeholder="https://openrouter.ai/api/v1" className={inputCls} />
              </Field>
              <Field label="API Key">
                <input type="password" value={draft.apiKey} onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })} placeholder="sk-or-..." className={inputCls} />
              </Field>
              <Field label="Model">
                <input type="text" value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} placeholder="google/gemini-2.0-flash-exp:free" className={inputCls} />
              </Field>

              <button onClick={handleTest} disabled={testing || !draft.apiUrl || !draft.apiKey} className="flex items-center gap-2 text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {testing ? <Loader2 size={14} className="animate-spin text-surface-500" /> : <div className={`w-2 h-2 rounded-full ${testResult === true ? 'bg-ok' : testResult === false ? 'bg-fail' : 'bg-surface-400'}`} />}
                <span className={testResult === true ? 'text-ok' : testResult === false ? 'text-fail' : 'text-surface-500 hover:text-surface-700'}>
                  {testing ? 'Testing...' : testResult === true ? 'Connected' : testResult === false ? 'Failed' : 'Test Connection'}
                </span>
              </button>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-surface-300 text-surface-600 text-[13px] font-medium hover:bg-surface-200 transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-accent text-surface-0 text-[13px] font-bold hover:brightness-110 transition-all font-display">Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium text-surface-500 mb-2 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  )
}
