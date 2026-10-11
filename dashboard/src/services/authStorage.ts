/**
 * Persists login credentials so they can be re-sent as HTTP Basic Auth on
 * every API request (the pattern your backend expects).
 *
 * SECURITY NOTE: HTTP Basic Auth requires keeping the raw password on the
 * client. This is inherently risky (exposed to XSS / anyone with access to
 * this browser profile). It is stored in localStorage only because the
 * requirement is to reuse it for all requests. Prefer a token/session-cookie
 * scheme for production if the backend supports it.
 */

export interface StoredCredentials {
  username: string
  password: string
}

const STORAGE_KEY = 'auth.credentials'

/** UTF-8 safe base64 encoding (handles non-ASCII usernames/passwords). */
function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

export function saveCredentials(credentials: StoredCredentials): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
  } catch {
    // Storage may be unavailable (private mode, disabled) — fail silently.
  }
}

export function loadCredentials(): StoredCredentials | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<StoredCredentials>
    if (
      typeof parsed.username === 'string' &&
      typeof parsed.password === 'string'
    ) {
      return { username: parsed.username, password: parsed.password }
    }
    return null
  } catch {
    return null
  }
}

export function clearCredentials(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/** Builds an `Authorization: Basic <base64(username:password)>` header value. */
export function buildBasicAuthHeader(credentials: StoredCredentials): string {
  return `Basic ${toBase64(`${credentials.username}:${credentials.password}`)}`
}
