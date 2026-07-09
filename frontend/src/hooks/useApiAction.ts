import { useCallback, useState } from 'react'

export function useApiAction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState('')
  const [lastResult, setLastResult] = useState<unknown>(null)

  const run = useCallback(async (label: string, action: () => Promise<unknown>) => {
    setLoading(true)
    setError(null)
    setLastAction(label)
    try {
      const result = await action()
      setLastResult(result)
      return result
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unbekannter Fehler'
      setError(message)
      setLastResult({ error: message })
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, lastAction, lastResult, run }
}
