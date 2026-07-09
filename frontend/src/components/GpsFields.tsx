import { inputClass } from '../styles/ui'

type GpsFieldsProps = {
  lat: string
  lng: string
  onLatChange: (v: string) => void
  onLngChange: (v: string) => void
  label?: string
}

export function GpsFields({
  lat,
  lng,
  onLatChange,
  onLngChange,
  label = 'Standort',
}: GpsFieldsProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <p className="w-full text-sm font-medium text-text-heading">{label}</p>
      <label className="text-sm font-medium text-text">
        lat
        <input
          className={inputClass}
          value={lat}
          onChange={(e) => onLatChange(e.target.value)}
          type="number"
          step="0.001"
        />
      </label>
      <label className="text-sm font-medium text-text">
        lng
        <input
          className={inputClass}
          value={lng}
          onChange={(e) => onLngChange(e.target.value)}
          type="number"
          step="0.001"
        />
      </label>
    </div>
  )
}
