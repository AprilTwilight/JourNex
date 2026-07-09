import type { ScooterDetailDto } from '../types/api'
import {
  formatDrivingStatus,
  formatMaintenanceMode,
  formatUsageStatus,
} from '../utils/scooterDisplay'
import { panelClass } from '../styles/ui'

type ScooterDetailCardProps = {
  scooter: ScooterDetailDto
  embedded?: boolean
}

export function ScooterDetailCard({ scooter, embedded = false }: ScooterDetailCardProps) {
  const content = (
    <>
      {!embedded && (
        <>
          <h2 className="text-lg font-semibold text-text-heading">
            {scooter.brand} {scooter.model}
          </h2>
          <p className="mt-1 text-sm text-text">Scooter #{scooter.id}</p>
        </>
      )}
      <dl className={`grid gap-3 sm:grid-cols-2 ${embedded ? '' : 'mt-5'}`}>
        <DetailItem label="Akku" value={`${scooter.batteryPercent.toFixed(0)} %`} />
        <DetailItem
          label="Ladung"
          value={`${scooter.batteryWh.toFixed(0)} / ${scooter.capacityWh.toFixed(0)} Wh`}
        />
        <DetailItem label="Reichweite" value={`ca. ${scooter.estimatedRemainingKm.toFixed(0)} km`} />
        <DetailItem
          label="Verbrauch"
          value={`${scooter.consumptionCoefficient.toFixed(1)} Wh/km`}
        />
        <DetailItem label="Nutzung" value={formatUsageStatus(scooter.usageStatus)} />
        <DetailItem label="Wartung" value={formatMaintenanceMode(scooter.maintenanceMode)} />
        <DetailItem label="Fahrt" value={formatDrivingStatus(scooter.drivingStatus)} />
        <DetailItem
          label="Standort"
          value={`${scooter.location.latitude.toFixed(4)}, ${scooter.location.longitude.toFixed(4)}`}
        />
      </dl>
    </>
  )

  if (embedded) {
    return content
  }

  return <section className={panelClass}>{content}</section>
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-muted px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-text-heading">{value}</dd>
    </div>
  )
}
