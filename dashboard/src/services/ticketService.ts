import { apiRequest } from './authService'

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

/** Fetches ticket statistics (auth header attached automatically). */
export async function getStatistics(): Promise<TicketStatistics> {
  const response = await apiRequest<StatisticsResponse>('/tickets/statistics/')
  return response.data
}
