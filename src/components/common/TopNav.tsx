import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Box, LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { APP_NAME, NAV_ITEMS, ROUTES } from '@/constants'
import { useAuthStore } from '@/store/auth.store'
import { useUiStore } from '@/store'
import { trackEvent, cn } from '@/utils'

type TopNavVariant = 'light' | 'dark'

type TopNavProps = {
  variant?: TopNavVariant
  children?: ReactNode
}

export function TopNav({ variant = 'dark', children }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  if (variant === 'light') {
    return (
      <div className="flex flex-col gap-5">
        <header
          className={cn(
            'bg-base-100 px-4 py-3 shadow-sm sm:px-5 md:px-6',
            // Pill shape only on large screens when the mobile menu is closed.
            mobileOpen
              ? 'rounded-2xl'
              : 'rounded-2xl lg:rounded-full',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <Brand className="text-base-900" />
            <div className="hidden min-w-0 flex-1 justify-center lg:flex">
              <NavLinks variant="light" />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Actions variant="light" />
              <MobileMenuButton
                open={mobileOpen}
                onToggle={() => setMobileOpen((v) => !v)}
                variant="light"
              />
            </div>
          </div>
          {mobileOpen ? (
            <div className="mt-3 border-t border-border pt-3 lg:hidden">
              <NavLinks
                variant="light"
                stacked
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          ) : null}
        </header>
        {children}
      </div>
    )
  }

  return (
    <header className="rounded-2xl bg-backgroundDark-200 px-4 py-4 text-white sm:rounded-3xl sm:px-5 sm:py-5 md:px-7 md:py-6">
      <div className="flex items-center justify-between gap-3">
        <Brand className="text-white" />
        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          <NavLinks variant="dark" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Actions variant="dark" />
          <MobileMenuButton
            open={mobileOpen}
            onToggle={() => setMobileOpen((v) => !v)}
            variant="dark"
          />
        </div>
      </div>

      {mobileOpen ? (
        <div className="mt-4 border-t border-white/10 pt-4 lg:hidden">
          <NavLinks
            variant="dark"
            stacked
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      ) : null}

      {children ? (
        <div className="mt-5 flex flex-col gap-4 sm:mt-6 sm:gap-5">
          {children}
        </div>
      ) : null}
    </header>
  )
}

function Brand({ className }: { className?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 sm:h-9 sm:w-9">
        <Box className="h-4 w-4 text-white sm:h-5 sm:w-5" strokeWidth={2} />
      </span>
      <span
        className={cn(
          'truncate text-sub2 font-bold tracking-tight sm:text-sub1',
          className,
        )}
      >
        {APP_NAME}
      </span>
    </div>
  )
}

function NavLinks({
  variant,
  stacked = false,
  onNavigate,
}: {
  variant: TopNavVariant
  stacked?: boolean
  onNavigate?: () => void
}) {
  return (
    <nav
      className={cn(
        stacked
          ? 'flex flex-col gap-1'
          : 'flex flex-wrap items-center justify-center gap-1',
      )}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-full px-3 py-2 text-sub3 font-medium transition-colors sm:px-4 sm:text-sub2',
              variant === 'light' && 'text-base-500 hover:text-base-800',
              variant === 'light' &&
                isActive &&
                'bg-base-200 font-semibold text-base-900',
              variant === 'dark' && 'text-white/60 hover:text-white',
              variant === 'dark' &&
                isActive &&
                'bg-white/10 font-semibold text-white',
              stacked && 'w-full text-left',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

function Actions({ variant }: { variant: TopNavVariant }) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <IconButton
        label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        variant={variant}
        onClick={() => {
          toggleTheme()
          trackEvent('ui.theme_toggled', {
            theme: theme === 'dark' ? 'light' : 'dark',
          })
        }}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </IconButton>
      <img
        src="https://i.pravatar.cc/80?img=12"
        alt={user?.name ?? 'Profile'}
        title={user?.name ?? 'Profile'}
        className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
      />
      <IconButton
        label="Log out"
        variant={variant}
        onClick={() => {
          trackEvent('auth.logout')
          logout()
          navigate(ROUTES.login, { replace: true })
        }}
      >
        <LogOut className="h-4 w-4" />
      </IconButton>
    </div>
  )
}

function MobileMenuButton({
  open,
  onToggle,
  variant,
}: {
  open: boolean
  onToggle: () => void
  variant: TopNavVariant
}) {
  return (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      onClick={onToggle}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:hidden',
        variant === 'light' &&
          'border border-base-300 text-base-600 hover:bg-base-200',
        variant === 'dark' &&
          'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10',
      )}
    >
      {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </button>
  )
}

function IconButton({
  children,
  label,
  variant,
  className,
  onClick,
}: {
  children: ReactNode
  label: string
  variant: TopNavVariant
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10',
        variant === 'light' &&
          'border border-base-300 text-base-600 hover:bg-base-200 hover:text-base-900',
        variant === 'dark' &&
          'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white',
        className,
      )}
    >
      {children}
    </button>
  )
}
