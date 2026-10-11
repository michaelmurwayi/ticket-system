import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '../../services/authService'
import { getStatistics, type TicketStatistics } from '../../services/ticketService'

export interface StatisticsState {
  data: TicketStatistics | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: StatisticsState = {
  data: null,
  status: 'idle',
  error: null,
}

/** Loads ticket statistics from the backend. */
export const fetchStatistics = createAsyncThunk<
  TicketStatistics,
  void,
  { rejectValue: string }
>('statistics/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getStatistics()
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to load statistics.')
  }
})

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Failed to load statistics.'
      })
  },
})

export default statisticsSlice.reducer
