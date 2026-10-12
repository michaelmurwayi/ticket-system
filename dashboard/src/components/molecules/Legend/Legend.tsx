import type { SxProps, Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { BadgeMeta } from '../../../theme/ticketMeta'

interface LegendProps {
  title: string
  items: BadgeMeta[]
  sx?: SxProps<Theme>
}

/** A color key/legend for a set of badge items (priority or status). */
export default function Legend({ title, items, sx }: LegendProps) {
  return (
    <Box sx={{ ...(typeof sx === 'object' ? sx : {}) }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.75, fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '3px',
                bgcolor: item.bg,
                border: `1px solid ${item.color}`,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
