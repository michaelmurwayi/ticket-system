/**
 * Base URL for the backend API (no trailing slash).
 * Override per environment via VITE_API_BASE_URL in a .env file.
 * Defaults to the relative `/api` path so dev requests use the Vite proxy.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
