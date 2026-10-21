import type { Cents, Cycle, DocId, IsoDate, IsoDateTime } from './common'

export type Confidence = 'high' | 'medium' | 'low'
export type DetectedStatus = 'pending' | 'confirmed' | 'dismissed'

/** users/{uid}/detected/{id}. Confirmed items always become subscriptions, never bills. */
export interface DetectedSubscription {
  merchant: string // normalized
  catalogId?: DocId
  amountCents: Cents
  cycle: Cycle
  nextDueDate: IsoDate // always rolled forward to today or later
  categoryId?: DocId
  confidence: Confidence
  score: number // 0..1
  transactionIds: string[]
  status: DetectedStatus
  mergedIntoId?: DocId // existing subscription, when merged
  createdAt: IsoDateTime
}
