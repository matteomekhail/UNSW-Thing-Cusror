import { useState, useCallback } from 'react'
import { getItem, setItem } from '../lib/storage'

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => getItem(key, fallback))

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === 'function' ? (v as (prev: T) => T)(prev) : v
        setItem(key, next)
        return next
      })
    },
    [key],
  )

  return [value, set] as const
}
