import type { SxProps, Theme } from '@mui/material/styles'
import MuiTextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  sx?: SxProps<Theme>
}

/** A reusable labeled select built on MUI TextField's `select` mode. */
export default function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  sx,
}: SelectFieldProps) {
  return (
    <MuiTextField
      id={id}
      label={label}
      value={value}
      select
      fullWidth
      sx={sx}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MuiTextField>
  )
}
