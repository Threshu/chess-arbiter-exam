import { VueFire, VueFireAuth } from 'vuefire'
import type { FirebaseApp } from 'firebase/app'

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseApp = nuxtApp.$firebaseApp as FirebaseApp
  nuxtApp.vueApp.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  })
})
