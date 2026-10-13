import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { loginRequest, ApiError } from "../../services/authService";
import {
  clearCredentials,
  loadCredentials,
  saveCredentials,
} from "../../services/authStorage";

export interface AuthUser {
  id?: number | string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  [key: string]: unknown;
}

export interface AuthState {
  username: string;
  password: string;
  user: AuthUser | null;
  isSuperuser: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  username: string;
  user: AuthUser | null;
  isSuperuser: boolean;
}

const stored = loadCredentials();

const initialState: AuthState = {
  username: stored?.username ?? "",
  password: "",
  user: null,
  isSuperuser: stored?.isSuperuser ?? false,
  status: stored ? "succeeded" : "idle",
  error: null,
};

export const login = createAsyncThunk<
  LoginResult,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return rejectWithValue("Username is required.");
  }
  if (!password) {
    return rejectWithValue("Password is required.");
  }

  try {
    const response = await loginRequest({
      username: trimmedUsername,
      password,
    });
    const user = ((response as { user?: AuthUser }).user ??
      response) as AuthUser;
    console.log(user);
    console.log(response);
    const isSuperuser = Boolean(user?.is_superuser);

    saveCredentials({ username: trimmedUsername, password, isSuperuser });

    return { username: trimmedUsername, user, isSuperuser };
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Something went wrong. Please try again.");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  clearCredentials();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;

      state.error = null;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
      state.error = null;
    },
    resetAuth() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.username = action.payload.username;
        state.user = action.payload.user;
        state.isSuperuser = action.payload.isSuperuser;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(logout.fulfilled, (state) => {
        state.username = "";
        state.password = "";
        state.user = null;
        state.isSuperuser = false;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { setUsername, setPassword, resetAuth } = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === "succeeded";

export const selectIsSuperuser = (state: { auth: AuthState }) =>
  state.auth.isSuperuser;

export default authSlice.reducer;
