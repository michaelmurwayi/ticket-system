import type { FormEvent } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import { Form } from '../../molecules/Form'
import { FormField } from '../../molecules/FormField'
import { Button } from '../../atoms/Button'
import { Alert } from '../../atoms/Alert'
import {
  signup,
  setSignupUsername,
  setSignupEmail,
  setSignupPassword,
  setSignupConfirmPassword,
} from '../../../store/slices/signupSlice'
import { useAppDispatch, useAppSelector } from '../../../store'

interface SignupFormProps {
  formSx?: SxProps<Theme>
  fieldSx?: SxProps<Theme>
  buttonSx?: SxProps<Theme>
  alertSx?: SxProps<Theme>
  buttonSpacing?: number
}

export default function SignupForm({
  formSx,
  fieldSx,
  buttonSx,
  alertSx,
  buttonSpacing = 1,
}: SignupFormProps) {
  const dispatch = useAppDispatch()
  const { username, email, password, confirmPassword, status, error } =
    useAppSelector((state) => state.signup)

  const isLoading = status === 'loading'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(signup({ username, email, password, confirmPassword }))
  }

  return (
    <Form onSubmit={handleSubmit} sx={formSx} spacing={buttonSpacing}>
      {status === 'failed' && error && (
        <Alert severity="error" sx={alertSx}>
          {error}
        </Alert>
      )}
      {status === 'succeeded' && (
        <Alert severity="success" sx={alertSx}>
          Account created successfully! You can now sign in.
        </Alert>
      )}
      <FormField
        id="username"
        label="Username"
        value={username}
        placeholder="your_username"
        autoComplete="username"
        sx={fieldSx}
        onChange={(value) => dispatch(setSignupUsername(value))}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        value={email}
        placeholder="you@example.com"
        autoComplete="email"
        sx={fieldSx}
        onChange={(value) => dispatch(setSignupEmail(value))}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        value={password}
        placeholder="••••••••"
        autoComplete="new-password"
        sx={fieldSx}
        onChange={(value) => dispatch(setSignupPassword(value))}
      />
      <FormField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        placeholder="••••••••"
        autoComplete="new-password"
        sx={fieldSx}
        onChange={(value) => dispatch(setSignupConfirmPassword(value))}
      />
      <Button type="submit" disabled={isLoading} sx={buttonSx}>
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Create account'
        )}
      </Button>
    </Form>
  )
}
