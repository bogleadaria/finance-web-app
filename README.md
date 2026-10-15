# App: Development Plan

Internal developer documentation. App is a web app that shows recurring payments (subscriptions and bills), expenses and budgets on one dashboard. Stack: Nuxt 3 (Vue 3), TypeScript, Firebase (Auth, Firestore, Storage, Cloud Functions, Hosting).

| Developer | Area |
|-----------|------|
| **Daria** | App shell, UI for accounts and subscriptions, dashboard, notifications, platform |
| **Cristi** | Expenses, budgets, Smart Import screens |
| **Geo** | Logic and backend: auth, subscriptions, recurrence, Smart Import detection, Cloud Functions, security rules |

## Work split

- **Geo does not touch Nuxt or any UI.** He delivers plain TypeScript service modules (no Vue, no Nuxt) in `services/`, `utils/` and `functions/src/smart-import/`, tested with Vitest and the Firebase Emulator Suite. Everything he builds can be finished without Daria or Cristi.
- **Daria and Cristi build all the screens.** They wrap Geo's services in composables and build the pages.
- Daria's Part 1 is independent of everyone.

### Geo's public interface (what Daria and Cristi call)

| Module | Provides |
|--------|----------|
| `services/authService` | `register`, `login`, `loginWithGoogle`, `logout`, `resetPassword`, `onAuthChange` |
| `services/subscriptionService` | CRUD, `subscribeToSubscriptions` (onSnapshot), `markBillAsPaid`, `uploadLogo`, `uploadReceipt` |
| `utils/recurrence` | `getNextDueDate(date, cycle)`, `normalizeToMonthly(sub)` |
| `services/importService` | `importTransactions(source)`, `detectSubscriptions(transactions)` |
| `services/detectedService` | `subscribeToDetected`, `confirm`, `dismiss`, `confirmAll`, `merge` |
| `types/` | Shared types for every Firestore document (frozen) |

---

## Daria's Track

### Part 1: Independent
- [ ] Layout (sidebar, navbar, responsive), theme and shared components (Button, Modal, Card, Toast)
- [ ] Set up Cloud Functions and the email provider (Resend or SendGrid) early
- [ ] Seed script with test data (subscriptions, expenses, budgets) and the Firestore index definitions
- [ ] Dashboard charts (category donut and monthly trend) on seed data
- [ ] Dashboard cards (spending this month, remaining budget, active subscription cost monthly and yearly) and empty state, on seed data
- [ ] Upcoming bills list sorted by due date, overdue items highlighted, on seed data
- [ ] CI pipeline (GitHub Actions): lint, tests and build on every pull request
- [ ] Deploy to Firebase Hosting
- [ ] `onUserCreate` Cloud Function that sends the welcome email
- [ ] Daily scheduled Cloud Function that emails bill reminders and logs each one in `notifications` to prevent duplicates, tested on seed data
- [ ] Stretch: budget alert email at 100%

### Part 2: Uses Geo's services
- [ ] `useAuth()` composable wrapping `authService`, and the route middleware
- [ ] Auth pages: register, login, Google login, password reset
- [ ] `useSubscriptions()` composable wrapping `subscriptionService`
- [ ] Subscription pages: list, add and edit form with validation, delete confirmation, mark as paid, logo and receipt upload with preview, cancelled status
- [ ] Profile and settings page (reminder settings)
- [ ] Switch the dashboard from seed data to the real composables
- [ ] Dashboard banner for detected subscriptions waiting for review, linking to Cristi's review screen
- [ ] Firestore indexes and performance check
- [ ] End-to-end test of the welcome and reminder emails
- [ ] Test UC-1.1 to UC-1.4 UI flows and UC-3.1 to UC-3.4

---

## Cristi's Track

