import { AccessTokenRequest } from "expo-auth-session"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import Constants from "expo-constants"
import { useEffect } from "react"
import { Platform } from "react-native"
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID_DEV,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from "../config/firebase"

WebBrowser.maybeCompleteAuthSession()

function codedError(code: string): Error {
  const error = new Error(code)
  ;(error as Error & { code: string }).code = code
  return error
}

export function useGoogleAuth() {
  const isExpoGo = Constants.expoGoConfig != null
  const androidClientId =
    Platform.OS === "android" && isExpoGo ? GOOGLE_ANDROID_CLIENT_ID_DEV : GOOGLE_ANDROID_CLIENT_ID

  const [request, , promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    selectAccount: true,
    language: "es",
    shouldAutoExchangeCode: false,
  })

  useEffect(() => {
    if (Platform.OS !== "android") return
    WebBrowser.warmUpAsync()
    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [])

  const signInAsync = async (): Promise<string> => {
    if (!request) throw codedError("GOOGLE_NOT_READY")

    const result = await promptAsync()

    if (result.type !== "success" && result.type !== "error") {
      return ""
    }

    if (result.type === "error") {
      throw result.error ?? codedError(result.params.error || result.errorCode || "access_denied")
    }

    const existingToken = result.params.id_token || result.authentication?.idToken
    if (existingToken) return existingToken

    const code = result.params.code
    if (!code) throw codedError("GOOGLE_NO_ID_TOKEN")

    const exchange = new AccessTokenRequest({
      clientId: request.clientId,
      redirectUri: request.redirectUri,
      scopes: request.scopes,
      code,
      extraParams: {
        code_verifier: request.codeVerifier ?? "",
      },
    })

    const authentication = await exchange.performAsync(Google.discovery)
    if (!authentication.idToken) throw codedError("GOOGLE_NO_ID_TOKEN")
    return authentication.idToken
  }

  return {
    ready: request != null,
    signInAsync,
  }
}
