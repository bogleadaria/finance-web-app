import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Tests that need the Emulator Suite (services, autoPay, security rules): `npm run test:emulator`.
export default defineConfig({
  resolve: { alias: { '~~': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    name: 'emulator',
    environment: 'node',
    globals: true,
    include: ['{services,utils,functions/src}/**/*.emulator.test.ts', 'tests/rules/**/*.test.ts'],
    exclude: ['**/node_modules/**', 'functions/lib/**'],
    env: {
      TZ: 'UTC',
      GCLOUD_PROJECT: 'demo-app', // must equal the project id in .firebaserc
      FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080', // ports from firebase.json
      FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
      FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199',
    },
    // Emulator state is shared, so run test files one at a time
    fileParallelism: false,
    testTimeout: 15000,
    hookTimeout: 30000,
  },
})
