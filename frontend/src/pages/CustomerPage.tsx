import { useCallback, useEffect, useRef, useState } from 'react'
import {
  api,
  DEFAULT_LAT,
  DEFAULT_LNG,
} from '../api/client'
import type { ScooterDto, TourSummaryDto } from '../types/api'
import { Layout } from '../components/Layout'
import { useAuth } from '../auth/useAuth'
import { useApiAction } from '../hooks/useApiAction'
import { btnPrimary, btnSecondary, cardClass, panelClass } from '../styles/ui'

type Phase = 'browse' | 'reserved' | 'riding' | 'finished'

function friendlyError(message: string): string {
  if (message.includes('TOO_FAR_FROM_SCOOTER')) {
    return 'Du bist noch zu weit vom Scooter entfernt. Geh bitte näher an den Scooter heran.'
  }
  if (message.includes('ALREADY_IN_USE')) {
    return 'Dieser Scooter ist leider schon vergeben.'
  }
  if (message.includes('IN_MAINTENANCE')) {
    return 'Dieser Scooter ist derzeit in Wartung und nicht verfügbar.'
  }
  if (message.includes('RESERVATION_NOT_FOUND')) {
    return 'Deine Reservierung ist abgelaufen. Bitte wähle erneut einen Scooter.'
  }
  if (message.includes('REQUEST_FAILED') || message.includes('Failed to fetch')) {
    return 'Verbindung zum Server fehlgeschlagen. Bitte prüfe deine Internetverbindung und versuche es erneut.'
  }
  return 'Das hat leider nicht geklappt. Bitte versuche es erneut.'
}

function formatRange(km: number, minutes: number): string {
  return `Reichweite ca. ${km.toFixed(0)} km · ${Math.round(minutes)} Min.`
}

