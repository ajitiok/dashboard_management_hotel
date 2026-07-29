import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'manager' | 'staff'
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => { ok: true } | { ok: false; message: string }
  logout: () => void
  isAuthenticated: () => boolean
}

/** Demo credentials for the assignment mock auth flow. */
export const DEMO_CREDENTIALS = {
  email: 'admin@dashboard.com',
  password: 'password123',
} as const

const DEMO_USER: AuthUser = {
  id: 'USR-001',
  name: 'Alex Manager',
  email: DEMO_CREDENTIALS.email,
  role: 'manager',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (email, password) => {
        const normalized = email.trim().toLowerCase()

        if (
          normalized === DEMO_CREDENTIALS.email &&
          password === DEMO_CREDENTIALS.password
        ) {
          set({
            user: DEMO_USER,
            token: `demo-token-${Date.now()}`,
          })
          return { ok: true }
        }

        return {
          ok: false,
          message: 'Invalid email or password. Use the demo credentials.',
        }
      },
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => Boolean(get().token && get().user),
    }),
    { name: 'hotel.auth' },
  ),
)
