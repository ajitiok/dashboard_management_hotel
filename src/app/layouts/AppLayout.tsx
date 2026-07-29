import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-full w-full bg-backgroundLight-200 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5">
      <div className="mx-auto w-full max-w-[1600px]">
        <Outlet />
      </div>
    </div>
  )
}
