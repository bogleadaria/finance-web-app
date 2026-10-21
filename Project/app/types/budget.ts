import type { Cents, DocId } from './common'

/** users/{uid}/budgets/{id} */
export interface Budget {
  categoryId: DocId
  month: string // "YYYY-MM"
  limitCents: Cents
}
