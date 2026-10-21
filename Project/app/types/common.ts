/** Date only, "YYYY-MM-DD". Used for due dates and payment document ids. Compare as strings. */
export type IsoDate = string

/** Full timestamp, ISO 8601 UTC, e.g. "2026-11-05T09:30:00.000Z". */
export type IsoDateTime = string

/** Money is always integer cents. */
export type Cents = number

export type Cycle = 'weekly' | 'monthly' | 'yearly'

export type RecurringStatus = 'active' | 'cancelled'

/** Every document id is a string; ids are not stored inside the document body. */
export type DocId = string
