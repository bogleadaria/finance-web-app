import type { Config } from 'tailwindcss'

export default {
    content: [
        './components/**/*.{vue,ts}',
        './pages/**/*.{vue,ts}',
        './layouts/**/*.{vue,ts}',
        './app.vue',
    ],
    theme: {
        extend: {
            colors: {
                'infradin-dark':   '#0D1117',  // near-black navy
                'infradin-accent': '#2563EB',  // electric blue
                'infradin-light':  '#F8FAFC',  // off-white
            },
            fontFamily: {
                sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config
