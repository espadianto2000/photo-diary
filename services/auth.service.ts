import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { auth } from "../config/firebase"

export const registerUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)
  return userCredential.user
}

export const loginUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
  return userCredential.user
}

export const requestPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim())
}

export const logoutUser = async (): Promise<void> => {
  await firebaseSignOut(auth)
}

export const loginWithGoogle = async (idToken: string): Promise<User> => {
  const credential = GoogleAuthProvider.credential(idToken)
  const userCredential = await signInWithCredential(auth, credential)
  return userCredential.user
}

// Listener de cambios en el estado de autenticación
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
