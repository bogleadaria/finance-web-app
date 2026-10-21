import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Backend unit tests in plain Node, no emulator needed: `npm run test:backend`.
export default defineConfig({
  // ~~ is the repo root, same as in Nuxt: import type { Bill } from '~~/types'
  resolve: { alias: { '~~': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    name: 'backend',
    environment: 'node',
    globals: true,
    include: ['{types,services,utils,functions/src}/**/*.test.ts'],
    exclude: ['**/*.emulator.test.ts', '**/node_modules/**', 'functions/lib/**'],
    // Fixed timezone so month-end and "due today" tests are deterministic
    env: { TZ: 'UTC' },
  },
})
