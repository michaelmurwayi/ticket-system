import { useState } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import { TicketForm, type TicketFormValues } from '../TicketForm'
import { createNewTicket } from '../../../store/slices/ticketsSlice'
import { useAppDispatch, useAppSelector } from '../../../store'

interface CreateTicketFormProps {
  formSx?: SxProps<Theme>
  fieldSx?: SxProps<Theme>
  buttonSx?: SxProps<Theme>
  alertSx?: SxProps<Theme>
  onSuccess?: () => void
}

export default function CreateTicketForm({
  formSx,
  fieldSx,
  buttonSx,
  alertSx,
  onSuccess,
}: CreateTicketFormProps) {
  const dispatch = useAppDispatch()
  const createError = useAppSelector((state) => state.tickets.createError)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: TicketFormValues) => {
    setIsSubmitting(true)
    try {
      await dispatch(createNewTicket(values)).unwrap()
      onSuccess?.()
    } catch {
      // Error message is surfaced from Redux state (createError).
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <TicketForm
      submitLabel="Create Ticket"
      loadingLabel="Creating…"
      isSubmitting={isSubmitting}
      error={createError}
      onSubmit={handleSubmit}
      formSx={formSx}
      fieldSx={fieldSx}
      buttonSx={buttonSx}
      alertSx={alertSx}
    />
  )
}


