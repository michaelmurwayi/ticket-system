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

interface StatisticsResponse {
  success: boolean
  message: string
  data: TicketStatistics
}

interface TicketsListResponse {
  data?: Ticket[]
  results?: Ticket[]
  [key: string]: unknown
}

export async function getStatistics(): Promise<TicketStatistics> {
  const response = await apiRequest<StatisticsResponse>('/tickets/statistics/')
  return response.data
}

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

export async function createTicket(payload: NewTicketInput): Promise<Ticket> {
  const response = await apiRequest<{ data?: Ticket } & Ticket>('/tickets/', {
    method: 'POST',
    body: payload,
  })
  return (response.data ?? response) as Ticket
}

export interface UpdateTicketInput {
  title: string
  description: string
  priority: TicketPriority
}

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

export async function deleteTicket(id: Ticket['id']): Promise<void> {
  await apiRequest(`/tickets/${id}/`, {
    method: 'DELETE',
  })
}

