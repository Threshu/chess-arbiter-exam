import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  srcDir: 'app/',
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', type: 'image/png', href: '/logo.png' },
        { rel: 'apple-touch-icon', href: '/logo.png' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],
  css: ['~/assets/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'firebase/functions',
        'firebase/storage',
        'vuefire',
      ],
    },
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'pl',
    locales: [
      {
        code: 'pl',
        language: 'pl-PL',
        name: 'Polski',
        files: [
          'pl/common.json',
          'pl/auth.json',
          'pl/landing.json',
          'pl/admin.json',
          'pl/app.json',
          'pl/legal.json',
        ],
      },
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        files: [
          'en/common.json',
          'en/auth.json',
          'en/landing.json',
          'en/admin.json',
          'en/app.json',
          'en/legal.json',
        ],
      },
    ],
    langDir: 'locales',
  },
  routeRules: {
    '/': { prerender: true },
    '/legal/**': { prerender: true },
    '/en/legal/**': { prerender: true },
    '/auth/**': { ssr: false },
    '/en/auth/**': { ssr: false },
    '/app/**': { ssr: false },
    '/en/app/**': { ssr: false },
    '/admin/**': { ssr: false },
    '/en/admin/**': { ssr: false },
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
      useFunctionsEmulator: false,
      geminiApiKey: '',
    },
  },
  typescript: { strict: true, typeCheck: false },
})
