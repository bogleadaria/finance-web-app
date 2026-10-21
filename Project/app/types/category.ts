import type { IsoDateTime } from './common'

/** users/{uid}/categories/{id}. Default categories use ids from DEFAULT_CATEGORY_IDS (G1.6). */
export interface Category {
  name: string
  color: string // hex, e.g. "#4f46e5"
  icon: string
  isDefault: boolean
  createdAt: IsoDateTime
}
