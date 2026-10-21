import type { DocId, IsoDate, IsoDateTime } from './common'

/** users/{uid}/notifications/{id}. Id = `${type}_${refId}_${dueDate}` to prevent duplicate emails. */
export interface Notification {
  type: 'bill' | 'subscription'
  refId: DocId // bill or subscription id
  dueDate: IsoDate
  sentAt: IsoDateTime
}
