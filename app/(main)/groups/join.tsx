import { useState } from "react"
import { Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native"
import { AppScreen } from "../../../components/AppScreen"

export default function JoinGroupScreen() {
  const [code, setCode] = useState("")
  const colorScheme = useColorScheme()

  const handleJoin = () => {
    const cleanedCode = code.trim()
    if (!cleanedCode) {
      Alert.alert("Falta el código", "Pega o escribe el código del grupo.")
      return
    }

    Alert.alert(
      "Pantalla lista",
      "Todavía no se puede entrar con un código. Esta pantalla queda lista para cuando guardemos los grupos.",
    )
  }

  return (
    <AppScreen title="Unirme" back>
      <View className="flex-1 px-5">
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-4">
          Pide el código a quien creó el grupo.
        </Text>

        <TextInput
          className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg mb-6 text-gray-900 dark:text-white"
          placeholder="Código de invitación"
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />

        <TouchableOpacity className="py-3 rounded-lg bg-blue-600 dark:bg-blue-500 active:opacity-80" onPress={handleJoin}>
          <Text className="text-white text-center font-semibold text-lg">Unirme</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  )
}
