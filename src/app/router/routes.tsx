import { Navigate, type RouteObject } from 'react-router-dom'
import { AppLayout } from '@/app/layouts/AppLayout'
import { ProtectedRoute } from '@/app/router/ProtectedRoute'
import {
  DashboardPage,
  LoginPage,
  NotFoundPage,
  OrdersPage,
  GuestsPage,
  RoomsPage,
  RoomDetailPage,
  RestaurantPage,
} from '@/pages'
import { ROUTES } from '@/constants'

export const routes: RouteObject[] = [
  {
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    path: ROUTES.root,
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.dashboard} replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'guests',
            element: <GuestsPage />,
          },
          {
            path: 'orders',
            element: <OrdersPage />,
          },
          {
            path: 'reservations',
            element: <Navigate to={ROUTES.orders} replace />,
          },
          {
            path: 'rooms',
            element: <RoomsPage />,
          },
          {
            path: 'rooms/:roomId',
            element: <RoomDetailPage />,
          },
          {
            path: 'restaurant',
            element: <RestaurantPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
