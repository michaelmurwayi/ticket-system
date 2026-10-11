import MuiTextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material/TextField'

interface FormFieldProps extends Omit<TextFieldProps, 'onChange'> {
  onChange: (value: string) => void
}

export default function FormField(props: FormFieldProps) {
  const { onChange, ...rest } = props
  return (
    <MuiTextField
      fullWidth
      {...rest}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
