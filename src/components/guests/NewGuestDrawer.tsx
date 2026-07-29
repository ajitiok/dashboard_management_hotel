import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/core/Button'
import { QUERY_KEYS } from '@/constants'
import {
  GUEST_ROOM_TYPES,
  type CreateGuestInput,
} from '@/features/guests/types/guest.types'
import { createGuest } from '@/services/guests/create-guest.service.ts'
import { trackEvent } from '@/utils/analytics'

type NewGuestDrawerProps = {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

function defaultForm(): CreateGuestInput {
  const checkIn = new Date()
  checkIn.setDate(checkIn.getDate() + 1)
  const checkOut = new Date(checkIn)
  checkOut.setDate(checkOut.getDate() + 3)

  return {
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    roomType: GUEST_ROOM_TYPES[0],
    nationality: '',
    checkIn: toDateInputValue(checkIn),
    checkOut: toDateInputValue(checkOut),
  }
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function NewGuestDrawer({
  open,
  onClose,
  onCreated,
}: NewGuestDrawerProps) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<CreateGuestInput>(defaultForm)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(defaultForm())
      setFormError(null)
    }
  }, [open])

  const mutation = useMutation({
    mutationFn: async (input: CreateGuestInput) => {
      const response = await createGuest(input)
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to create guest')
      }
      return response.data
    },
    onSuccess: (guest) => {
      toast.success(`Guest ${guest.name} added`)
      trackEvent('guest.created', {
        guestId: guest.id,
        roomNumber: guest.roomNumber,
      })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.guests })
      onCreated?.()
      onClose()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to create guest'
      setFormError(message)
      toast.error(message)
    },
  })

  if (!open) {
    return null
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    mutation.mutate(form)
  }

  const updateField =
    (key: keyof CreateGuestInput) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement
      >,
    ) => {
      setForm((current) => ({ ...current, [key]: event.target.value }))
    }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close new guest form"
        className="absolute inset-0 bg-backgroundDark-300/40"
        onClick={onClose}
        disabled={mutation.isPending}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-guest-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-base-100 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <p className="text-sub3 font-medium text-base-500">Guests</p>
            <h2
              id="new-guest-title"
              className="text-h5 font-bold text-base-900"
            >
              New guest
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={mutation.isPending}
            className="rounded-full p-2 text-base-500 hover:bg-base-200 hover:text-base-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="flex flex-1 flex-col overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <Field
              id="guest-name"
              label="Full name"
              value={form.name}
              onChange={updateField('name')}
              placeholder="Alex Trie"
              required
            />
            <Field
              id="guest-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="alex@example.com"
              required
            />
            <Field
              id="guest-phone"
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={updateField('phone')}
              placeholder="+1 202 555 0147"
              required
            />
            <Field
              id="guest-nationality"
              label="Nationality"
              value={form.nationality}
              onChange={updateField('nationality')}
              placeholder="USA"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="guest-room"
                label="Room number"
                value={form.roomNumber}
                onChange={updateField('roomNumber')}
                placeholder="101"
                required
              />
              <div>
                <label
                  htmlFor="guest-room-type"
                  className="mb-1.5 block text-sub3 font-medium text-base-800"
                >
                  Room type
                </label>
                <select
                  id="guest-room-type"
                  value={form.roomType}
                  onChange={updateField('roomType')}
                  className="w-full rounded-xl border border-border bg-base-100 px-3 py-2.5 text-sub2 outline-none focus:border-primary-500"
                  required
                >
                  {GUEST_ROOM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="guest-check-in"
                label="Check-in"
                type="date"
                value={form.checkIn}
                onChange={updateField('checkIn')}
                required
              />
              <Field
                id="guest-check-out"
                label="Check-out"
                type="date"
                value={form.checkOut}
                onChange={updateField('checkOut')}
                required
              />
            </div>

            {formError ? (
              <p className="rounded-xl bg-softColors-6 px-3 py-2 text-sub3 text-danger-700">
                {formError}
              </p>
            ) : null}
          </div>

          <div className="flex gap-2 border-t border-border px-5 py-4">
            <Button
              type="button"
              variant="secondary"
              size="m"
              full
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="m"
              full
              loading={mutation.isPending}
              className="rounded-xl!"
            >
              Add guest
            </Button>
          </div>
        </form>
      </aside>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  id: string
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sub3 font-medium text-base-800"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-border bg-base-100 px-3 py-2.5 text-sub2 outline-none focus:border-primary-500"
      />
    </div>
  )
}
