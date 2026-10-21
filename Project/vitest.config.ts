import { defineVitestConfig } from '@nuxt/test-utils/config'
import { configDefaults } from 'vitest/config'

// Nuxt environment: for components, pages and composables (Daria, Cristi).
// Backend code (types, services, utils, functions) runs in plain Node, see vitest.backend.config.ts.
export default defineVitestConfig({
    test: {
        environment: 'nuxt',
        exclude: [
            ...configDefaults.exclude,
            'types/**',
            'services/**',
            'utils/**',
            'functions/**',
            'tests/rules/**',
        ],
    },
})
