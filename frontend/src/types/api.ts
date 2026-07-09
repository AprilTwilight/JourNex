export interface GpsDto {
  latitude: number
  longitude: number
}

export interface AddressDto {
  street: string
  number: number
  postalCode: number
  city: string
}

export interface ScooterDto {
  id: number
  brand: string
  model: string
  location: GpsDto
  batteryPercent: number
  estimatedRemainingKm: number
  estimatedRemainingMinutes: number
  distanceToUser: number | null
  drivingStatus: string
  usageStatus: string
  maintenanceMode: string
}

export interface ScooterDetailDto {
  id: number
  brand: string
  model: string
  location: GpsDto
  batteryPercent: number
  batteryWh: number
  capacityWh: number
  consumptionCoefficient: number
  estimatedRemainingKm: number
  estimatedRemainingMinutes: number
  drivingStatus: string
  usageStatus: string
  maintenanceMode: string
}

export interface PositionCheckResponse {
  nearby: boolean
  distance: number
}

export interface ReservationResponse {
  success: boolean
  reservationId: string
  scooterId: number
  message: string
}

export interface ReserveRequest {
  customerId?: number
}

export interface SuccessResponse {
  success: boolean
  message: string
}

export interface PersonDto {
  id: number
  firstName: string
  name: string
  mailAddress: string
  address: AddressDto
  role: string
}

export interface CreateAccountRequest {
  firstName: string
  name: string
  mailAddress: string
  address: AddressDto
}

export interface LoginRequest {
  mailAddress: string
}

export interface TourStartRequest {
  reservationId: string
  latitude: number
  longitude: number
}

export interface TourEndRequest {
  tourId: string
}

export interface TourStartResponse {
  success: boolean
  tourId: string
  scooterId: number
  timeTourStart: string
  locationTourStart: GpsDto
}

export interface TourSummaryDto {
  tourId: string
  scooterId: number
  timeTourStart: string
  timeTourEnd: string
  locationTourStart: GpsDto
  locationTourEnd: GpsDto
  akkuTourStartWh: number
  akkuTourEndWh: number
  consumedWh: number
  durationMinutes: number
  distanceKm: number
  priceEuro: number
}

export interface AddScooterRequest {
  brand: string
  model: string
  consumptionCoefficient: number
  location: GpsDto
  capacityWh: number
  initialBatteryWh: number
}

export interface ApiError {
  error: string
  message: string
}

export class ApiClientError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(`${code}: ${message}`)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

export type GpsRequestDto = GpsDto

export interface NearbyQuery {
  lat: number
  lng: number
}
