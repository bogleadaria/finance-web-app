# App: Development Plan

Internal developer documentation. App is a web app that shows recurring payments (subscriptions and bills), expenses and budgets on one dashboard. Stack: Nuxt 3 (Vue 3), TypeScript, Firebase (Auth, Firestore, Storage, Cloud Functions, Hosting).

🔴 **Subscriptions vs bills.** They have separate pages, separate entries in the sidebar and navbar, separate boxes on the dashboard, and separate Firestore collections (`subscriptions` and `bills`).

| 🔴 | Subscription (Netflix, Spotify, gym) | Bill (rent, electricity, phone, insurance) |
|---|---|---|
| 🔴 Who marks it as paid | The system, automatically, on the due date | The user, by hand, with a button |
| 🔴 Amount | Fixed `amountCents` | Optional estimate (`expectedAmountCents`); the real amount is entered when paying |
| 🔴 Can be overdue | No | Yes (highlighted on the dashboard) |
| 🔴 Expense created | `source = subscription` | `source = bill` |

| Developer | Area |
|-----------|------|
| **Daria** | UI only: app shell, pages for accounts, subscriptions and bills, dashboard |
| **Cristi** | Expenses, budgets, Smart Import screens |
| **Geo** | Nuxt scaffold (pushed), Firebase setup and everything backend: auth, subscriptions, bills, recurrence, automatic subscription payment, Smart Import detection, Cloud Functions (emails, scheduled jobs), seed data, indexes, security rules |

## Work split

- **Geo owns the Nuxt scaffold (already pushed), all Firebase setup and all backend.** He delivers plain TypeScript service modules (no Vue) in `services/` and `utils/`, plus all Cloud Functions in `functions/`, tested with Vitest and the Firebase Emulator Suite. He builds no screens. Everything he builds can be finished without Daria or Cristi.
- **Daria and Cristi build all the screens.** They wrap Geo's services in composables and build the pages.
- Daria's Part 1 needs no backend: it is built on mock data until Geo's seed script is merged.

### Geo's public interface (what Daria and Cristi call)

| Module | Provides |
|--------|----------|
| `services/authService` | `register`, `login`, `loginWithGoogle`, `logout`, `resetPassword`, `onAuthChange` |
| `services/subscriptionService` | 🔴 CRUD, `subscribeToSubscriptions` (onSnapshot), `uploadLogo`, `uploadReceipt` (🔴 no more manual "mark as paid": subscriptions are paid automatically) |
| 🔴 `services/billService` | 🔴 CRUD, `subscribeToBills` (onSnapshot), `markBillAsPaid(id, amountPaidCents, paidAt?)`, `uploadLogo`, `uploadReceipt` |
| 🔴 `utils/autoPay` | 🔴 `processDueSubscriptions(now)`: pays every active subscription that is due (payment entry, next due date, matching expense). Called by Geo's daily Cloud Function |
| `utils/recurrence` | `getNextDueDate(date, cycle)`, `normalizeToMonthly(sub)` |
| `services/importService` | `importTransactions(source)`, `detectSubscriptions(transactions)` |
| `services/detectedService` | `subscribeToDetected`, `confirm`, `dismiss`, `confirmAll`, `merge` |
| `types/` | Shared types for every Firestore document (frozen) |

### 🔴 How the automatic subscription payment works

🔴 - Once a day, Geo's scheduled Cloud Function calls `processDueSubscriptions(now)`.
🔴 - For every **active** subscription with `nextDueDate <= today`, in one batched write: add a `payments` entry (`auto: true`), create the matching expense (`source = subscription`, `subscriptionId`), set the next due date with `getNextDueDate`, set `lastAutoPaidAt`.
🔴 - If the function was down for some days, it loops and **catches up** every missed due date.
🔴 - It is **idempotent**: the payment document id is built from the due date (for example `2026-11-05`), so running it twice never creates a duplicate.
🔴 - Cancelled subscriptions are never charged.
🔴 - A subscription's `nextDueDate` must be today or later when created or edited, and detected subscriptions get their date rolled forward to today or later, so the system never charges for the past.
🔴 - The app assumes the subscription was really charged; checking with the bank is out of scope. If the price changes or the subscription stops, the user edits or cancels it.

