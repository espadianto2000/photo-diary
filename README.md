# Photo Diary

App para guardar un viaje o un momento compartido en un grupo pequeño. Las personas del grupo arman álbumes con las fotos y los videos originales, con su lugar y su hora, para después recorrerlos como una línea de tiempo o verlos en un mapa.

El foco es Android. La configuración de iPhone ya está en el proyecto para poder compilarlo más adelante en un Mac.

## Qué es

No es una red social abierta. Es un diario de un grupo chico: familia, amigos o la gente que hizo el mismo viaje.

Un usuario se registra e inicia sesión. Después puede crear un grupo o unirse a uno que ya existe. Cada persona puede estar, como máximo, en **2 grupos**. No importa si el grupo lo creó ella o si se unió: al llegar a 2, no puede crear ni aceptar otro.

Un grupo tiene como máximo **7 personas**, contando a quien lo creó.

Dentro del grupo se crean álbumes. Un álbum junta las fotos de un tramo del viaje. Por ejemplo, unos días en Ica, después Arequipa y al final Tacna. Cada foto se guarda como el archivo original, sin volver a comprimirla, para no perder los datos que la cámara escribió: dónde se tomó, a qué hora, y el resto de la metadata. Con eso, más adelante, la app puede ordenar las fotos por zona y por hora, armar la línea de tiempo del viaje y marcar en un mapa las que se quieran destacar.

El creador del álbum decide quién puede aportar. Puede dejar que cualquiera del grupo suba fotos o videos y los modifique, o cerrarlo para que el resto solo mire.

Esos recorridos (línea de tiempo, zonas, mapa) son la meta del producto. Todavía no están construidos. El detalle de cómo agrupar “Arequipa, del día A al día B” se definirá cuando se implemente esa parte.

## Reglas

**Cuenta**

- Registro e inicio de sesión.
- Sin sesión no se entra al diario.

**Grupos**

- Máximo 2 grupos por usuario, sumando los que crea y a los que se une.
- Máximo 7 miembros por grupo.
- Con 2 membresías activas no se puede crear ni unirse a otro grupo.

**Álbumes**

- Pertenecen a un grupo.
- Hasta 100 fotos por álbum.
- Cada foto se sube como archivo, sin compresión, y no puede pasar de 50 MB.
- El álbum también puede recibir videos, como archivo original.
- Quien crea el álbum puede abrirlo al grupo o restringir subidas y modificaciones.

**Después**

- Leer la metadata (lugar, fecha y hora, y lo demás que traiga el archivo).
- Ordenar por hora de captura.
- Agrupar por zona geográfica y por rango de días.
- Línea de tiempo del viaje.
- Mapa con fotos destacadas.

## Qué hay hoy

La app abre en una pantalla de cuenta y, si la sesión es válida, en un inicio que muestra el correo y permite salir.

Ya funciona:

- Registro e inicio de sesión con email y contraseña.
- Inicio de sesión con Google.
- Sesión que se mantiene al cerrar la app.
- Cierre de sesión.
- Textos de la interfaz en español, con modo claro y oscuro.

Todavía no hay grupos, álbumes, subida de archivos, línea de tiempo ni mapa. Firestore está inicializado y aún no guarda nada de eso.

## Parte técnica

Expo con React Native. El SDK de Expo fija la versión de React Native. Hoy el proyecto usa Expo SDK 58, React Native 0.88 y React 19.3.

| Pieza | Uso |
|---|---|
| Expo SDK 58 y Expo Router | App, rutas y arranque en Android, iOS y web |
| React Native 0.88 | UI nativa |
| NativeWind 4 y Tailwind CSS 3 | Estilos. NativeWind 5 sigue en preview, por eso no se usa |
| Firebase JS 13 | Auth ahora. Firestore queda listo para grupos y álbumes |
| AsyncStorage | Persistencia de la sesión en el teléfono |
| pnpm 10 | Dependencias. Hace falta Node 22.13 o superior. Este entorno usa Node 24 |

Las rutas viven en `app/`. `(auth)` es la cuenta y `(main)` es la pantalla de quien ya entró. `context/AuthContext.tsx` guarda la sesión, `services/auth.service.ts` habla con Firebase y `config/firebase.ts` lee la configuración desde variables de entorno.

Las claves no van en el código. Están en un `.env` local, que Git ignora:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_DEV`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

Esas variables `EXPO_PUBLIC_` quedan dentro del cliente. Sirven para que la app hable con Firebase. No son una clave de servidor, y aun así no se suben al repositorio.

### Probar en Android

Hace falta un teléfono con depuración USB activa y aceptada. `adb devices` tiene que mostrar el equipo como `device`.

```sh
pnpm install
pnpm android
```

`pnpm android` abre Metro y carga la app en el teléfono con Expo Go de SDK 58. Si la versión de Play Store es más vieja, el proyecto se marca incompatible. En ese caso se instala el Expo Go de SDK 58 desde [expo.dev/go](https://expo.dev/go) y se vuelve a lanzar.

Cuando el cambio es solo de código:

```sh
pnpm start
```

y luego la tecla `a`.

Para compilar el binario nativo en la máquina, en lugar de Expo Go:

```sh
pnpm exec expo run:android
```

Eso genera la carpeta `android/`. Esa carpeta, igual que `ios/`, `node_modules/` y los builds, no se versiona.