- [ ] Category model with default categories seeded on first login, and the categories screen (add, rename, delete custom ones with color and icon, replacement category when deleting one in use)
- [ ] Expense CRUD: form with Zod validation, real-time list, delete confirmation (built against a hardcoded test user id first)
- [ ] Switch to Daria's real `useAuth()` once it is merged
- [ ] Receipt photo upload on expenses
- [ ] Expense filters and search: date range, category, amount, text, sorting
- [ ] `useExpenses(range)` composable (includes expenses with `source = bill` created by Geo's `markBillAsPaid`)
- [ ] Budgets: monthly limit per category and spent-against-limit calculation, `useBudgets(month)` composable
- [ ] Budget progress screen with progress bars (green below 80%, yellow from 80%, red at 100%)
- [ ] `useDetectedSubscriptions()` composable wrapping Geo's `detectedService`
- [ ] Smart Import screen: CSV upload, bank sandbox and real bank source, consent text, disconnect button, delete-imported-transactions button, list of invalid rows
- [ ] Review screen: detected items with confidence label, edit, confirm or dismiss one or all, merge when already tracked
- [ ] Empty states, loading states and error handling on every screen
- [ ] Fix bugs and validation edge cases
- [ ] Test UC-1.5, UC-1.6 and UC-2.1 to UC-2.4 UI flows

---

## Geo's Track

### G1. Setup
- [ ] Nuxt 3 scaffold (Nuxt UI, Pinia, VueFire, TypeScript) and folder structure
- [ ] Create the Firebase project (Auth, Firestore, Storage, Functions), enable the Blaze plan and add Cristi and Daria as members
- [ ] Write the shared types in `types/` from the data model and freeze them
- [ ] Set up TypeScript, Vitest and the Firebase Emulator Suite for his folders (`services/`, `utils/`, `functions/src/smart-import/`), with his own test data
- [ ] Define a fixed list of default category ids as a constant, so subscriptions do not depend on Cristi's categories

### G2. Foundation (tag `v0.1-foundation`)
- [ ] `authService`: email/password register and login, Google login, logout, password reset, `onAuthChange`
- [ ] `subscriptionService`: create, read, update, delete and `subscribeToSubscriptions` with onSnapshot, including the cancelled status
- [ ] Recurrence engine `getNextDueDate()` for weekly, monthly and yearly cycles with month-end handling (Jan 31 becomes Feb 28), with unit tests
- [ ] `normalizeToMonthly(sub)`
- [ ] `markBillAsPaid()`: in one batched write, add the `payments` entry, set the next due date and create the matching expense (`source = bill`, `billId`) following the frozen data model
- [ ] `uploadLogo` and `uploadReceipt` to Firebase Storage: type and size checks, replacing a file deletes the old one
- [ ] README section documenting the public interface above

### G3. Smart Import
- [ ] Merchant catalog: JSON file of about 50 services (names, aliases, logos, categories, cancel links) and a seed script that loads it into the `catalog` collection
- [ ] `detectSubscriptions(transactions)` as a pure function: normalize merchants, match against the catalog, check regularity (about 7, 30 or 365 days with tolerance; at least 3 charges for weekly and monthly, 2 for yearly), score confidence, calculate next due date, with unit tests
- [ ] Common transaction shape (date, amount in cents, raw merchant) shared by all adapters
- [ ] CSV adapter and `importTransactions(source)`: invalid rows reported, duplicates prevented with `externalId`
- [ ] `detectedService`: save results as pending, `confirm` creates a subscription with `source = detected`, `dismiss` is remembered and not proposed again, `confirmAll`, `merge` when already tracked
- [ ] Bank sandbox adapter
- [ ] Real bank account (Enable Banking) through a Cloud Function in `functions/src/smart-import/`, deployed on its own with `firebase deploy --only functions:<name>`; tokens only in Cloud Functions secrets, never in the browser or Firestore
- [ ] Consent handling, disconnect and delete-imported-transactions functions
- [ ] Sample bank statement CSV for testing
- [ ] Stretch: Gmail receipt scan as one more adapter

### G4. Security rules and testing
- [ ] Firestore and Storage security rules for all collections, written from the frozen data model (owner-only access, read-only `catalog`)
- [ ] Rules tests in the emulator
- [ ] Unit and emulator tests for every service, plus edge cases (month-end dates, invalid amounts, price changes, yearly plans)

---

## Technical Milestones

- [ ] `v0.1-foundation`: Geo's auth and subscription services merged
- [ ] `v0.2`: auth, subscription, expense and budget screens working on the deployed app
- [ ] All 14 use cases work end to end
- [ ] Everything merged on `main`, deployed, and tested by someone other than its author
- [ ] Feature freeze and tag `v1.0`
