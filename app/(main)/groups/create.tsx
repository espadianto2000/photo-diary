import { useState } from "react"
import { Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native"
import { AppScreen } from "../../../components/AppScreen"
import { MAX_MEMBERS_PER_GROUP } from "../../../utils/groups"

export default function CreateGroupScreen() {
  const [name, setName] = useState("")
  const colorScheme = useColorScheme()

  const handleCreate = () => {
    const cleanedName = name.trim()
    if (!cleanedName) {
      Alert.alert("Falta el nombre", "Escribe cómo se va a llamar el grupo.")
      return
    }

    Alert.alert(
      "Pantalla lista",
      `“${cleanedName}” todavía no se guarda. Lo conectamos cuando los grupos queden en tu cuenta.`,
    )
  }

  return (
    <AppScreen title="Crear grupo" back>
      <View className="flex-1 px-5">
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-4">
          Un grupo puede tener hasta {MAX_MEMBERS_PER_GROUP} personas, contándote a ti.
        </Text>

        <TextInput
          className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg mb-6 text-gray-900 dark:text-white"
          placeholder="Nombre del grupo"
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          value={name}
          onChangeText={setName}
          autoCapitalize="sentences"
          autoCorrect
          maxLength={40}
        />

        <TouchableOpacity className="py-3 rounded-lg bg-blue-600 dark:bg-blue-500 active:opacity-80" onPress={handleCreate}>
          <Text className="text-white text-center font-semibold text-lg">Crear grupo</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  )
}
