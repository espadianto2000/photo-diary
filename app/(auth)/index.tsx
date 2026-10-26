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
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { router } from "expo-router"
import { useGoogleAuth } from "../../hooks/useGoogleAuth"
import { getAuthErrorMessage, isValidEmail } from "../../utils/auth-errors"

type AuthMode = "login" | "register" | "reset"

const resetSentMessage =
  "Si hay una cuenta con ese correo, te enviamos un enlace para restablecer la contraseña. Puede tardar un minuto. Mira también el spam."

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<AuthMode>("login")
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth()
  const colorScheme = useColorScheme()
  const { ready: googleReady, signInAsync } = useGoogleAuth()

  const showError = (error: unknown) => {
    Alert.alert("No se pudo continuar", getAuthErrorMessage(error))
  }

  const handleAuth = async () => {
    const cleanedEmail = email.trim()

    if (!isValidEmail(cleanedEmail)) {
      Alert.alert("Revisa el correo", "Escribe un correo válido.")
      return
    }

    if (mode === "reset") {
      setLoading(true)
      try {
        await resetPassword(cleanedEmail)
        Alert.alert("Revisa tu correo", resetSentMessage)
        setMode("login")
      } catch (error: unknown) {
        const code = typeof error === "object" && error && "code" in error ? String(error.code) : ""
        if (code === "auth/user-not-found") {
          Alert.alert("Revisa tu correo", resetSentMessage)
          setMode("login")
          return
        }
        showError(error)
      } finally {
        setLoading(false)
      }
      return
    }

    if (!password) {
      Alert.alert("Falta la contraseña", "Escribe tu contraseña.")
      return
    }

    if (password.length < 6) {
      Alert.alert("Contraseña corta", "La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)
    try {
      if (mode === "register") {
        await signUp(cleanedEmail, password)
      } else {
        await signIn(cleanedEmail, password)
      }
      router.replace("/(main)")
    } catch (error: unknown) {
      showError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGooglePress = async () => {
    setLoading(true)
    try {
      const idToken = await signInAsync()
      if (!idToken) return
      await signInWithGoogle(idToken)
      router.replace("/(main)")
    } catch (error: unknown) {
      showError(error)
    } finally {
      setLoading(false)
    }
  }

  const title = mode === "register" ? "Crear cuenta" : mode === "reset" ? "Restablecer contraseña" : "Bienvenido"
  const subtitle =
    mode === "register"
      ? "Regístrate para comenzar"
      : mode === "reset"
        ? "Te enviamos un enlace al correo de tu cuenta"
        : "Inicia sesión para continuar"
  const buttonLabel = loading
    ? "Cargando..."
    : mode === "register"
      ? "Registrarse"
      : mode === "reset"
        ? "Enviar enlace"
        : "Iniciar sesión"

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-black"
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6" keyboardShouldPersistTaps="handled">
        <Text className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">{title}</Text>

        <Text className="text-center mb-8 text-gray-600 dark:text-gray-400">{subtitle}</Text>

        <TextInput
          className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg mb-4 text-gray-900 dark:text-white"
          placeholder="Email"
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        {mode !== "reset" ? (
          <TextInput
            className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg mb-6 text-gray-900 dark:text-white"
            placeholder="Contraseña (mínimo 6 caracteres)"
            placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            keyboardType={Platform.OS === "android" ? "visible-password" : "default"}
            editable={!loading}
            onSubmitEditing={handleAuth}
          />
        ) : null}

        <TouchableOpacity
          className={`py-3 rounded-lg ${loading ? "bg-blue-400 dark:bg-blue-700" : "bg-blue-600 dark:bg-blue-500 active:opacity-80"}`}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg">{buttonLabel}</Text>
        </TouchableOpacity>

        {mode === "login" ? (
          <TouchableOpacity className="mt-4" onPress={() => setMode("reset")} disabled={loading}>
            <Text className="text-center text-blue-600 dark:text-blue-400">¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          className="mt-4"
          onPress={() => setMode(mode === "register" ? "login" : mode === "reset" ? "login" : "register")}
          disabled={loading}
        >
          <Text className="text-center text-blue-600 dark:text-blue-400">
            {mode === "register"
              ? "¿Ya tienes cuenta? Inicia sesión"
              : mode === "reset"
                ? "Volver al inicio de sesión"
                : "¿No tienes cuenta? Regístrate"}
          </Text>
        </TouchableOpacity>

        {mode !== "reset" ? (
          <>
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              <Text className="mx-4 text-gray-500 dark:text-gray-400">o</Text>
              <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-center py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 active:opacity-80"
              onPress={handleGooglePress}
              disabled={!googleReady || loading}
            >
              <Text className="text-gray-900 dark:text-white font-semibold text-lg">Continuar con Google</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
