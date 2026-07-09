import type {
  AddScooterRequest,
  ApiError,
  CreateAccountRequest,
  GpsDto,
  GpsRequestDto,
  LoginRequest,
  NearbyQuery,
  PersonDto,
  PositionCheckResponse,
  ReservationResponse,
  ReserveRequest,
  ScooterDetailDto,
  ScooterDto,
  SuccessResponse,
  TourEndRequest,
  TourStartRequest,
  TourStartResponse,
  TourSummaryDto,
} from '../types/api'
import { ApiClientError } from '../types/api'

export const DEFAULT_LAT = 52.396
export const DEFAULT_LNG = 9.598

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) {
    throw new Error(`Leere Antwort (${response.status})`)
  }
  return JSON.parse(text) as T
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...JSON_HEADERS, ...init?.headers },
  })

  if (!response.ok) {
    const error = await parseJson<ApiError>(response).catch(() => ({
      error: 'REQUEST_FAILED',
      message: response.statusText,
    }))
    throw new ApiClientError(response.status, error.error, error.message)
  }

  return parseJson<T>(response)
}

function buildQuery(params: Record<string, string | number | boolean>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

// --- ScooterController: /api/scooters ---

export function fetchNearbyScooters(lat: number, lng: number) {
  return request<ScooterDto[]>(
    `/api/scooters/nearby${buildQuery({ lat, lng })}`,
  )
}

export function fetchNearbyScootersByQuery({ lat, lng }: NearbyQuery) {
  return fetchNearbyScooters(lat, lng)
}

export function fetchScooterById(id: number) {
  return request<ScooterDto>(`/api/scooters/${id}`)
}

export function checkScooterPosition(id: number, latitude: number, longitude: number) {
  return checkScooterPositionByGps(id, { latitude, longitude })
}

export function checkScooterPositionByGps(id: number, gps: GpsRequestDto) {
  return request<PositionCheckResponse>(`/api/scooters/${id}/check-position`, {
    method: 'POST',
    body: JSON.stringify(gps),
  })
}

export function reserveScooter(id: number, body: ReserveRequest = {}) {
  return request<ReservationResponse>(`/api/scooters/${id}/reserve`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const scooterApi = {
  getNearby: fetchNearbyScooters,
  getNearbyByQuery: fetchNearbyScootersByQuery,
  getById: fetchScooterById,
  checkPosition: checkScooterPosition,
  checkPositionByGps: checkScooterPositionByGps,
  reserve: reserveScooter,
} as const

// --- AccountController: /api/accounts ---

export function createAccount(body: CreateAccountRequest) {
  return request<PersonDto>('/api/accounts', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function loginAccount(body: LoginRequest) {
  return request<PersonDto>('/api/accounts/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const accountApi = {
  create: createAccount,
  login: loginAccount,
} as const

// --- TourController: /api/tours ---

export function startTour(body: TourStartRequest) {
  return request<TourStartResponse>('/api/tours/start', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function endTour(body: TourEndRequest) {
  return request<TourSummaryDto>('/api/tours/end', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function fetchTourSummary(tourId: string) {
  return request<TourSummaryDto>(`/api/tours/${tourId}/summary`)
}

export const tourApi = {
  start: startTour,
  end: endTour,
  getSummary: fetchTourSummary,
} as const

// --- ReservationController: /api/reservations ---

export function cancelReservation(reservationId: string) {
  return request<SuccessResponse>(`/api/reservations/${reservationId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export const reservationApi = {
  cancel: cancelReservation,
} as const

// --- ManagementController: /api/management/scooters ---

export function fetchManagementScooters() {
  return request<ScooterDetailDto[]>('/api/management/scooters')
}

export function fetchManagementScooterById(id: number) {
  return request<ScooterDetailDto>(`/api/management/scooters/${id}`)
}

export const managementApi = {
  getAll: fetchManagementScooters,
  getById: fetchManagementScooterById,
} as const

// --- ServiceController: /api/service/scooters ---

export function fetchServiceScooters() {
  return request<ScooterDetailDto[]>('/api/service/scooters')
}

export function fetchLowBatteryScooters() {
  return request<ScooterDetailDto[]>('/api/service/scooters/low-battery')
}

export function startMaintenance(id: number) {
  return request<SuccessResponse>(`/api/service/scooters/${id}/maintenance/start`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export function endMaintenance(id: number) {
  return request<SuccessResponse>(`/api/service/scooters/${id}/maintenance/end`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export function addScooterToFleet(body: AddScooterRequest) {
  return request<ScooterDetailDto>('/api/service/scooters', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function retireScooter(id: number) {
  return request<SuccessResponse>(`/api/service/scooters/${id}`, {
    method: 'DELETE',
  })
}

export const serviceApi = {
  getAll: fetchServiceScooters,
  getLowBattery: fetchLowBatteryScooters,
  startMaintenance,
  endMaintenance,
  addScooter: addScooterToFleet,
  retire: retireScooter,
} as const

export const api = {
  scooters: scooterApi,
  accounts: accountApi,
  tours: tourApi,
  reservations: reservationApi,
  management: managementApi,
  service: serviceApi,
} as const

export type {
  AddScooterRequest,
  CreateAccountRequest,
  GpsDto,
  GpsRequestDto,
  LoginRequest,
  NearbyQuery,
  PersonDto,
  ScooterDetailDto,
  ScooterDto,
  TourEndRequest,
  TourStartRequest,
  TourSummaryDto,
}
