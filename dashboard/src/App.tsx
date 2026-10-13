import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import { useAppSelector } from './store'

function RequireAuth({ children }: { children: ReactElement }) {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.status === 'succeeded',
  )
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App



