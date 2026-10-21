import type { IsoDateTime } from './common'

/** users/{uid} */
export interface UserProfile {
  email: string
  displayName?: string
  currency: string // ISO 4217, e.g. "EUR"
  reminderDaysBefore: number // 0 = on the day
  emailReminders: boolean
  createdAt: IsoDateTime
}
