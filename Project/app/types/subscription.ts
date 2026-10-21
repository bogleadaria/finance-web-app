import type { Cents, Cycle, DocId, IsoDate, IsoDateTime, RecurringStatus } from './common'

/** users/{uid}/subscriptions/{id} */
export interface Subscription {
  name: string
  amountCents: Cents // fixed
  cycle: Cycle
  nextDueDate: IsoDate // must be today or later on create/edit
  categoryId: DocId
  status: RecurringStatus
  cancelledAt?: IsoDateTime
  logoUrl?: string
  notes?: string
  source: 'manual' | 'detected'
  lastAutoPaidAt?: IsoDateTime
  createdAt: IsoDateTime
}

/**
 * users/{uid}/subscriptions/{id}/payments/{id}
 * Document id = the due date ("2026-11-05"), which makes autoPay idempotent.
 */
export interface SubscriptionPayment {
  paidAt: IsoDateTime
  amountCents: Cents
  expenseId: DocId
  auto: true
}
