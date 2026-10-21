import type { Cents, Cycle, DocId, IsoDate, IsoDateTime, RecurringStatus } from './common'

/** users/{uid}/bills/{id} */
export interface Bill {
  name: string
  expectedAmountCents?: Cents // optional estimate
  cycle: Cycle
  nextDueDate: IsoDate // may be in the past: that is what "overdue" means
  categoryId: DocId
  status: RecurringStatus
  cancelledAt?: IsoDateTime
  logoUrl?: string
  notes?: string
  createdAt: IsoDateTime
}

/** users/{uid}/bills/{id}/payments/{id} (auto-generated id) */
export interface BillPayment {
  paidAt: IsoDateTime
  amountCents: Cents // the amount really paid, must be > 0
  expenseId: DocId
}
