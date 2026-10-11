import { API_BASE_URL } from './config'
import {
  buildBasicAuthHeader,
  loadCredentials,
  type StoredCredentials,
} from './authStorage'

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

/** Error thrown for non-2xx or network failures; carries a UI-ready message. */
export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Extracts a human-readable message from common Django REST Framework
 * error shapes, e.g. `{ detail }`, `{ non_field_errors: [...] }`,
 * or field-level `{ username: [...] }`.
 */
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
  /** Override auth (e.g. skip for the login call itself). */
  credentials?: StoredCredentials | null
  headers?: Record<string, string>
}

/**
 * Generic API request wrapper used by ALL calls.
 *
 * Automatically attaches `Authorization: Basic <base64(user:pass)>` using the
 * stored credentials (unless overridden), sends/receives JSON, and throws an
 * `ApiError` with a readable message on network failure or non-2xx responses.
 */
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

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
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

/**
 * Calls the login endpoint. Credentials are sent in the JSON body (per the
 * endpoint contract) — the Basic Auth header is intentionally omitted here.
 */
export async function loginRequest(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: credentials,
    credentials: null, // don't send Basic Auth on the login call itself
  })
}

