import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  loginUser,
  loginWithGoogle,
  logoutUser,
  onAuthStateChange,
  registerUser,
  requestPasswordReset,
} from "../services/auth.service"
import type { User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: (idToken: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const firebaseUser = await loginUser(email, password)
    setUser(firebaseUser)
  }

  const signUp = async (email: string, password: string) => {
    const firebaseUser = await registerUser(email, password)
    setUser(firebaseUser)
  }

  const signOut = async () => {
    await logoutUser()
    setUser(null)
  }

  const signInWithGoogle = async (idToken: string) => {
    const firebaseUser = await loginWithGoogle(idToken)
    setUser(firebaseUser)
  }

  const resetPassword = async (email: string) => {
    await requestPasswordReset(email)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, signInWithGoogle, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
