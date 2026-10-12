import { apiRequest } from './authService'
import type { TicketPriority, TicketStatus } from '../store/types'

export interface Ticket {
  id: number | string
  title: string
  description?: string
  status: TicketStatus
  priority: TicketPriority
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface TicketStatistics {
  total: number
  open: number
  in_progress: number
  closed: number
}

/** Envelope returned by the backend for the statistics endpoint. */
interface StatisticsResponse {
  success: boolean
  message: string
  data: TicketStatistics
}

/**
 * Envelope returned by the backend for the ticket list endpoint. Handles both
 * `{ data: [...] }` and Django REST Framework pagination `{ results: [...] }`.
 */
interface TicketsListResponse {
  data?: Ticket[]
  results?: Ticket[]
  [key: string]: unknown
}

/** Fetches ticket statistics (auth header attached automatically). */
export async function getStatistics(): Promise<TicketStatistics> {
  const response = await apiRequest<StatisticsResponse>('/tickets/statistics/')
  return response.data
}

/** Fetches all tickets (auth header attached automatically). */
export async function getTickets(): Promise<Ticket[]> {
  const response = await apiRequest<TicketsListResponse>('/tickets/')
  return response.data ?? response.results ?? []
}

