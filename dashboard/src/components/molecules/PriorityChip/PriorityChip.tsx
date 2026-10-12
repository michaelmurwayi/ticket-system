import type { SxProps, Theme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import { priorityMeta } from '../../../theme/ticketMeta'
import type { TicketPriority } from '../../../store/types'

interface PriorityChipProps {
  priority: TicketPriority
  size?: 'small' | 'medium'
  sx?: SxProps<Theme>
}

export default function PriorityChip({
  priority,
  size = 'small',
  sx,
}: PriorityChipProps) {
  const meta = priorityMeta[priority]

  return (
    <Chip
      label={meta?.label ?? priority}
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
