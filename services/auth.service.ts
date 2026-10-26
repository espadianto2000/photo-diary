import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { auth } from "../config/firebase"

// Registrar nuevo usuario
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Iniciar sesión
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Cerrar sesión
export const logoutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Iniciar sesión con el idToken de Google
export const loginWithGoogle = async (idToken: string): Promise<User> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken)
    const userCredential = await signInWithCredential(auth, credential)
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Listener de cambios en el estado de autenticación
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
