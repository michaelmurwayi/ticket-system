import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '../../services/authService'
import {
  getTickets,
  createTicket,
  updateTicket,
  updateTicketStatus,
  deleteTicket,
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
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  deleteError: string | null
}

const initialState: TicketsState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  updateStatus: 'idle',
  updateError: null,
  deleteStatus: 'idle',
  deleteError: null,
}

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

export const deleteTicketById = createAsyncThunk<
  Ticket['id'],
  Ticket['id'],
  { rejectValue: string }
>('tickets/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteTicket(id)
    return id
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to delete ticket.')
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
    resetDeleteStatus(state) {
      state.deleteStatus = 'idle'
      state.deleteError = null
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
      .addCase(deleteTicketById.pending, (state) => {
        state.deleteStatus = 'loading'
        state.deleteError = null
      })
      .addCase(deleteTicketById.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        state.deleteError = null
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteTicketById.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.deleteError = action.payload ?? 'Failed to delete ticket.'
      })
  },
})

export const {
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
} = ticketsSlice.actions

export default ticketsSlice.reducer


