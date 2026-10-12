import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '../../services/authService'
import {
  getTickets,
  createTicket,
  type Ticket,
  type NewTicketInput,
} from '../../services/ticketService'

export interface TicketsState {
  items: Ticket[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  createError: string | null
}

const initialState: TicketsState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
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

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    resetCreateStatus(state) {
      state.createStatus = 'idle'
      state.createError = null
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
  },
})

export const { resetCreateStatus } = ticketsSlice.actions

export default ticketsSlice.reducer


