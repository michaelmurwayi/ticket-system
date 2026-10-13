import type { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { StatusChip } from '../../molecules/StatusChip'
import { PriorityChip } from '../../molecules/PriorityChip'
import type { Ticket } from '../../../services/ticketService'

interface TicketDetailDialogProps {
  open: boolean
  ticket: Ticket | null
  onClose: () => void
}

const KNOWN_KEYS = new Set([
  'id',
  'title',
  'description',
  'status',
  'priority',
  'created_at',
  'updated_at',
])

function formatDateTime(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString()
}

function humanize(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function renderValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        py: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  )
}

export default function TicketDetailDialog({
  open,
  ticket,
  onClose,
}: TicketDetailDialogProps) {
  const extraFields = ticket
    ? Object.entries(ticket).filter(([key]) => !KNOWN_KEYS.has(key))
    : []

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, color: '#d4af37' }}>
        {ticket ? `Ticket #${ticket.id}` : 'Ticket'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {ticket && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {ticket.title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <StatusChip status={ticket.status} />
              <PriorityChip priority={ticket.priority} />
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}
            >
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
              {ticket.description?.trim()
                ? ticket.description
                : 'No description provided.'}
            </Typography>

            <Divider sx={{ mb: 1 }} />

            <Stack divider={<Divider flexItem />} spacing={0}>
              <DetailRow label="Status" value={<StatusChip status={ticket.status} />} />
              <DetailRow
                label="Priority"
                value={<PriorityChip priority={ticket.priority} />}
              />
              <DetailRow label="Created" value={formatDateTime(ticket.created_at)} />
              <DetailRow label="Updated" value={formatDateTime(ticket.updated_at)} />
              {extraFields.map(([key, value]) => (
                <DetailRow
                  key={key}
                  label={humanize(key)}
                  value={renderValue(value)}
                />
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
