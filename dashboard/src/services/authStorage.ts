export interface StoredCredentials {
  username: string
  password: string
  isSuperuser?: boolean
}

const STORAGE_KEY = 'auth.credentials'

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
      return {
        username: parsed.username,
        password: parsed.password,
        isSuperuser: Boolean(parsed.isSuperuser),
      }
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
  }
}

export function buildBasicAuthHeader(credentials: StoredCredentials): string {
  return `Basic ${toBase64(`${credentials.username}:${credentials.password}`)}`
}
