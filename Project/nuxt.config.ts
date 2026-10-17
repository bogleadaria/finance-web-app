// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css'],

  // Defaults = demo mode. Overridden automatically by NUXT_PUBLIC_* .env vars (..env / shell).
  runtimeConfig: {
    public: {
      useEmulator: true,
      firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        measurementId: '',
      },
    },
  },

  app: {
    head: {
      title: 'APP',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Bill Expense project'
        },
      ],
      link: [
      ],
    },
  },

  compatibilityDate: '2024-11-01',
})
