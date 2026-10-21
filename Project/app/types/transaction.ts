import type { Cents, IsoDate } from './common'

/** Common shape produced by every import adapter. */
export interface Transaction {
  externalId: string // used to prevent duplicates
  date: IsoDate
  amountCents: Cents // positive = money out
  rawMerchant: string
}

/** users/{uid}/transactions/{id}: imported, kept so they can be deleted on request. */
export interface StoredTransaction extends Transaction {
  importedFrom: 'csv' | 'sandbox' | 'bank'
}
