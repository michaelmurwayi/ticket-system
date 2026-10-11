import { createTheme, type ThemeOptions } from '@mui/material/styles'
import { red } from '@mui/material/colors'

/**
 * Dark theme for the ticketing dashboard.
 *
 * Design tokens:
 * - Gold (#d4af37) — accent text and primary actions
 * - Green (#2e7d32 / #43a047) — hover / success states
 * - Black buttons with a white outline
 * - All text uses light, high-contrast colors for visibility on dark surfaces
 */
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4af37', // gold
      light: '#e6c65a',
      dark: '#b8941f',
      contrastText: '#0d0d0d',
    },
    secondary: {
      main: '#43a047', // green
      light: '#66bb6a',
      dark: '#2e7d32',
      contrastText: '#ffffff',
    },
    success: {
      main: '#43a047',
      light: '#66bb6a',
      dark: '#2e7d32',
      contrastText: '#ffffff',
    },
    error: {
      main: red[400],
      light: red[300],
      dark: red[600],
      contrastText: '#ffffff',
    },
    background: {
      default: '#0d0d0f',
      paper: '#16161a',
    },
    text: {
      primary: '#f5f5f7',
      secondary: '#b8b8c0',
      disabled: '#7a7a85',
    },
    divider: '#2c2c33',
    action: {
      hover: 'rgba(212, 175, 55, 0.08)',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #2c2c33',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#3a3a44',
        },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d4af37',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d4af37',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#b8b8c0',
          '&.Mui-focused': {
            color: '#d4af37',
          },
        },
      },
    },
  },
}

export const theme = createTheme(themeOptions)
