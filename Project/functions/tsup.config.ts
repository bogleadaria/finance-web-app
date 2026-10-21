import { defineConfig } from 'tsup'

// Bundles src/index.ts with the shared ../utils and ../types into lib/index.js (CommonJS).
// firebase-admin and firebase-functions stay external (installed from this package.json).
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node22',
  outDir: 'lib',
  clean: true,
  sourcemap: true,
})
