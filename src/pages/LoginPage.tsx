import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Box, Eye, EyeOff, Moon, Sun } from 'lucide-react'
import Button from '@/components/core/Button'
import { APP_NAME, ROUTES } from '@/constants'
import { DEMO_CREDENTIALS, useAuthStore } from '@/store/auth.store'
import { useUiStore } from '@/store'
import { trackEvent } from '@/utils/analytics'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) =>
    Boolean(state.token && state.user),
  )
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.email)
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.password)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from =
    (location.state as { from?: string } | null)?.from ?? ROUTES.dashboard

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    window.setTimeout(() => {
      const result = login(email, password)
      setLoading(false)

      if (!result.ok) {
        setError(result.message)
        trackEvent('auth.login_failed', { email })
        return
      }

      trackEvent('auth.login_success', { email })
      navigate(from, { replace: true })
    }, 400)
  }

  return (
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.4fr)]">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-primary-800 via-primary-700 to-primary-500 p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Box className="h-5 w-5" />
          </span>
          <span className="text-sub1 font-bold">{APP_NAME}</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="max-w-sm text-h4 font-bold leading-tight md:text-h3">
            Run your hotel operations from one calm dashboard
          </h1>
          <div className="max-w-sm rounded-2xl bg-black/20 p-4 text-sub2 text-white/90 backdrop-blur-sm">
            Track guests, rooms, and service orders — including Extra Bed
            approvals and live request alerts.
          </div>
        </div>
        <p className="relative z-10 text-sub3 text-white/70">
          Demo access is prefilled for reviewers.
        </p>
      </aside>

      <main className="relative flex items-center justify-center bg-base-100 px-4 py-10 sm:px-8">
        <button
          type="button"
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          onClick={() => {
            toggleTheme()
            trackEvent('ui.theme_toggled', {
              theme: theme === 'dark' ? 'light' : 'dark',
            })
          }}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-border text-base-600 hover:bg-base-200 hover:text-base-900"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600">
              <Box className="h-5 w-5 text-white" />
            </span>
            <span className="text-sub1 font-bold text-base-900">{APP_NAME}</span>
          </div>

          <h2 className="text-h3 font-bold text-base-900">Log In</h2>
          <p className="mt-2 text-sub2 text-base-500">
            Enter your platform credentials below to enter
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sub3 font-medium text-base-800"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Please enter your email Address"
                className="w-full rounded-xl border border-border px-3 py-3 text-sub2 outline-none focus:border-primary-500"
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sub3 font-medium text-base-800"
                >
                  Password
                </label>
                <span className="text-sub3 text-primary-600">
                  Demo: {DEMO_CREDENTIALS.password}
                </span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Please enter your password"
                  className="w-full rounded-xl border border-border px-3 py-3 pr-11 text-sub2 outline-none focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-base-500 hover:text-base-800"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p className="rounded-xl bg-softColors-6 px-3 py-2 text-sub3 text-danger-700">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="l"
              full
              loading={loading}
              className="rounded-xl!"
            >
              Log In
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
