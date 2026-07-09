import { btnPrimary, btnSecondary } from '../styles/ui'

type FleetToolbarProps = {
  count: number
  totalCount: number
  lowBatteryOnly: boolean
  onToggleLowBattery: () => void
  onRefresh: () => void
  loading?: boolean
}

export function FleetToolbar({
  count,
  totalCount,
  lowBatteryOnly,
  onToggleLowBattery,
  onRefresh,
  loading = false,
}: FleetToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm text-text">
          {lowBatteryOnly
            ? `${count} von ${totalCount} Scootern mit Akku ≤ 50 %`
            : `${totalCount} Scooter in der Flotte`}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={
            lowBatteryOnly
              ? 'rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 shadow-sm ring-1 ring-amber-300'
              : btnSecondary
          }
          onClick={onToggleLowBattery}
          disabled={loading}
        >
          Akku ≤ 50 %
        </button>
        <button
          type="button"
          className={btnPrimary}
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? 'Lädt …' : 'Aktualisieren'}
        </button>
      </div>
    </div>
  )
}