export function CustomerPage() {
  const { user } = useAuth()
  const { loading, error, run } = useApiAction()
  const [lat, setLat] = useState(DEFAULT_LAT)
  const [lng, setLng] = useState(DEFAULT_LNG)
  const [locationLabel, setLocationLabel] = useState('Standort wird ermittelt …')
  const [scooters, setScooters] = useState<ScooterDto[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [phase, setPhase] = useState<Phase>('browse')
  const [selectedScooter, setSelectedScooter] = useState<ScooterDto | null>(null)
  const [reservationId, setReservationId] = useState('')
  const [tourId, setTourId] = useState('')
  const [summary, setSummary] = useState<TourSummaryDto | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const hasInitialized = useRef(false)

  const resolveLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    if (!navigator.geolocation) {
      setLocationLabel('Demo-Standort Seelze')
      setLat(DEFAULT_LAT)
      setLng(DEFAULT_LNG)
      return Promise.resolve({ lat: DEFAULT_LAT, lng: DEFAULT_LNG })
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }
          setLat(coords.lat)
          setLng(coords.lng)
          setLocationLabel('Dein aktueller Standort')
          resolve(coords)
        },
        () => {
          setLat(DEFAULT_LAT)
          setLng(DEFAULT_LNG)
          setLocationLabel('Demo-Standort Seelze')
          resolve({ lat: DEFAULT_LAT, lng: DEFAULT_LNG })
        },
        { timeout: 8000 },
      )
    })
  }, [])

  const searchNearby = useCallback(
    async (coords?: { lat: number; lng: number }) => {
      const searchLat = coords?.lat ?? lat
      const searchLng = coords?.lng ?? lng
      setSuccessMessage(null)
      await run('search', async () => {
        const list = await api.scooters.getNearby(searchLat, searchLng)
        setScooters(list)
        setHasSearched(true)
        return list
      })
    },
    [lat, lng, run],
  )

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    resolveLocation().then((coords) => searchNearby(coords))
  }, [resolveLocation, searchNearby])

  const handleReserve = (scooter: ScooterDto) =>
    run('reserve', async () => {
      setSuccessMessage(null)
      const res = await api.scooters.reserve(scooter.id, {
        customerId: user?.id,
      })
      setReservationId(res.reservationId)
      setSelectedScooter(scooter)
      setPhase('reserved')
      setSuccessMessage(
        `${scooter.brand} ${scooter.model} ist reserviert (15 Min.). Geh zum Scooter und starte deine Fahrt.`,
      )
      return res
    })

  const handleStartTour = () =>
    run('start', async () => {
      setSuccessMessage(null)
      const res = await api.tours.start({
        reservationId,
        latitude: lat,
        longitude: lng,
      })
      setTourId(res.tourId)
      setPhase('riding')
      setSuccessMessage('Gute Fahrt! Deine Tour läuft.')
      return res
    })

  const handleEndTour = () =>
    run('end', async () => {
      setSuccessMessage(null)
      const result = await api.tours.end({ tourId })
      setSummary(result)
      setPhase('finished')
      return result
    })

  const handleNewRide = async () => {
    if (reservationId) {
      await api.reservations.cancel(reservationId).catch(() => undefined)
    }
    setPhase('browse')
    setSelectedScooter(null)
    setReservationId('')
    setTourId('')
    setSummary(null)
    setSuccessMessage(null)
    searchNearby()
  }

  const displayError = error ? friendlyError(error) : null

  return (
    <Layout
      role="Kunde"
      title="Scooter in deiner Nähe"
      subtitle="Finde einen freien Scooter, reserviere ihn und starte deine Fahrt."
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

      {phase === 'browse' && (
        <section className={panelClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text-heading">
                Verfügbare Scooter
              </h2>
              <p className="mt-1 text-sm text-text">{locationLabel}</p>
            </div>
            <button
              type="button"
              className={btnSecondary}
              onClick={async () => {
                const coords = await resolveLocation()
                await searchNearby(coords)
              }}
              disabled={loading}
            >
              {loading ? 'Suche …' : 'Erneut suchen'}
            </button>
          </div>

          {!hasSearched && loading ? (
            <p className="mt-6 text-sm text-text">Scooter werden gesucht …</p>
          ) : scooters.length === 0 ? (
            <p className="mt-6 text-sm text-text">
              Aktuell sind keine Scooter in deiner Nähe verfügbar. Versuche es
              später erneut oder aktualisiere deinen Standort.
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-3">
              {scooters.map((scooter) => (
                <li key={scooter.id} className={cardClass}>
                  <div className="flex flex-col gap-1.5">
                    <strong className="text-base text-text-heading">
                      {scooter.brand} {scooter.model}
                    </strong>
                    <span className="text-sm text-text">
                      Akku {scooter.batteryPercent.toFixed(0)}% ·{' '}
                      {formatRange(
                        scooter.estimatedRemainingKm,
                        scooter.estimatedRemainingMinutes,
                      )}
                    </span>
                    {scooter.distanceToUser != null && (
                      <span className="text-xs text-slate-500">
                        In deiner Nähe
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => handleReserve(scooter)}
                    disabled={loading}
                  >
                    Reservieren
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {phase === 'reserved' && selectedScooter && (
        <section className={panelClass}>
          <h2 className="text-lg font-semibold text-text-heading">
            Dein reservierter Scooter
          </h2>
          <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
            <p className="text-lg font-semibold text-text-heading">
              {selectedScooter.brand} {selectedScooter.model}
            </p>
            <p className="mt-2 text-sm text-text">
              Akku {selectedScooter.batteryPercent.toFixed(0)}% ·{' '}
              {formatRange(
                selectedScooter.estimatedRemainingKm,
                selectedScooter.estimatedRemainingMinutes,
              )}
            </p>
          </div>
          <p className="mt-4 text-sm text-text">
            Geh zum Scooter und starte die Fahrt, wenn du vor Ort bist. Die
            Reservierung läuft nach 15 Minuten automatisch ab.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={btnPrimary}
              onClick={handleStartTour}
              disabled={loading}
            >
              Fahrt starten
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={handleNewRide}
              disabled={loading}
            >
              Andere Auswahl
            </button>
          </div>
        </section>
      )}

      {phase === 'riding' && selectedScooter && (
        <section className={panelClass}>
          <h2 className="text-lg font-semibold text-text-heading">
            Fahrt läuft
          </h2>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-lg font-semibold text-text-heading">
              {selectedScooter.brand} {selectedScooter.model}
            </p>
            <p className="mt-2 text-sm text-emerald-900">
              Viel Spaß auf deiner Tour!
            </p>
          </div>
          <button
            type="button"
            className={`${btnPrimary} mt-4`}
            onClick={handleEndTour}
            disabled={loading}
          >
            {loading ? 'Wird beendet …' : 'Fahrt beenden'}
          </button>
        </section>
      )}

      {phase === 'finished' && summary && selectedScooter && (
        <section className={panelClass}>
          <h2 className="text-lg font-semibold text-text-heading">
            Fahrt beendet
          </h2>
          <p className="mt-1 text-sm text-text">
            Danke, dass du EasyScoot genutzt hast.
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Scooter
              </dt>
              <dd className="mt-1 font-medium text-text-heading">
                {selectedScooter.brand} {selectedScooter.model}
              </dd>
            </div>
            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Dauer
              </dt>
              <dd className="mt-1 font-medium text-text-heading">
                {summary.durationMinutes} Minuten
              </dd>
            </div>
            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Strecke
              </dt>
              <dd className="mt-1 font-medium text-text-heading">
                ca. {summary.distanceKm.toFixed(1)} km
              </dd>
            </div>
            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Kosten
              </dt>
              <dd className="mt-1 text-lg font-semibold text-brand-700">
                {summary.priceEuro.toFixed(2)} €
              </dd>
            </div>
          </dl>
          <button
            type="button"
            className={`${btnPrimary} mt-6`}
            onClick={handleNewRide}
            disabled={loading}
          >
            Neue Fahrt starten
          </button>
        </section>
      )}
    </Layout>
  )
}
