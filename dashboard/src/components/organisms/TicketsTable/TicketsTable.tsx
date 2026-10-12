import type { SxProps, Theme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { PriorityChip } from '../../molecules/PriorityChip'
import { StatusChip } from '../../molecules/StatusChip'
import type { Ticket } from '../../../services/ticketService'

interface TicketsTableProps {
  tickets: Ticket[]
  loading?: boolean
  sx?: SxProps<Theme>
}

/** Formats an ISO date string to a readable locale date. */
function formatDate(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

export default function TicketsTable({
  tickets,
  loading = false,
  sx,
}: TicketsTableProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress sx={{ color: '#d4af37' }} />
      </Box>
    )
  }

  if (tickets.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No tickets found.</Typography>
      </Paper>
    )
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ ...(typeof sx === 'object' ? sx : {}) }}
    >
      <Table aria-label="tickets table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} hover>
              <TableCell>#{ticket.id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <StatusChip status={ticket.status} />
              </TableCell>
              <TableCell>
                <PriorityChip priority={ticket.priority} />
              </TableCell>
              <TableCell align="right">
                {formatDate(ticket.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
