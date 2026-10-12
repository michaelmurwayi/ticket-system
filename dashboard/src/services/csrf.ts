/**
 * CSRF helpers for Django REST Framework's SessionAuthentication.
 *
 * DRF enforces CSRF on "unsafe" methods (POST/PUT/PATCH/DELETE) when the
 * request is authenticated via a session cookie. Django stores the token in a
 * `csrftoken` cookie; echoing it back in the `X-CSRFToken` header satisfies
 * the check. (Basic/Token auth doesn't require this, but session auth does.)
 */

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/** True for HTTP methods that require a CSRF token. */
export function isUnsafeMethod(method: string): boolean {
  return UNSAFE_METHODS.has(method.toUpperCase())
}

/** Reads the `csrftoken` cookie set by Django. Returns null if absent. */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}