### 🔴 Data model changes (frozen once agreed by all three)

| 🔴 Collection path | Change |
|---|---|
| 🔴 `users/{uid}/subscriptions/{id}` | Same fields as before, plus `lastAutoPaidAt`. Paid automatically |
| 🔴 `users/{uid}/bills/{id}` | **New.** `name`, `expectedAmountCents` (optional), `cycle`, `nextDueDate`, `categoryId`, `status` (active, cancelled), `cancelledAt`, `logoUrl`, `notes`, `createdAt` |
| 🔴 `users/{uid}/subscriptions/{id}/payments/{id}` | `paidAt`, `amountCents`, `expenseId`, `auto` (true). Document id built from the due date |
| 🔴 `users/{uid}/bills/{id}/payments/{id}` | **New.** `paidAt`, `amountCents` (the amount really paid), `expenseId` |
| 🔴 `users/{uid}/expenses/{id}` | `source` is now `manual`, `bill` or `subscription`; new field `subscriptionId` next to `billId` |
| 🔴 `users/{uid}/notifications/{id}` | `type` is now `bill` or `subscription` |

---

## Daria's Track

### Part 1: Independent (mock data, no backend)
- [ ] 🔴 Layout (sidebar, navbar, responsive) with **separate Subscriptions and Bills entries in the sidebar and navbar**, theme and shared components (Button, Modal, Card, Toast)
- [ ] Dashboard charts (category donut and monthly trend) on mock data
- [ ] 🔴 Dashboard cards (spending this month, remaining budget, active subscription cost monthly and yearly, **plus a separate card for bills this month: paid so far and still due**) and empty state, on mock data
- [ ] 🔴 **Two separate upcoming boxes** on the dashboard, on mock data: **bills** sorted by due date with overdue items highlighted, and **subscription charges** sorted by date (never overdue)
- [ ] CI pipeline (GitHub Actions): lint, tests and build on every pull request

### Part 2: Uses Geo's services
- [ ] `useAuth()` composable wrapping `authService`, and the route middleware
- [ ] Auth pages: register, login, Google login, password reset
- [ ] `useSubscriptions()` composable wrapping `subscriptionService`
- [ ] 🔴 `useBills()` composable wrapping `billService`
- [ ] 🔴 Subscription pages: list, add and edit form with validation (**next due date must be today or later**), delete confirmation, logo and receipt upload with preview, cancelled status. **No "mark as paid" button: show a "paid automatically" status and the date of the last automatic payment**
- [ ] 🔴 **Bills pages (new):** list, add and edit form with validation (amount is an optional estimate), delete confirmation, **"Mark as paid" dialog asking for the amount paid (pre-filled with the estimate) and the payment date**, logo and receipt upload with preview, cancelled status
- [ ] Profile and settings page (reminder settings)
- [ ] 🔴 Switch the dashboard from mock data to the real composables (`useSubscriptions()` and `useBills()`, each in its own box)
- [ ] Dashboard banner for detected subscriptions waiting for review, linking to Cristi's review screen
- [ ] 🔴 Test UC-1.1 to UC-1.4 UI flows (**UC-1.2 on both Subscriptions and Bills screens, UC-1.3 for the manual bill payment and the automatic subscription payment**) and UC-3.1 to UC-3.4

---

## Cristi's Track

