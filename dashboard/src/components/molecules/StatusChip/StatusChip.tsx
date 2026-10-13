import type { SxProps, Theme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import { statusMeta } from '../../../theme/ticketMeta'
import type { TicketStatus } from '../../../store/types'

interface StatusChipProps {
  status: TicketStatus
  size?: 'small' | 'medium'
  sx?: SxProps<Theme>
}

export default function StatusChip({
  status,
  size = 'small',
  sx,
}: StatusChipProps) {
  const meta = statusMeta[status]

  return (
    <Chip
      label={meta?.label ?? status}
      size={size}
      sx={{
        color: meta?.color,
        bgcolor: meta?.bg,
        border: `1px solid ${meta?.color}`,
        fontWeight: 600,
        ...(typeof sx === 'object' ? sx : {}),
      }}
    />
  )
}
