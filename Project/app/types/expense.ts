import type { Cents, DocId, IsoDate, IsoDateTime } from './common'

export type ExpenseSource = 'manual' | 'bill' | 'subscription'

/** users/{uid}/expenses/{id} */
export interface Expense {
  amountCents: Cents
  date: IsoDate
  categoryId: DocId
  description?: string
  receiptUrl?: string
  source: ExpenseSource
  billId?: DocId // set when source = 'bill'
  subscriptionId?: DocId // set when source = 'subscription'
  createdAt: IsoDateTime
}
