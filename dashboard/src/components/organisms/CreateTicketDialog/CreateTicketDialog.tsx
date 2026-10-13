import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { CreateTicketForm } from '../CreateTicketForm'

interface CreateTicketDialogProps {
  open: boolean
  onClose: () => void
}

export default function CreateTicketDialog({
  open,
  onClose,
}: CreateTicketDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, color: '#d4af37' }}>
        New Ticket
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <CreateTicketForm
          formSx={{ mt: 1 }}
          onSuccess={onClose}
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
      </DialogContent>
    </Dialog>
  )
}
