import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '../../services/authService'
import {
  getTickets,
  createTicket,
  updateTicket,
  updateTicketStatus,
  type Ticket,
  type NewTicketInput,
  type UpdateTicketInput,
} from '../../services/ticketService'
import type { TicketStatus } from '../types'

export interface TicketsState {
  items: Ticket[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  createError: string | null
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  updateError: string | null
}

const initialState: TicketsState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  updateStatus: 'idle',
  updateError: null,
}

/** Loads the full ticket list from the backend. */
export const fetchTickets = createAsyncThunk<
  Ticket[],
  void,
  { rejectValue: string }
>('tickets/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getTickets()
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to load tickets.')
  }
})

/** Creates a new ticket and returns the created record. */
export const createNewTicket = createAsyncThunk<
  Ticket,
  NewTicketInput,
  { rejectValue: string }
>('tickets/create', async (payload, { rejectWithValue }) => {
  try {
    return await createTicket(payload)
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to create ticket.')
  }
})

/** Updates an existing ticket and returns the updated record. */
export const updateExistingTicket = createAsyncThunk<
  Ticket,
  { id: Ticket['id']; payload: UpdateTicketInput },
  { rejectValue: string }
>('tickets/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateTicket(id, payload)
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to update ticket.')
  }
})

/** Updates only a ticket's status via the dedicated status endpoint. */
export const changeTicketStatus = createAsyncThunk<
  Ticket,
  { id: Ticket['id']; status: TicketStatus },
  { rejectValue: string }
>('tickets/changeStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    return await updateTicketStatus(id, status)
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to update status.')
  }
})

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    resetCreateStatus(state) {
      state.createStatus = 'idle'
      state.createError = null
    },
    resetUpdateStatus(state) {
      state.updateStatus = 'idle'
      state.updateError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Failed to load tickets.'
      })
      .addCase(createNewTicket.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
      })
      .addCase(createNewTicket.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createError = null
        // Prepend the new ticket so it appears at the top of the list.
        state.items.unshift(action.payload)
      })
      .addCase(createNewTicket.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload ?? 'Failed to create ticket.'
      })
      .addCase(updateExistingTicket.pending, (state) => {
        state.updateStatus = 'loading'
        state.updateError = null
      })
      .addCase(updateExistingTicket.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.updateError = null
        // Replace the matching ticket in place.
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        )
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateExistingTicket.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.updateError = action.payload ?? 'Failed to update ticket.'
      })
      .addCase(changeTicketStatus.pending, (state) => {
        state.updateStatus = 'loading'
        state.updateError = null
      })
      .addCase(changeTicketStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.updateError = null
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        )
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(changeTicketStatus.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.updateError = action.payload ?? 'Failed to update status.'
      })
  },
})

export const { resetCreateStatus, resetUpdateStatus } = ticketsSlice.actions

export default ticketsSlice.reducer


