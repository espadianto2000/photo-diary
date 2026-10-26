import { useState } from "react"
import { Alert, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"
import { AppScreen } from "../../components/AppScreen"
import { useAuth } from "../../context/AuthContext"
import { getAuthErrorMessage } from "../../utils/auth-errors"

export default function AccountScreen() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await signOut()
            router.replace("/(auth)")
          } catch (error: unknown) {
            Alert.alert("No se pudo continuar", getAuthErrorMessage(error))
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  return (
    <AppScreen title="Cuenta" back>
      <View className="flex-1 px-5">
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Correo</Text>
        <Text className="text-lg text-gray-900 dark:text-white mb-8">{user?.email}</Text>

        <TouchableOpacity
          className={`py-3 rounded-lg ${loading ? "bg-red-400 dark:bg-red-700" : "bg-red-600 dark:bg-red-500 active:opacity-80"}`}
          onPress={handleLogout}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? "Cerrando..." : "Cerrar sesión"}
          </Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  )
}
