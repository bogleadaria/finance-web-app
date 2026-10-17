import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Demo config (safe to commit). The "demo-" prefix makes the emulators refuse real resources.
const demoConfig = {
  apiKey: 'demo-key',
  authDomain: 'demo-finance.firebaseapp.com',
  projectId: 'demo-finance',
  storageBucket: 'demo-finance.appspot.com',
  appId: 'demo-app-id',
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public

  // Demo is the default. Real mode needs NUXT_PUBLIC_USE_EMULATOR=false AND a filled ..env,
  // otherwise we fall back to demo so the app always runs.
  const realConfig = config.firebase
  const hasRealConfig = Boolean(realConfig.apiKey && realConfig.projectId)
  const useEmulator = config.useEmulator || !hasRealConfig

  if (!config.useEmulator && !hasRealConfig) {
    console.warn('⚠️ dev:real requested but ..env is missing Firebase values, falling back to demo')
  }

  const app = initializeApp(
    useEmulator
      ? demoConfig
      : {
          apiKey: realConfig.apiKey,
          authDomain: realConfig.authDomain,
          projectId: realConfig.projectId,
          storageBucket: realConfig.storageBucket,
          messagingSenderId: String(realConfig.messagingSenderId),
          appId: realConfig.appId,
          measurementId: realConfig.measurementId,
        },
  )

  const auth = getAuth(app)
  const db = getFirestore(app)
  const functions = getFunctions(app)
  const storage = getStorage(app)

  if (useEmulator) {
    // 127.0.0.1 avoids IPv6 localhost resolution issues
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
    connectStorageEmulator(storage, '127.0.0.1', 9199)
    console.log('🔥 Firebase: LOCAL EMULATORS (demo-finance)')
  } else {
    console.log(`☁️ Firebase: REAL project (${realConfig.projectId})`)

    // Analytics only makes sense with the real project
    if (realConfig.measurementId) {
      import('firebase/analytics').then(async ({ getAnalytics, isSupported }) => {
        if (await isSupported()) getAnalytics(app)
      })
    }
  }

  return { provide: { auth, db, functions, storage } }
})
