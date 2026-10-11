import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import { StatCard } from '../components/molecules/StatCard'
import { fetchStatistics } from '../store/slices/statisticsSlice'
import { logout } from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../store'

const ACCENT = {
  total: '#d4af37', // gold
  open: '#43a047', // green
  inProgress: '#e6c65a', // light gold
  closed: '#9e9e9e', // grey
}

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data, status, error } = useAppSelector((state) => state.statistics)
  const username = useAppSelector((state) => state.auth.username)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStatistics())
    }
  }, [dispatch, status])

  const isLoading = status === 'loading'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100svh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: { xs: 2, sm: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
          Ticketing Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {username && (
            <Typography variant="body2" color="text.secondary">
              {username}
            </Typography>
          )}
          <Button
            variant="outlined"
            size="small"
            onClick={handleLogout}
            sx={{ color: '#d4af37', borderColor: '#d4af37' }}
          >
            Log out
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Overview
        </Typography>

        {status === 'failed' && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => dispatch(fetchStatistics())}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {isLoading && !data && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#d4af37' }} />
          </Box>
        )}

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Total Tickets"
              value={data?.total ?? 0}
              accentColor={ACCENT.total}
              loading={isLoading && !data}
              icon={<ConfirmationNumberIcon fontSize="large" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Open"
              value={data?.open ?? 0}
              accentColor={ACCENT.open}
              loading={isLoading && !data}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="In Progress"
              value={data?.in_progress ?? 0}
              accentColor={ACCENT.inProgress}
              loading={isLoading && !data}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Closed"
              value={data?.closed ?? 0}
              accentColor={ACCENT.closed}
              loading={isLoading && !data}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
