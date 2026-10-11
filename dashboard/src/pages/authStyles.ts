import type { SxProps, Theme } from '@mui/material/styles'

/**
 * Shared styling tokens for the auth pages (login + signup).
 * Kept in one place so both pages stay visually consistent and the gold /
 * green / black-with-white-outline theme is defined once.
 */

/** Full-viewport centered layout used by both auth pages. */
export const authPageSx: SxProps<Theme> = {
  minHeight: '100svh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: { xs: 2, sm: 3 },
  py: { xs: 4, sm: 8 },
  bgcolor: 'background.default',
}

/** The card container. */
export const authCardSx: SxProps<Theme> = {
  p: { xs: 3, sm: 5 },
  borderRadius: 3,
}

/** Gold heading. */
export const authTitleSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: { xs: '1.75rem', sm: '2.125rem' },
  color: '#d4af37',
}

/** Consistent vertical spacing between form fields. */
export const authFormSx: SxProps<Theme> = {
  gap: { xs: 2, sm: 2.5 },
}

/** Gold button: black background, white outline, green on hover. */
export const authButtonSx: SxProps<Theme> = {
  py: { xs: 1.25, sm: 1.5 },
  bgcolor: '#000000',
  color: '#d4af37',
  border: '2px solid #ffffff',
  '&:hover': {
    bgcolor: '#43a047',
    color: '#ffffff',
    borderColor: '#43a047',
  },
  '&.Mui-disabled': {
    bgcolor: '#000000',
    color: '#8a8a8a',
    border: '2px solid #ffffff',
  },
}

/** Consistent form field sizing. */
export const authFieldSx: SxProps<Theme> = {
  '& .MuiInputBase-root': { fontSize: { xs: '0.95rem', sm: '1rem' } },
}

/** Consistent alert sizing/alignment. */
export const authAlertSx: SxProps<Theme> = {
  fontSize: { xs: '0.85rem', sm: '0.9rem' },
  alignItems: 'center',
}

/** Gold secondary link (e.g. "Sign up" / "Sign in" toggle). */
export const authLinkSx: SxProps<Theme> = {
  color: '#d4af37',
  fontWeight: 600,
  textUnderlineOffset: 3,
  '&:hover': { color: '#e6c65a' },
}
