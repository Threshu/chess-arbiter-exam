import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  srcDir: 'app/',
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],
  css: ['~/assets/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'pl',
    locales: [
      {
        code: 'pl',
        language: 'pl-PL',
        name: 'Polski',
        files: ['pl/common.json', 'pl/auth.json', 'pl/landing.json'],
      },
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        files: ['en/common.json', 'en/auth.json', 'en/landing.json'],
      },
    ],
    langDir: 'locales',
    lazy: true,
  },
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/auth/**': { ssr: false },
    '/app/**': { ssr: false },
    '/admin/**': { ssr: false },
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
      useEmulators: false,
    },
  },
  typescript: { strict: true, typeCheck: false },
})
