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

export interface NewTicketInput {
  title: string
  description: string
  priority: TicketPriority
  status: TicketStatus
}

/**
 * Creates a new ticket via POST /api/tickets/.
 *
 * NOTE: field names (`title`, `description`, `priority`, `status`) follow the
 * shape returned by the list endpoint. If your backend expects different
 * names, adjust NewTicketInput accordingly.
 */
export async function createTicket(payload: NewTicketInput): Promise<Ticket> {
  const response = await apiRequest<{ data?: Ticket } & Ticket>('/tickets/', {
    method: 'POST',
    body: payload,
  })
  return (response.data ?? response) as Ticket
}

/**
 * Fields editable via the general ticket endpoint. Status is intentionally
 * excluded — it is updated through the dedicated status endpoint.
 */
export interface UpdateTicketInput {
  title: string
  description: string
  priority: TicketPriority
}

/**
 * Updates a ticket's general fields via PATCH /api/tickets/{id}/.
 * Does NOT include status (see updateTicketStatus).
 */
export async function updateTicket(
  id: Ticket['id'],
  payload: UpdateTicketInput,
): Promise<Ticket> {
  const response = await apiRequest<{ data?: Ticket } & Ticket>(
    `/tickets/${id}/`,
    {
      method: 'PATCH',
      body: payload,
    },
  )
  return (response.data ?? response) as Ticket
}

/**
 * Updates only a ticket's status via the dedicated endpoint
 * PATCH /api/tickets/{id}/status/ with body `{ status }`.
 */
export async function updateTicketStatus(
  id: Ticket['id'],
  status: TicketStatus,
): Promise<Ticket> {
  const response = await apiRequest<{ data?: Ticket } & Ticket>(
    `/tickets/${id}/status/`,
    {
      method: 'PATCH',
      body: { status },
    },
  )
  return (response.data ?? response) as Ticket
}

