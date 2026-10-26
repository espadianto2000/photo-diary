const messages: Record<string, string> = {
  "auth/invalid-email": "Ese correo no es válido.",
  "auth/missing-email": "Escribe tu correo.",
  "auth/user-disabled": "Esta cuenta está desactivada.",
  "auth/user-not-found": "No hay una cuenta con ese correo.",
  "auth/wrong-password": "La contraseña es incorrecta.",
  "auth/invalid-credential": "El correo o la contraseña no coinciden.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo. Inicia sesión.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Espera un momento o restablece la contraseña.",
  "auth/network-request-failed": "No hay conexión. Revisa tu internet e inténtalo de nuevo.",
  "auth/operation-not-allowed": "Este método de acceso no está habilitado.",
  "auth/account-exists-with-different-credential":
    "Ese correo ya está registrado con otro método. Entra con email y contraseña.",
  "auth/invalid-action-code": "El enlace ya no es válido. Pide uno nuevo.",
  "auth/expired-action-code": "El enlace venció. Pide uno nuevo.",
  access_denied: "No se concedió el acceso de Google.",
  invalid_client: "El cliente de Google no está autorizado para esta app.",
  unauthorized_client: "El cliente de Google no está autorizado para esta app.",
  invalid_grant:
    "Google no aceptó el inicio de sesión. En Expo Go, el cliente Android de desarrollo tiene que usar el paquete host.exp.exponent.",
  redirect_uri_mismatch:
    "Google rechazó la redirección. En Expo Go, el cliente Android de desarrollo tiene que usar el paquete host.exp.exponent.",
  GOOGLE_NOT_READY: "El inicio de sesión con Google todavía no está listo. Inténtalo en unos segundos.",
  GOOGLE_NO_ID_TOKEN: "Google no devolvió la credencial necesaria. Vuelve a intentarlo.",
  INVALID_EMAIL: "Escribe un correo válido.",
  MISSING_PASSWORD: "Escribe tu contraseña.",
  SHORT_PASSWORD: "La contraseña debe tener al menos 6 caracteres.",
}

function readCode(error: unknown): string | null {
  if (typeof error === "object" && error && "code" in error && typeof error.code === "string") {
    return error.code
  }

  if (error instanceof Error) {
    return error.message.match(/auth\/[a-z0-9-]+|redirect_uri_mismatch|invalid_grant|invalid_client|access_denied/)?.[0] ?? null
  }

  return null
}

export function getAuthErrorMessage(error: unknown): string {
  const code = readCode(error)
  if (code && messages[code]) return messages[code]

  if (error instanceof Error && /redirect_uri_mismatch/i.test(error.message)) {
    return messages.redirect_uri_mismatch
  }

  return "No se pudo completar la acción. Inténtalo de nuevo."
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
