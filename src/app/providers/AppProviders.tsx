import type { ReactNode } from 'react'
import { Toaster as SonnerToaster } from 'sonner'
import { RealtimeOrdersListener } from '@/components/orders/RealtimeOrdersListener'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <RealtimeOrdersListener />
        <SonnerToaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </QueryProvider>
  )
}
