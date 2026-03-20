import type { AISettings } from '../types'

const SETTINGS: AISettings = {
  apiUrl: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY ?? '',
  model: import.meta.env.VITE_OPENROUTER_MODEL ?? 'google/gemini-2.0-flash-exp:free',
}

export function useSettings(): AISettings {
  return SETTINGS
}
