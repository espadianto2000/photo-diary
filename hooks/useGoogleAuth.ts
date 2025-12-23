import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { Platform } from "react-native"
import Constants from "expo-constants"
import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID_DEV,
  GOOGLE_IOS_CLIENT_ID,
} from "../config/firebase"

WebBrowser.maybeCompleteAuthSession()

export function useGoogleAuth() {
  const isExpoGo = Constants.appOwnership === "expo"

  const androidClientId =
    Platform.OS === "android" && isExpoGo
      ? GOOGLE_ANDROID_CLIENT_ID_DEV // Expo Go usa host.exp.exponent
      : GOOGLE_ANDROID_CLIENT_ID // Build standalone usa com.photodiary.app

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: androidClientId,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
  })

  return {
    request,
    response,
    promptAsync,
  }
}
