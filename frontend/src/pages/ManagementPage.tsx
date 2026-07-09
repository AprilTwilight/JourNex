import { useMemo, useState } from 'react'
import { ApiErrorPanel } from '../components/ApiErrorPanel'
import { FleetTable } from '../components/FleetTable'
import { FleetToolbar } from '../components/FleetToolbar'
import { Layout } from '../components/Layout'
import { ScooterDetailCard } from '../components/ScooterDetailCard'
import { SidePanel } from '../components/SidePanel'
import { useFleet } from '../hooks/useFleet'
import { friendlyApiError } from '../utils/scooterDisplay'
import { panelClass } from '../styles/ui'

function toggleSelection(currentId: number | null, scooterId: number): number | null {
  return currentId === scooterId ? null : scooterId
}

export function ManagementPage() {
  const {
    scooters,
    visibleScooters,
    lowBatteryOnly,
    setLowBatteryOnly,
    hasLoaded,
    loading,
    error,
    lastResult,
    reload,
  } = useFleet('management')

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = useMemo(
    () => scooters.find((scooter) => scooter.id === selectedId) ?? null,
    [scooters, selectedId],
  )

  const displayError = error ? friendlyApiError(error) : null

  return (
    <Layout
      role="Flottenmanager"
      title="Flottenübersicht"
      subtitle="Alle E-Scooter der Flotte im Überblick."
    >
      {displayError && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {displayError}
        </div>
      )}

      <section className={panelClass}>
        <h2 className="text-lg font-semibold text-text-heading">Flotte</h2>
        <div className="mt-4">
          <FleetToolbar
            count={visibleScooters.length}
            totalCount={scooters.length}
            lowBatteryOnly={lowBatteryOnly}
            onToggleLowBattery={() => setLowBatteryOnly((value) => !value)}
            onRefresh={reload}
            loading={loading}
          />
        </div>
        <FleetTable
          scooters={visibleScooters}
          loading={loading}
          hasLoaded={hasLoaded}
          selectedId={selectedId}
          onSelect={(scooter) =>
            setSelectedId((current) => toggleSelection(current, scooter.id))
          }
          emptyMessage={
            lowBatteryOnly
              ? 'Keine Scooter mit Akku ≤ 50 % gefunden.'
              : 'Keine Scooter in der Flotte.'
          }
        />
      </section>

      <SidePanel
        open={selected != null}
        onClose={() => setSelectedId(null)}
        title={selected ? `${selected.brand} ${selected.model}` : ''}
        subtitle={selected ? `Scooter #${selected.id}` : undefined}
      >
        {selected && <ScooterDetailCard scooter={selected} embedded />}
      </SidePanel>

      {error && lastResult != null && (
        <ApiErrorPanel error={error} details={lastResult} />
      )}
    </Layout>
  )
}
