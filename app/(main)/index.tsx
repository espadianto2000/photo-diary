import { Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"
import { AppScreen } from "../../components/AppScreen"
import { canJoinAnotherGroup, MAX_GROUPS_PER_USER, MAX_MEMBERS_PER_GROUP, type GroupSummary } from "../../utils/groups"

const myGroups: GroupSummary[] = []

export default function HomeScreen() {
  const open = canJoinAnotherGroup(myGroups.length)

  return (
    <AppScreen title="Grupos" action={{ label: "Cuenta", onPress: () => router.push("/(main)/account") }}>
      <View className="flex-1 px-5">
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-4">
          Puedes estar en {MAX_GROUPS_PER_USER} grupos. Cada uno admite hasta {MAX_MEMBERS_PER_GROUP} personas.
        </Text>

        {myGroups.length === 0 ? (
          <View className="rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Todavía no tienes grupos</Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              Crea uno para tu viaje o únete con un código.
            </Text>
          </View>
        ) : (
          <View className="mb-6">
            {myGroups.map((group) => (
              <View key={group.id} className="rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4 mb-3">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {group.memberCount} de {MAX_MEMBERS_PER_GROUP} · {group.role === "owner" ? "Lo creaste" : "Te uniste"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {open ? (
          <View className="gap-3">
            <TouchableOpacity
              className="py-3 rounded-lg bg-blue-600 dark:bg-blue-500 active:opacity-80"
              onPress={() => router.push("/(main)/groups/create")}
            >
              <Text className="text-white text-center font-semibold text-lg">Crear grupo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 active:opacity-80"
              onPress={() => router.push("/(main)/groups/join")}
            >
              <Text className="text-gray-900 dark:text-white text-center font-semibold text-lg">Unirme a un grupo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4">
            <Text className="text-base text-gray-900 dark:text-white">
              Ya estás en {MAX_GROUPS_PER_USER} grupos. Para crear o unirte a otro, primero sal de uno.
            </Text>
          </View>
        )}
      </View>
    </AppScreen>
  )
}
