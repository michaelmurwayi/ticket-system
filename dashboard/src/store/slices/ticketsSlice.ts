import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '../../services/authService'
import { getTickets, type Ticket } from '../../services/ticketService'

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

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
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
  },
})

export default ticketsSlice.reducer

