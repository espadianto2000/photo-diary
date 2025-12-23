import { View, Text, TouchableOpacity, Alert } from "react-native"
import { useAuth } from "../../context/AuthContext"
import { router } from "expo-router"
import { useState } from "react"

export default function HomeScreen() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await signOut()
            router.replace("/(auth)")
          } catch (error: any) {
            Alert.alert("Error", error.message || "No se pudo cerrar sesión")
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white dark:bg-black">
      <Text className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Home</Text>

      <Text className="text-lg mb-2 text-gray-700 dark:text-gray-300">Bienvenido</Text>
      <Text className="text-base mb-8 text-gray-600 dark:text-gray-400">{user?.email}</Text>

      <TouchableOpacity
        className={`px-6 py-3 rounded-lg ${loading ? "bg-red-400 dark:bg-red-700" : "bg-red-600 dark:bg-red-500 active:opacity-80"}`}
        onPress={handleLogout}
        disabled={loading}
      >
        <Text className="text-white font-semibold">{loading ? "Cerrando..." : "Cerrar Sesión"}</Text>
      </TouchableOpacity>
    </View>
  )
}
