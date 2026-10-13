import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { SignupForm } from '../components/organisms/SignupForm'
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

export default function SignupPage() {
  return (
    <Box sx={authPageSx}>
      <Container maxWidth="xs" disableGutters>
        <Paper elevation={3} sx={authCardSx}>
          <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={authTitleSx}>
              Create your account
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '0.95rem' } }}
            >
              Sign up to start managing tickets
            </Typography>
          </Box>

          <SignupForm
            formSx={authFormSx}
            fieldSx={authFieldSx}
            alertSx={authAlertSx}
            buttonSx={authButtonSx}
          />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/login" underline="hover" sx={authLinkSx}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
