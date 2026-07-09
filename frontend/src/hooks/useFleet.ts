import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api/client'
import type { ScooterDetailDto } from '../types/api'
import { useApiAction } from './useApiAction'

export type FleetSource = 'management' | 'service'

export function useFleet(source: FleetSource) {
  const { loading, error, lastResult, run } = useApiAction()
  const [scooters, setScooters] = useState<ScooterDetailDto[]>([])
  const [lowBatteryOnly, setLowBatteryOnly] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const hasInitialized = useRef(false)

  const fetchFleet = useCallback(async () => {
    const list =
      source === 'management'
        ? await api.management.getAll()
        : await api.service.getAll()
    setScooters(list)
    setHasLoaded(true)
    return list
  }, [source])

  const refreshFleet = useCallback(async () => {
    await fetchFleet()
  }, [fetchFleet])

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    run('fleet', fetchFleet)
  }, [fetchFleet, run])

  const visibleScooters = useMemo(
    () =>
      lowBatteryOnly
        ? scooters.filter((scooter) => scooter.batteryPercent <= 50)
        : scooters,
    [scooters, lowBatteryOnly],
  )

  return {
    scooters,
    visibleScooters,
    lowBatteryOnly,
    setLowBatteryOnly,
    hasLoaded,
    loading,
    error,
    lastResult,
    reload: () => run('fleet', fetchFleet),
    refreshFleet,
    run,
  }
}
