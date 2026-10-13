import type { SxProps, Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { priorityMeta, statusMeta } from '../../../theme/ticketMeta'
import type { TicketPriority, TicketStatus } from '../../../store/types'

export type PriorityFilter = TicketPriority | 'all'
export type StatusFilter = TicketStatus | 'all'

interface TicketFiltersProps {
  priority: PriorityFilter
  status: StatusFilter
  onPriorityChange: (value: PriorityFilter) => void
  onStatusChange: (value: StatusFilter) => void
  sx?: SxProps<Theme>
}

export default function TicketFilters({
  priority,
  status,
  onPriorityChange,
  onStatusChange,
  sx,
}: TicketFiltersProps) {
  const priorityKeys = Object.keys(priorityMeta) as TicketPriority[]
  const statusKeys = Object.keys(statusMeta) as TicketStatus[]

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        ...(typeof sx === 'object' ? sx : {}),
      }}
    >
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="priority-filter-label">Priority</InputLabel>
        <Select
          labelId="priority-filter-label"
          label="Priority"
          value={priority}
          onChange={(event) =>
            onPriorityChange(event.target.value as PriorityFilter)
          }
        >
          <MenuItem value="all">All</MenuItem>
          {priorityKeys.map((key) => (
            <MenuItem key={key} value={key}>
              {priorityMeta[key].label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
        >
          <MenuItem value="all">All</MenuItem>
          {statusKeys.map((key) => (
            <MenuItem key={key} value={key}>
              {statusMeta[key].label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
