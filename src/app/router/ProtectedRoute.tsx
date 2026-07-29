import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/constants'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.token && state.user))
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
