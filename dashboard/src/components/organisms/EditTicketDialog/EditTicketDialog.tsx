import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { TicketForm, type TicketFormValues } from '../TicketForm'
import {
  updateExistingTicket,
  changeTicketStatus,
} from '../../../store/slices/ticketsSlice'
import { fetchStatistics } from '../../../store/slices/statisticsSlice'
import { useAppDispatch, useAppSelector } from '../../../store'
import type { Ticket } from '../../../services/ticketService'

interface EditTicketDialogProps {
  open: boolean
  ticket: Ticket | null
  onClose: () => void
}

/** Modal dialog for editing an existing ticket. */
export default function EditTicketDialog({
  open,
  ticket,
  onClose,
}: EditTicketDialogProps) {
  const dispatch = useAppDispatch()
  const updateError = useAppSelector((state) => state.tickets.updateError)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: TicketFormValues) => {
    if (!ticket) return
    setIsSubmitting(true)
    try {
      // General fields (title, description, priority) — status excluded.
      await dispatch(
        updateExistingTicket({
          id: ticket.id,
          payload: {
            title: values.title,
            description: values.description,
            priority: values.priority,
          },
        }),
      ).unwrap()

      // Status is updated through its dedicated endpoint, only if it changed.
      if (values.status !== ticket.status) {
        await dispatch(
          changeTicketStatus({ id: ticket.id, status: values.status }),
        ).unwrap()
      }

      // Status/priority may have changed — keep the stat cards in sync.
      dispatch(fetchStatistics())
      onClose()
    } catch {
      // Error message is surfaced from Redux state (updateError).
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, color: '#d4af37' }}>
        {ticket ? `Edit Ticket #${ticket.id}` : 'Edit Ticket'}
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
          <TicketForm
            key={ticket.id}
            initialValues={{
              title: ticket.title,
              description: ticket.description ?? '',
              priority: ticket.priority,
              status: ticket.status,
            }}
            submitLabel="Save Changes"
            loadingLabel="Saving…"
            isSubmitting={isSubmitting}
            error={updateError}
            onSubmit={handleSubmit}
            formSx={{ mt: 1 }}
            buttonSx={{
              mt: 1,
              bgcolor: '#000000',
              color: '#d4af37',
              border: '2px solid #ffffff',
              '&:hover': {
                bgcolor: '#43a047',
                color: '#ffffff',
                borderColor: '#43a047',
              },
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

