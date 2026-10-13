import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { LoginForm } from '../components/organisms/LoginForm'
import { useAppSelector } from '../store'
import {
  authAlertSx,
  authButtonSx,
  authCardSx,
  authFieldSx,
  authFormSx,
  authLinkSx,
  authPageSx,
  authTitleSx,
} from './authStyles'

export default function LoginPage() {
  const navigate = useNavigate()
  const status = useAppSelector((state) => state.auth.status)

  useEffect(() => {
    if (status === 'succeeded') {
      navigate('/dashboard', { replace: true })
    }
  }, [status, navigate])

  return (
    <Box sx={authPageSx}>
      <Container maxWidth="xs" disableGutters>
        <Paper elevation={3} sx={authCardSx}>
          <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={authTitleSx}>
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
            formSx={authFormSx}
            fieldSx={authFieldSx}
            alertSx={authAlertSx}
            buttonSx={authButtonSx}
          />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup" underline="hover" sx={authLinkSx}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}



