export function formatUsageStatus(status: string): string {
  if (status === 'InNutzung') return 'In Benutzung'
  if (status === 'NichtInNutzung') return 'Verfügbar'
  return status
}

export function formatMaintenanceMode(mode: string): string {
  if (mode === 'InWartung') return 'In Wartung'
  if (mode === 'NichtInWartung') return 'Betriebsbereit'
  return mode
}

export function formatDrivingStatus(status: string): string {
  if (status === 'stehend') return 'Stehend'
  if (status === 'fahrend') return 'Fahrend'
  return status
}

export function friendlyApiError(message: string): string {
  if (message.includes('ACCOUNT_NOT_FOUND')) {
    return 'Kein Konto mit dieser E-Mail gefunden.'
  }
  if (message.includes('INVALID_REQUEST')) {
    return 'Bitte fülle alle Felder korrekt aus (E-Mail muss @ enthalten).'
  }
  if (message.includes('SCOOTER_NOT_FOUND')) {
    return 'Der gewählte Scooter wurde nicht gefunden.'
  }
  if (message.includes('REQUEST_FAILED') || message.includes('Failed to fetch')) {
    return 'Verbindung zum Server fehlgeschlagen.'
  }
  return 'Die Aktion konnte nicht ausgeführt werden.'
}
