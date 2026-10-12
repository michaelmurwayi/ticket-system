import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import { Form } from '../../molecules/Form'
import { FormField } from '../../molecules/FormField'
import { SelectField, type SelectOption } from '../../molecules/SelectField'
import { Button } from '../../atoms/Button'
import { Alert } from '../../atoms/Alert'
import { priorityMeta, statusMeta } from '../../../theme'
import type { TicketPriority, TicketStatus } from '../../../store/types'

const priorityOptions: SelectOption[] = (
  Object.keys(priorityMeta) as TicketPriority[]
).map((key) => ({ value: key, label: priorityMeta[key].label }))

const statusOptions: SelectOption[] = (
  Object.keys(statusMeta) as TicketStatus[]
).map((key) => ({ value: key, label: statusMeta[key].label }))

export interface TicketFormValues {
  title: string
  description: string
  priority: TicketPriority
  status: TicketStatus
}

interface TicketFormProps {
  initialValues?: Partial<TicketFormValues>
  submitLabel?: string
  loadingLabel?: string
  isSubmitting?: boolean
  error?: string | null
  onSubmit: (values: TicketFormValues) => void
  formSx?: SxProps<Theme>
  fieldSx?: SxProps<Theme>
  buttonSx?: SxProps<Theme>
  alertSx?: SxProps<Theme>
}

/**
 * Reusable ticket form used for both creating and editing tickets.
 * Fully controlled via props so callers own the submit logic.
 */
export default function TicketForm({
  initialValues,
  submitLabel = 'Save',
  loadingLabel = 'Saving…',
  isSubmitting = false,
  error,
  onSubmit,
  formSx,
  fieldSx,
  buttonSx,
  alertSx,
}: TicketFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  )
  const [priority, setPriority] = useState<TicketPriority>(
    initialValues?.priority ?? 'medium',
  )
  const [status, setStatus] = useState<TicketStatus>(
    initialValues?.status ?? 'open',
  )
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      setValidationError('Title is required.')
      return
    }
    setValidationError(null)

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
    })
  }

  const displayError = validationError ?? error

  return (
    <Form onSubmit={handleSubmit} sx={formSx}>
      {displayError && (
        <Alert severity="error" sx={alertSx}>
          {displayError}
        </Alert>
      )}
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
        {isSubmitting ? loadingLabel : submitLabel}
      </Button>
    </Form>
  )
}
