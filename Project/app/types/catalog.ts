import type { Cycle } from './common'

/** catalog/{id}. Read-only for clients. */
export interface CatalogEntry {
  name: string
  aliases: string[]
  logoUrl?: string
  defaultCategoryId: string
  typicalCycle?: Cycle
  cancelUrl?: string
}
