import { useState, useCallback } from 'react'
import type { AISettings } from '../types'
import { chatCompletion } from '../lib/ai'
import { parseJSON } from '../lib/parseResponse'

interface UseAIReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  generate: (systemPrompt: string, userContent: string) => Promise<T | null>
  reset: () => void
}

export function useAI<T>(settings: AISettings): UseAIReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(
    async (systemPrompt: string, userContent: string): Promise<T | null> => {
      if (!settings.apiKey) {
        setError('Please configure your API key in Settings.')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const raw = await chatCompletion(settings, [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ])

        const parsed = parseJSON<T>(raw)
        setData(parsed)
        return parsed
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [settings],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { data, loading, error, generate, reset }
}
