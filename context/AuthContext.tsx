import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, logoutUser, registerUser, onAuthStateChange, loginWithGoogle } from "../services/auth.service"
import type { User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: (idToken: string) => Promise<void>
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
    try {
      const firebaseUser = await loginUser(email, password)
      setUser(firebaseUser)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const firebaseUser = await registerUser(email, password)
      setUser(firebaseUser)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signOut = async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signInWithGoogle = async (idToken: string) => {
    try {
      const firebaseUser = await loginWithGoogle(idToken)
      setUser(firebaseUser)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, signInWithGoogle, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
