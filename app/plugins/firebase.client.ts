import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions'
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage'
import { FIRESTORE_REGION } from '~~/shared/constants'

declare global {
  var __firebaseEmulatorsConnected: boolean | undefined
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  const app: FirebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)

  const auth: Auth = getAuth(app)
  const firestore: Firestore = getFirestore(app)
  const functions: Functions = getFunctions(app, FIRESTORE_REGION)
  const storage: FirebaseStorage = getStorage(app)

  if (config.public.useEmulators && !globalThis.__firebaseEmulatorsConnected) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
    connectStorageEmulator(storage, '127.0.0.1', 9199)
    globalThis.__firebaseEmulatorsConnected = true
  } else if (config.public.useFunctionsEmulator && !globalThis.__firebaseEmulatorsConnected) {
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
    globalThis.__firebaseEmulatorsConnected = true
  }

  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth,
      firestore,
      firebaseFunctions: functions,
      firebaseStorage: storage,
    },
  }
})
