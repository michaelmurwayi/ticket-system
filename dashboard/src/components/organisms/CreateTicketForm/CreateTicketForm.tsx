import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import { Form } from '../../molecules/Form'
import { FormField } from '../../molecules/FormField'
import { SelectField, type SelectOption } from '../../molecules/SelectField'
import { Button } from '../../atoms/Button'
import { Alert } from '../../atoms/Alert'
import { createNewTicket } from '../../../store/slices/ticketsSlice'
import { priorityMeta, statusMeta } from '../../../theme'
import { useAppDispatch, useAppSelector } from '../../../store'
import type { TicketPriority, TicketStatus } from '../../../store/types'

const priorityOptions: SelectOption[] = (
  Object.keys(priorityMeta) as TicketPriority[]
).map((key) => ({ value: key, label: priorityMeta[key].label }))

const statusOptions: SelectOption[] = (
  Object.keys(statusMeta) as TicketStatus[]
).map((key) => ({ value: key, label: statusMeta[key].label }))

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

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [status, setStatus] = useState<TicketStatus>('open')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      setValidationError('Title is required.')
      return
    }
    setValidationError(null)
    setIsSubmitting(true)

    try {
      await dispatch(
        createNewTicket({
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
        }),
      ).unwrap()

      // Reset the form and notify the parent (e.g. close the dialog).
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('open')
      onSuccess?.()
    } catch {
      // Error message is surfaced from Redux state (createError).
    } finally {
      setIsSubmitting(false)
    }
  }

  const error = validationError ?? createError

  return (
    <Form onSubmit={handleSubmit} sx={formSx}>
      {error && <Alert severity="error" sx={alertSx}>{error}</Alert>}
      <FormField
        id="title"
        label="Title"
        value={title}
        placeholder="Brief summary of the issue"
        sx={fieldSx}
        onChange={setTitle}
      />
      <FormField
        id="description"
        label="Description"
        value={description}
        placeholder="Provide more detail..."
        multiline
        minRows={3}
        sx={fieldSx}
        onChange={setDescription}
      />
      <SelectField
        id="priority"
        label="Priority"
        value={priority}
        options={priorityOptions}
        sx={fieldSx}
        onChange={(value) => setPriority(value as TicketPriority)}
      />
      <SelectField
        id="status"
        label="Status"
        value={status}
        options={statusOptions}
        sx={fieldSx}
        onChange={(value) => setStatus(value as TicketStatus)}
      />
      <Button type="submit" disabled={isSubmitting} sx={buttonSx}>
        {isSubmitting ? 'Creating…' : 'Create Ticket'}
      </Button>
    </Form>
  )
}

