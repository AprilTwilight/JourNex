import { useMemo, useState } from 'react'
import { api, DEFAULT_LAT, DEFAULT_LNG } from '../api/client'
import type { AddScooterRequest } from '../types/api'
import { ApiErrorPanel } from '../components/ApiErrorPanel'
import { FleetTable } from '../components/FleetTable'
import { FleetToolbar } from '../components/FleetToolbar'
import { GpsFields } from '../components/GpsFields'
import { Layout } from '../components/Layout'
import { ScooterDetailCard } from '../components/ScooterDetailCard'
import { SidePanel } from '../components/SidePanel'
import { useFleet } from '../hooks/useFleet'
import { friendlyApiError, formatMaintenanceMode } from '../utils/scooterDisplay'
import {
  btnDanger,
  btnPrimary,
  btnSecondary,
  inputClass,
  panelClass,
} from '../styles/ui'

const defaultNewScooter: AddScooterRequest = {
  brand: 'Test',
  model: 'Demo',
  consumptionCoefficient: 12,
  location: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG },
  capacityWh: 500,
  initialBatteryWh: 400,
}

function toggleSelection(currentId: number | null, scooterId: number): number | null {
  return currentId === scooterId ? null : scooterId
}

export function ServicePage() {
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
    refreshFleet,
    run,
  } = useFleet('service')

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [newScooter, setNewScooter] = useState(defaultNewScooter)
  const [lat, setLat] = useState(String(DEFAULT_LAT))
  const [lng, setLng] = useState(String(DEFAULT_LNG))
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const selected = useMemo(
    () => scooters.find((scooter) => scooter.id === selectedId) ?? null,
    [scooters, selectedId],
  )

  const runAndReload = async (
    label: string,
    action: () => Promise<unknown>,
    success?: string,
  ) => {
    setSuccessMessage(null)
    const result = await run(label, action)
    if (result != null) {
      await refreshFleet()
      if (success) setSuccessMessage(success)
    }
    return result
  }

  const startMaintenance = () => {
    if (selected == null) return
    runAndReload(
      'maintenance-start',
      () => api.service.startMaintenance(selected.id),
      'Wartungsmodus wurde gestartet.',
    )
  }

  const endMaintenance = () => {
    if (selected == null) return
    runAndReload(
      'maintenance-end',
      () => api.service.endMaintenance(selected.id),
      'Wartungsmodus wurde beendet.',
    )
  }

  const retire = () => {
    if (selected == null) return
    runAndReload(
      'retire',
      () => api.service.retire(selected.id),
      'Scooter wurde aus der Flotte entfernt.',
    ).then(() => setSelectedId(null))
  }

  const addScooter = () =>
    runAndReload('add-scooter', async () => {
      const body: AddScooterRequest = {
        ...newScooter,
        location: { latitude: Number(lat), longitude: Number(lng) },
      }
      return api.service.addScooter(body)
    }, 'Neuer Scooter wurde aufgenommen.')

  const displayError = error ? friendlyApiError(error) : null

  return (
    <Layout
      role="Service"
      title="Service & Wartung"
      subtitle="Flotte pflegen, Wartung steuern und Scooter verwalten."
    >
      {displayError && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {displayError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {successMessage}
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
        subtitle={
          selected
            ? `#${selected.id} · ${formatMaintenanceMode(selected.maintenanceMode)}`
            : undefined
        }
      >
        {selected && (
          <div className="flex flex-col gap-6">
            <ScooterDetailCard scooter={selected} embedded />
            <div className="border-t border-border pt-5">
              <h3 className="text-sm font-semibold text-text-heading">
                Wartung & Ausmusterung
              </h3>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={startMaintenance}
                  disabled={loading || selected.maintenanceMode === 'InWartung'}
                  title={
                    selected.maintenanceMode === 'InWartung'
                      ? 'Scooter ist bereits in Wartung'
                      : undefined
                  }
                >
                  Wartung starten
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={endMaintenance}
                  disabled={loading || selected.maintenanceMode === 'NichtInWartung'}
                  title={
                    selected.maintenanceMode === 'NichtInWartung'
                      ? 'Scooter ist bereits betriebsbereit'
                      : undefined
                  }
                >
                  Wartung beenden
                </button>
                <button
                  type="button"
                  className={btnDanger}
                  onClick={retire}
                  disabled={loading}
                >
                  Ausmustern
                </button>
              </div>
            </div>
          </div>
        )}
      </SidePanel>

      <section className={panelClass}>
        <h2 className="text-lg font-semibold text-text-heading">
          Neuen Scooter aufnehmen
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-text">
            Marke
            <input
              className={inputClass}
              value={newScooter.brand}
              onChange={(e) =>
                setNewScooter({ ...newScooter, brand: e.target.value })
              }
            />
          </label>
          <label className="text-sm font-medium text-text">
            Modell
            <input
              className={inputClass}
              value={newScooter.model}
              onChange={(e) =>
                setNewScooter({ ...newScooter, model: e.target.value })
              }
            />
          </label>
          <label className="text-sm font-medium text-text">
            Verbrauchskoeffizient
            <input
              className={inputClass}
              value={newScooter.consumptionCoefficient}
              onChange={(e) =>
                setNewScooter({
                  ...newScooter,
                  consumptionCoefficient: Number(e.target.value),
                })
              }
              type="number"
              step="0.1"
            />
          </label>
          <label className="text-sm font-medium text-text">
            Kapazität (Wh)
            <input
              className={inputClass}
              value={newScooter.capacityWh}
              onChange={(e) =>
                setNewScooter({
                  ...newScooter,
                  capacityWh: Number(e.target.value),
                })
              }
              type="number"
            />
          </label>
          <label className="text-sm font-medium text-text">
            Start-Akku (Wh)
            <input
              className={inputClass}
              value={newScooter.initialBatteryWh}
              onChange={(e) =>
                setNewScooter({
                  ...newScooter,
                  initialBatteryWh: Number(e.target.value),
                })
              }
              type="number"
            />
          </label>
        </div>
        <div className="mt-4">
          <GpsFields
            lat={lat}
            lng={lng}
            onLatChange={setLat}
            onLngChange={setLng}
            label="Standort des neuen Scooters"
          />
        </div>
        <button
          type="button"
          className={`${btnPrimary} mt-4`}
          onClick={addScooter}
          disabled={loading}
        >
          Scooter anlegen
        </button>
      </section>

      {error && lastResult != null && (
        <ApiErrorPanel error={error} details={lastResult} />
      )}
    </Layout>
  )
}
