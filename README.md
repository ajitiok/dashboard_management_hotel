# Hotel Management Dashboard

React + TypeScript hotel management dashboard for guests, rooms, orders, and restaurant bookings.

Built with functional components, typed domain models, and deliberate separation between UI, async data, and client state.

## Tech Stack

| Library | Role |
| --- | --- |
| **Bun** | Package manager, scripts, and unit test runner |
| **Vite + React 19 + TypeScript** | App shell and type-safe UI |
| **Tailwind CSS** | Styling / design tokens |
| **React Router** | Client routing and protected routes |
| **TanStack Query** | Server/async state (fetch, cache, refetch, optimistic updates) |
| **Zustand** | Client/UI state (auth session) |
| **Sonner** | Toast notifications |
| **Highcharts** | Dashboard top-services chart |
| **Lucide React** | Icons |
| **date-fns** | Date formatting |
| **clsx** | Conditional class names |

## Getting Started

```bash
bun install
bun run dev
```

Demo login:

- Email: `admin@inntegrate.com`
- Password: `password123`

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start development server |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run oxlint |
| `bun test` | Run unit tests |

## Architecture Decisions

### Component structure

```
src/
  app/           # Providers, router, layouts, auth guard
  pages/         # Route-level composition (wires data + UI)
  components/
    core/        # Reusable primitives (Button, Badge)
    common/      # Shared page chrome (TopNav, LoadingData, filters)
    condition/   # Loading / empty / error state helpers
    <domain>/    # Feature UI (dashboard, guests, orders, rooms, restaurant)
  features/      # Domain types + pure helpers (e.g. order SLA, approval rules)
  services/      # Async data access (`*.service.ts`), currently mock-backed
  store/         # Zustand stores for client state
  mocks/         # In-memory mock data / mutable stores
  utils/         # Cross-cutting helpers (cn, dates, analytics)
  constants/     # Routes, query keys, filter options
```

- **Pages** compose screens and own page-level UI state (filters, drawers).
- **Components** stay presentational where possible and receive typed props.
- **Features** hold domain types/rules without coupling to React.
- **Services** isolate data fetching/mutations so UI does not talk to mocks directly.

### State management

| Kind of state | Tool | Examples |
| --- | --- | --- |
| Server / async | TanStack Query | Dashboard metrics, guests, orders, rooms, restaurant |
| Client / session | Zustand | Auth user + token; theme preference |
| Local UI | `useState` | Drawer open, confirm dialogs, mobile nav, tab selection |
| URL state | React Router search params | Orders search, filters, sort, pagination |

**Why this split**

- Async lists need caching, loading/error states, and invalidation → Query.
- Auth must survive refresh and stay outside query cache → Zustand + `persist`.
- Filters that should be shareable/bookmarkable → URL search params.
- Ephemeral UI (modals, toggles) stays local.

### SOLID in practice

- **S** — Pages orchestrate; tables/drawers/charts handle one UI concern each.
- **O** — Order status transitions live in typed maps (`ORDER_STATUS_TRANSITIONS`) so new actions extend rules without rewriting screens.
- **L** — Shared state helpers (`DataQueryStates`, `EmptyState`, `ErrorState`) work the same across domains.
- **I** — Domain props stay narrow (`OrdersTable` only needs orders + select handler).
- **D** — UI depends on service functions + types, not mock internals; mocks sit behind `services/`.

### Notable product behaviors

- Auth-protected routes (`/login` is public; app routes require session).
- Orders: search/filter/sort, SLA highlight for overdue `New` orders, detail drawer lifecycle actions.
- Extra Bed **Pending Approval** when quantity exceeds room capacity (approve/reject).
- Simulated realtime new-order toasts while logged in.
- Optimistic order status updates with rollback on failure.
- Shared loading UI (`LoadingData`) and error retry via demo failure toggle / `?fail=1`.
- Dark mode toggle (persisted) via TopNav / Login.

## Naming Conventions

| Layer | Convention | Example |
| --- | --- | --- |
| Components | PascalCase `.tsx` | `OrdersTable.tsx` |
| Services | kebab-case + `.service.ts` | `fetch-orders.service.ts` |
| Stores | kebab-case + `.store.ts` | `auth.store.ts` |
| Pages | PascalCase | `DashboardPage.tsx` |
| Aliases | `@/` → `src/` | `@/components/core/Button` |

## Core UI

```tsx
import Button from '@/components/core/Button'
import Badge from '@/components/core/Badge'
```
