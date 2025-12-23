import {
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { router } from "expo-router"
import { useGoogleAuth } from "../../hooks/useGoogleAuth"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const colorScheme = useColorScheme()

  const { request, response, promptAsync } = useGoogleAuth()

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response
      if (authentication?.idToken) {
        handleGoogleSignIn(authentication.idToken)
      }
    }
  }, [response])

  const handleGoogleSignIn = async (idToken: string) => {
    setLoading(true)
    try {
      await signInWithGoogle(idToken)
      router.replace("/(main)")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al iniciar sesión con Google")
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)
    try {
      if (isRegistering) {
        await signUp(email, password)
        Alert.alert("Éxito", "Cuenta creada exitosamente")
      } else {
        await signIn(email, password)
      }
      router.replace("/(main)")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Ocurrió un error durante la autenticación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-black"
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          {isRegistering ? "Crear Cuenta" : "Bienvenido"}
        </Text>

        <Text className="text-center mb-8 text-gray-600 dark:text-gray-400">
          {isRegistering ? "Regístrate para comenzar" : "Inicia sesión para continuar"}
        </Text>

        <TextInput
          className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg mb-4 text-gray-900 dark:text-white"
          placeholder="Email"
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg mb-6 text-gray-900 dark:text-white"
          placeholder="Contraseña (mínimo 6 caracteres)"
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          className={`py-3 rounded-lg ${loading ? "bg-blue-400 dark:bg-blue-700" : "bg-blue-600 dark:bg-blue-500 active:opacity-80"}`}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? "Cargando..." : isRegistering ? "Registrarse" : "Iniciar Sesión"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4" onPress={() => setIsRegistering(!isRegistering)} disabled={loading}>
          <Text className="text-center text-blue-600 dark:text-blue-400">
            {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          <Text className="mx-4 text-gray-500 dark:text-gray-400">o</Text>
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 active:opacity-80"
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <Text className="text-gray-900 dark:text-white font-semibold text-lg">Continuar con Google</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