- [ ] Category model with default categories seeded on first login, and the categories screen (add, rename, delete custom ones with color and icon, replacement category when deleting one in use)
- [ ] Expense CRUD: form with Zod validation, real-time list, delete confirmation (built against a hardcoded test user id first)
- [ ] Switch to Daria's real `useAuth()` once it is merged
- [ ] Receipt photo upload on expenses
- [ ] Expense filters and search: date range, category, amount, text, sorting
- [ ] 🔴 `useExpenses(range)` composable (includes expenses with `source = bill` created by Geo's `markBillAsPaid` **and expenses with `source = subscription` created by the automatic subscription payment**)
- [ ] 🔴 **The expenses list shows the source of each expense (manual, bill or subscription)**
- [ ] Budgets: monthly limit per category and spent-against-limit calculation, `useBudgets(month)` composable
- [ ] Budget progress screen with progress bars (green below 80%, yellow from 80%, red at 100%)
- [ ] `useDetectedSubscriptions()` composable wrapping Geo's `detectedService`
- [ ] Smart Import screen: CSV upload, bank sandbox and real bank source, consent text, disconnect button, delete-imported-transactions button, list of invalid rows
- [ ] Review screen: detected items with confidence label, edit, confirm or dismiss one or all, merge when already tracked (🔴 confirmed items are always subscriptions, never bills)
- [ ] Empty states, loading states and error handling on every screen
- [ ] Fix bugs and validation edge cases
- [ ] 🔴 Test UC-1.5, UC-1.6 and UC-2.1 to UC-2.4 UI flows (**UC-2.1: expenses created by bill payments and automatic subscription payments appear in the list**)

---

## Geo's Track

### G1. Setup
- [x] Nuxt 3 scaffold (Nuxt UI, Pinia, VueFire, TypeScript) and folder structure, pushed
- [x] Shared `firebase.json` with the Emulator Suite (Auth, Firestore, Storage, Functions) and a demo project id, committed so all three run the same local setup. No real Firebase project, no Blaze plan and no card during development
- [ ] 🔴 Write the shared types in `types/` from the data model (**including `Bill`, bill `Payment`, `source = subscription` on expenses and `subscriptionId`**) and freeze them
- [ ] Set up TypeScript and Vitest for `services/`, `utils/` and `functions/`
- [ ] 🔴 Seed script with test data (subscriptions, **bills**, expenses, budgets, **including a subscription due today to show the automatic payment**) and the Firestore index definitions. Merge it early so Daria and Cristi can switch from mock data
- [ ] Define a fixed list of default category ids as a constant, so subscriptions and bills do not depend on Cristi's categories

### G2. Foundation (tag `v0.1-foundation`)
- [ ] `authService`: email/password register and login, Google login, logout, password reset, `onAuthChange`
- [ ] 🔴 `subscriptionService`: create, read, update, delete and `subscribeToSubscriptions` with onSnapshot, including the cancelled status (**validation: `nextDueDate` today or later**)
- [ ] 🔴 **`billService` (new): create, read, update, delete and `subscribeToBills` with onSnapshot, including the cancelled status**
- [ ] Recurrence engine `getNextDueDate()` for weekly, monthly and yearly cycles with month-end handling (Jan 31 becomes Feb 28), with unit tests
- [ ] `normalizeToMonthly(sub)`
- [ ] 🔴 `markBillAsPaid(id, amountPaidCents, paidAt?)` **in `billService`**: in one batched write, add the `payments` entry **with the amount really paid (zero or less is rejected)**, set the next due date and create the matching expense (`source = bill`, `billId`, **amount = amount paid**) following the frozen data model
- [ ] 🔴 **`processDueSubscriptions(now)` in `utils/autoPay` (new): for every active subscription due today or earlier, in one batched write add the `payments` entry (`auto: true`, id built from the due date), create the matching expense (`source = subscription`, `subscriptionId`), set the next due date and `lastAutoPaidAt`. Catches up missed days, safe to run twice, skips cancelled subscriptions**
- [ ] `uploadLogo` and `uploadReceipt` to Firebase Storage (🔴 for subscriptions and bills): type and size checks, replacing a file deletes the old one
- [ ] 🔴 README section documenting the public interface above (**including `billService` and `processDueSubscriptions`**)

### G3. Smart Import
- [ ] Merchant catalog: JSON file of about 50 services (names, aliases, logos, categories, cancel links) and a seed script that loads it into the `catalog` collection
- [ ] 🔴 `detectSubscriptions(transactions)` as a pure function: normalize merchants, match against the catalog, check regularity (about 7, 30 or 365 days with tolerance; at least 3 charges for weekly and monthly, 2 for yearly), score confidence, calculate next due date (**always rolled forward to today or later**), with unit tests
- [ ] Common transaction shape (date, amount in cents, raw merchant) shared by all adapters
- [ ] CSV adapter and `importTransactions(source)`: invalid rows reported, duplicates prevented with `externalId`
- [ ] 🔴 `detectedService`: save results as pending, `confirm` creates a subscription with `source = detected` (**it becomes a normal automatically paid subscription**), `dismiss` is remembered and not proposed again, `confirmAll`, `merge` when already tracked
- [ ] Bank sandbox adapter
- [ ] Real bank account (Enable Banking) through a Cloud Function in `functions/src/smart-import/`, run and tested in the emulator only (deployment is covered in the Deployment section); tokens only in Cloud Functions secrets, never in the browser or Firestore
- [ ] Consent handling, disconnect and delete-imported-transactions functions
- [ ] Sample bank statement CSV for testing
- [ ] Stretch: Gmail receipt scan as one more adapter

### G4. Cloud Functions and notifications
- [ ] Set up Cloud Functions in the emulator and the email provider (Resend or SendGrid, free tier, API key kept in a local env file)
- [ ] `onUserCreate` Cloud Function that sends the welcome email
- [ ] 🔴 Daily scheduled Cloud Function that emails reminders **for bills and subscriptions** (for a subscription the email says it will be charged automatically) and logs each one in `notifications` to prevent duplicates, triggered manually in the emulator
- [ ] 🔴 **In the same daily run, call `processDueSubscriptions(now)`** so due subscriptions are paid automatically
- [ ] Stretch: budget alert email at 100%
- [ ] 🔴 End-to-end test of the welcome and reminder emails **and of the automatic subscription payment**
- [ ] Firestore indexes and performance check

### G5. Security rules and testing
- [ ] 🔴 Firestore and Storage security rules for all collections (**including `bills` and `bills/{id}/payments`**), written from the frozen data model (owner-only access, read-only `catalog`)
- [ ] Rules tests in the emulator
- [ ] 🔴 Unit and emulator tests for every service, plus edge cases (month-end dates, invalid amounts, price changes, yearly plans, **several missed days of automatic payment, running `processDueSubscriptions` twice, cancelled subscriptions, a bill paid with an amount different from the estimate**)

---

## Technical Milestones

- [ ] 🔴 `v0.1-foundation`: Geo's auth, subscription **and bill** services and the automatic payment logic merged
- [ ] 🔴 `v0.2`: auth, subscription, **bill**, expense and budget screens working locally on the emulators
- [ ] All 14 use cases work end to end
- [ ] 🔴 Everything merged on `main` and tested by someone other than its author (**including a subscription that is paid automatically and a bill paid by hand**)
- [ ] Feature freeze and tag `v1.0`

---

## Deployment (only at the end, and only if required)

Nothing is deployed and nobody enables the Blaze plan or enters card details while developing. Auth, Firestore, Storage and Functions all run on the Emulator Suite. Only when the app is finished and deployment is required:

- [ ] Geo creates the real Firebase project
- [ ] Geo enables the Blaze plan (required for Cloud Functions and Cloud Storage)
- [ ] Deploy rules, indexes, functions and the static Nuxt build to Firebase Hosting
- [ ] Run the catalog seed script against the real project
- [ ] Smoke-test every use case on the deployed app
