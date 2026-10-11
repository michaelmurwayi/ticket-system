import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { TicketStatus } from '../types'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  createdAt: string
}

export interface NewTicketInput {
  title: string
  description: string
}

export interface TicketsState {
  items: Ticket[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: TicketsState = {
  items: [],
  status: 'idle',
  error: null,
}

let ticketId = 0
const nextId = () => `ticket-${++ticketId}`

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {

    addTicket: {
      reducer(state, action: PayloadAction<Ticket>) {
        state.items.push(action.payload)
      },
      prepare({ title, description }: NewTicketInput) {
        return {
          payload: {
            id: nextId(),
            title,
            description,
            status: 'open' as TicketStatus,
            createdAt: new Date().toISOString(),
          },
        }
      },
    },
    updateTicketStatus(
      state,
      action: PayloadAction<{ id: string; status: TicketStatus }>,
    ) {
      const ticket = state.items.find((item) => item.id === action.payload.id)
      if (ticket) {
        ticket.status = action.payload.status
      }
    },
    removeTicket(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

export const { addTicket, updateTicketStatus, removeTicket } =
  ticketsSlice.actions

export default ticketsSlice.reducer
