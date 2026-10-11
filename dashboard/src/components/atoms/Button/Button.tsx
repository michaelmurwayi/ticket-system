import MuiButton from '@mui/material/Button'
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button'

type ButtonProps = MuiButtonProps

export default function Button(props: ButtonProps) {
  return <MuiButton fullWidth variant="contained" {...props} />
}

