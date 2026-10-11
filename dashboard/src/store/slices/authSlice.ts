import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loginRequest, ApiError } from '../../services/authService'
import {
  clearCredentials,
  loadCredentials,
  saveCredentials,
} from '../../services/authStorage'

export interface AuthState {
  username: string
  password: string
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export interface LoginCredentials {
  username: string
  password: string
}

// Rehydrate a previously-saved session so the user stays logged in on reload.
const stored = loadCredentials()

const initialState: AuthState = {
  username: stored?.username ?? '',
  password: '',
  status: stored ? 'succeeded' : 'idle',
  error: null,
}

/**
 * Signs in via the backend API. Performs light client-side validation first,
 * then delegates to the auth service. On a 200 it persists the credentials so
 * every subsequent request is sent with HTTP Basic Auth. On failure it rejects
 * with a human-readable reason for the UI alert.
 */
export const login = createAsyncThunk<
  { username: string },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
  const trimmedUsername = username.trim()

  if (!trimmedUsername) {
    return rejectWithValue('Username is required.')
  }
  if (!password) {
    return rejectWithValue('Password is required.')
  }

  try {
    await loginRequest({ username: trimmedUsername, password })
    // Persist credentials for reuse in all future requests (Basic Auth).
    saveCredentials({ username: trimmedUsername, password })
    return { username: trimmedUsername }
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Something went wrong. Please try again.')
  }
})

/** Clears the persisted session and returns to the logged-out state. */
export const logout = createAsyncThunk('auth/logout', async () => {
  clearCredentials()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload
      state.error = null
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload
      state.error = null
    },
    resetAuth() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.username = action.payload.username
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Something went wrong. Please try again.'
      })
      .addCase(logout.fulfilled, (state) => {
        state.username = ''
        state.password = ''
        state.status = 'idle'
        state.error = null
      })
  },
})

export const { setUsername, setPassword, resetAuth } = authSlice.actions

/** Selector: true when a session is active (credentials available). */
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === 'succeeded'

export default authSlice.reducer



