import type { FormEvent } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import { Form } from '../../molecules/Form'
import { FormField } from '../../molecules/FormField'
import { Button } from '../../atoms/Button'
import { Alert } from '../../atoms/Alert'
import { login, setUsername, setPassword } from '../../../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../../store'

interface LoginFormProps {
  formSx?: SxProps<Theme>
  fieldSx?: SxProps<Theme>
  buttonSx?: SxProps<Theme>
  alertSx?: SxProps<Theme>
  buttonSpacing?: number
}

export default function LoginForm({
  formSx,
  fieldSx,
  buttonSx,
  alertSx,
  buttonSpacing = 1,
}: LoginFormProps) {
  const dispatch = useAppDispatch()
  const { username, password, status, error } = useAppSelector(
    (state) => state.auth,
  )

  const isLoading = status === 'loading'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(login({ username, password }))
  }

  return (
    <Form onSubmit={handleSubmit} sx={formSx} spacing={buttonSpacing}>
      {status === 'failed' && error && (
        <Alert severity="error" sx={alertSx}>
          {error}
        </Alert>
      )}
      <FormField
        id="username"
        label="Username"
        value={username}
        placeholder="your_username"
        autoComplete="username"
        sx={fieldSx}
        onChange={(value) => dispatch(setUsername(value))}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        value={password}
        placeholder="••••••••"
        autoComplete="current-password"
        sx={fieldSx}
        onChange={(value) => dispatch(setPassword(value))}
      />
      <Button type="submit" disabled={isLoading} sx={buttonSx}>
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Sign in'
        )}
      </Button>
    </Form>
  )
}


