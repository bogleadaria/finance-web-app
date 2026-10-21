import { describe, it, expect } from 'vitest'
import type { Subscription, Bill, Expense } from '~~/types'

describe('backend test setup', () => {
  it('runs in UTC', () => {
    expect(process.env.TZ).toBe('UTC')
    expect(new Date('2026-11-05T00:00:00Z').getUTCDate()).toBe(5)
  })

  it('resolves ~~ and the shared types', () => {
    const sub: Subscription = {
      name: 'Netflix', amountCents: 1599, cycle: 'monthly', nextDueDate: '2026-11-05',
      categoryId: 'entertainment', status: 'active', source: 'manual', createdAt: '2026-10-21T00:00:00.000Z',
    }
    const bill: Bill = {
      name: 'Rent', cycle: 'monthly', nextDueDate: '2026-11-01',
      categoryId: 'housing', status: 'active', createdAt: '2026-10-21T00:00:00.000Z',
    }
    const exp: Expense = {
      amountCents: sub.amountCents, date: sub.nextDueDate, categoryId: sub.categoryId,
      source: 'subscription', subscriptionId: 'sub1', createdAt: '2026-11-05T00:00:00.000Z',
    }
    expect(exp.source).toBe('subscription')
    expect(bill.expectedAmountCents).toBeUndefined()
  })
})
