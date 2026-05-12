// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import vueA11y from 'eslint-plugin-vuejs-accessibility'

export default withNuxt(
  vueA11y.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
    },
  },
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'dist/**',
      'lib/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'functions/lib/**',
    ],
  },
)
