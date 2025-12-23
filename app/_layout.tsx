"use client"

import "../global.css"
import { Slot, useRouter, useSegments } from "expo-router"
import { AuthProvider, useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import { View } from "react-native"

function RootLayoutNav() {
  const { user, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === "(auth)"

    if (!user && !inAuthGroup) {
      // Redirigir al login si no está autenticado
      router.replace("/(auth)")
    } else if (user && inAuthGroup) {
      // Redirigir al home si ya está autenticado
      router.replace("/(main)")
    }
  }, [user, segments, isLoading])

  if (isLoading) {
    return <View className="flex-1 bg-white dark:bg-black" />
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
