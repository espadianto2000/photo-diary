import type { ReactNode } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"

export function AppScreen({
  children,
  title,
  back,
  action,
}: {
  children: ReactNode
  title: string
  back?: boolean
  action?: { label: string; onPress: () => void }
}) {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="flex-row items-center flex-1">
          {back ? (
            <TouchableOpacity onPress={() => router.back()} className="mr-3 py-2" hitSlop={8}>
              <Text className="text-base text-blue-600 dark:text-blue-400">Atrás</Text>
            </TouchableOpacity>
          ) : null}
          <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
        </View>
        {action ? (
          <TouchableOpacity onPress={action.onPress} className="py-2" hitSlop={8}>
            <Text className="text-base font-semibold text-blue-600 dark:text-blue-400">{action.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  )
}
