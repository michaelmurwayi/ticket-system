import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { signupRequest, ApiError } from '../../services/authService'

export interface SignupState {
  username: string
  email: string
  password: string
  confirmPassword: string
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export interface SignupCredentials {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const initialState: SignupState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  status: 'idle',
  error: null,
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Registers a new account via the backend API. Performs client-side validation
 * first, then delegates to the auth service. On failure it rejects with a
 * human-readable reason for the UI alert.
 */
export const signup = createAsyncThunk<
  { username: string },
  SignupCredentials,
  { rejectValue: string }
>(
  'signup/register',
  async ({ username, email, password, confirmPassword }, { rejectWithValue }) => {
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()

    if (!trimmedUsername) {
      return rejectWithValue('Username is required.')
    }
    if (!trimmedEmail) {
      return rejectWithValue('Email is required.')
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return rejectWithValue('Please enter a valid email address.')
    }
    if (!password) {
      return rejectWithValue('Password is required.')
    }
    if (password.length < 8) {
      return rejectWithValue('Password must be at least 8 characters.')
    }
    if (password !== confirmPassword) {
      return rejectWithValue('Passwords do not match.')
    }

    try {
      await signupRequest({
        username: trimmedUsername,
        email: trimmedEmail,
        password,
        re_password: confirmPassword,
      })
      return { username: trimmedUsername }
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Something went wrong. Please try again.')
    }
  },
)

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setSignupUsername(state, action: PayloadAction<string>) {
      state.username = action.payload
      state.error = null
    },
    setSignupEmail(state, action: PayloadAction<string>) {
      state.email = action.payload
      state.error = null
    },
    setSignupPassword(state, action: PayloadAction<string>) {
      state.password = action.payload
      state.error = null
    },
    setSignupConfirmPassword(state, action: PayloadAction<string>) {
      state.confirmPassword = action.payload
      state.error = null
    },
    resetSignup() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.username = action.payload.username
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Something went wrong. Please try again.'
      })
  },
})

export const {
  setSignupUsername,
  setSignupEmail,
  setSignupPassword,
  setSignupConfirmPassword,
  resetSignup,
} = signupSlice.actions

export default signupSlice.reducer
