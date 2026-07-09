import type { ScooterDetailDto } from '../types/api'
import {
  formatDrivingStatus,
  formatMaintenanceMode,
  formatUsageStatus,
} from '../utils/scooterDisplay'

type FleetTableProps = {
  scooters: ScooterDetailDto[]
  loading?: boolean
  hasLoaded?: boolean
  selectedId?: number | null
  onSelect?: (scooter: ScooterDetailDto) => void
  emptyMessage?: string
}

export function FleetTable({
  scooters,
  loading = false,
  hasLoaded = false,
  selectedId = null,
  onSelect,
  emptyMessage = 'Keine Scooter vorhanden.',
}: FleetTableProps) {
  if (!hasLoaded && loading) {
    return <p className="mt-4 text-sm text-text">Flotte wird geladen …</p>
  }

  if (scooters.length === 0) {
    return (
      <p className="mt-4 text-sm text-text">
        {hasLoaded ? emptyMessage : 'Flotte noch nicht geladen.'}
      </p>
    )
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-text-heading">ID</th>
            <th className="px-4 py-3 text-left font-medium text-text-heading">Scooter</th>
            <th className="px-4 py-3 text-left font-medium text-text-heading">Akku</th>
            <th className="px-4 py-3 text-left font-medium text-text-heading">Status</th>
            <th className="px-4 py-3 text-left font-medium text-text-heading">Wartung</th>
            <th className="px-4 py-3 text-left font-medium text-text-heading">Fahrt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {scooters.map((scooter) => {
            const selected = selectedId === scooter.id
            return (
              <tr
                key={scooter.id}
                className={`transition ${onSelect ? 'cursor-pointer hover:bg-brand-50' : ''} ${
                  selected ? 'bg-brand-50' : ''
                }`}
                onClick={() => onSelect?.(scooter)}
              >
                <td className="px-4 py-3 font-medium text-text-heading">{scooter.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-text-heading">
                    {scooter.brand} {scooter.model}
                  </div>
                  <div className="text-xs text-slate-500">
                    {scooter.batteryWh.toFixed(0)} / {scooter.capacityWh.toFixed(0)} Wh
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      scooter.batteryPercent <= 50
                        ? 'font-medium text-amber-700'
                        : 'text-text'
                    }
                  >
                    {scooter.batteryPercent.toFixed(0)} %
                  </span>
                </td>
                <td className="px-4 py-3 text-text">
                  {formatUsageStatus(scooter.usageStatus)}
                </td>
                <td className="px-4 py-3 text-text">
                  {formatMaintenanceMode(scooter.maintenanceMode)}
                </td>
                <td className="px-4 py-3 text-text">
                  {formatDrivingStatus(scooter.drivingStatus)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
