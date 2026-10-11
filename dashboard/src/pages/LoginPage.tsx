import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { LoginForm } from '../components/organisms/LoginForm'

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 8 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                color: '#d4af37',
              }}
            >
              Welcome back
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '0.95rem' } }}
            >
              Sign in to your ticketing dashboard
            </Typography>
          </Box>

          <LoginForm
            formSx={{ gap: { xs: 2, sm: 2.5 } }}
            fieldSx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.95rem', sm: '1rem' } } }}
            alertSx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' }, alignItems: 'center' }}
            buttonSx={{
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
            }}
          />
        </Paper>
      </Container>
    </Box>
  )
}

