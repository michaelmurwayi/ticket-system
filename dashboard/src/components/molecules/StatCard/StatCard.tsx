import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface StatCardProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  accentColor?: string
  loading?: boolean
  sx?: SxProps<Theme>
}

export default function StatCard({
  label,
  value,
  icon,
  accentColor = '#d4af37',
  loading = false,
  sx,
}: StatCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        borderTop: `3px solid ${accentColor}`,
        ...(typeof sx === 'object' ? sx : {}),
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {label}
            </Typography>
            <Typography
              variant="h4"
              component="p"
              sx={{ fontWeight: 700, mt: 0.5, color: accentColor }}
            >
              {loading ? '—' : value}
            </Typography>
          </Box>
          {icon && (
            <Box sx={{ color: accentColor, opacity: 0.8 }}>{icon}</Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
