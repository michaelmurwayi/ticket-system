import { API_BASE_URL } from './config'
import {
  buildBasicAuthHeader,
  loadCredentials,
  type StoredCredentials,
} from './authStorage'
import { getCsrfToken, isUnsafeMethod } from './csrf'

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthUser {
  id?: number | string
  username?: string
  email?: string
  [key: string]: unknown
}

export interface LoginResponse {
  token?: string
  access?: string
  refresh?: string
  user?: AuthUser
  [key: string]: unknown
}

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback

  const record = data as Record<string, unknown>

  if (typeof record.detail === 'string') return record.detail

  for (const value of Object.values(record)) {
    if (typeof value === 'string') return value
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  }

  return fallback
}

interface RequestOptions {
  method?: string
  body?: unknown
  credentials?: StoredCredentials | null
  headers?: Record<string, string>
}

export async function apiRequest<T = unknown>(
  path: string,
  {
    method = 'GET',
    body,
    credentials,
    headers = {},
  }: RequestOptions = {},
): Promise<T> {
  const auth =
    credentials !== undefined
      ? credentials
      : loadCredentials()

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }
  if (auth) {
    requestHeaders.Authorization = buildBasicAuthHeader(auth)
  }
  if (isUnsafeMethod(method)) {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      requestHeaders['X-CSRFToken'] = csrfToken
    }
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      'Unable to reach the server. Please check your connection and try again.',
    )
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const fallback =
      response.status === 400 || response.status === 401
        ? 'Invalid username or password. Please try again.'
        : response.status === 403
          ? 'You do not have permission to perform this action.'
          : 'Request failed. Please try again.'
    throw new ApiError(extractErrorMessage(data, fallback), response.status)
  }

  return data as T
}

export interface SignupRequest {
  username: string
  email: string
  password: string
  re_password: string
}

export async function signupRequest(
  payload: SignupRequest,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/register/', {
    method: 'POST',
    body: payload,
    credentials: null,
  })
}

export async function loginRequest(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: credentials,
    credentials: null,
  })
}

