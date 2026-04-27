# Login Screen & Auth Flow — Design Spec
Date: 2026-04-27

## Overview

Add a LoginScreen with Firebase email/password authentication. When the user is not authenticated, only the auth stack is visible. When authenticated, the full BottomTabs app is available. Auth state is managed via Zustand.

---

## Architecture

### Approach chosen: onAuthStateChanged in App.tsx, updates Zustand

`App.tsx` subscribes to `auth().onAuthStateChanged`. On each change it calls `setUser` / `setLoading` on the Zustand auth store. `RootNavigation` reads from the store and conditionally renders the correct navigator.

**Data flow:**
```
Firebase Auth ──onAuthStateChanged──> App.tsx ──setUser──> authStore ──read──> RootNavigation
```

---

## New Files

### `src/stores/authStore.ts`
Zustand store.

```ts
interface AuthState {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setLoading: (loading: boolean) => void;
}
```

Initial state: `user: null`, `isLoading: true` (true until Firebase responds on first load).

### `src/services/auth.ts`
Service layer for Firebase Auth. Two functions:
- `signIn(email: string, password: string): Promise<void>`
- `signOut(): Promise<void>`

Screens never call `@react-native-firebase/auth` directly.

### `src/screens/LoginScreen/LoginScreen.tsx`
Login UI (see UI section below).

### `src/navigation/AuthNavigator/AuthNavigator.tsx`
NativeStack navigator with a single screen: `Login` → `LoginScreen`.

---

## Modified Files

### `App.tsx`
Subscribe to `auth().onAuthStateChanged` on mount. Call `setLoading(true)` before subscription, `setUser(user)` + `setLoading(false)` inside the callback. Unsubscribe on unmount.

### `src/navigation/RootNavigation.ts`
Read `user` and `isLoading` from `authStore`.
- `isLoading === true` → render empty `<View style={{ flex: 1 }}>`
- `user === null` → render `AuthNavigator`
- `user !== null` → render `BottomTabs`

RootNavigation must become a React component (not a static navigation object) so it can read from the store.

### `src/navigation/navigationTypes.ts`
Add `AuthStackParamList` with `Login: undefined`.

---

## UI — LoginScreen

**Background:** `#F7F3EE` (warm off-white, full screen)

**Layout (vertical, padded 24px sides):**

1. **Logo block** (top area, ~120px from top)
   - `LogoIcon` SVG (existing icon) + "Shift" in black bold + "Flow" in `#F5A623` bold, same font size (~28px)

2. **Heading block**
   - "З поверненням." — `fontSize: 28`, `fontWeight: 700`
   - Subtitle — "Увійдіть, щоб побачити сьогоднішні зміни та задачі вашої бригади." — `fontSize: 14`, color `#6B7280`

3. **Form**
   - Email field: rounded border (`#E5E7EB`), `MailIcon` left, placeholder `m.koval@shiftflow.ua`, `keyboardType: 'email-address'`, `autoCapitalize: 'none'`
   - Password field: `LockIcon` left, `EyeIcon`/`EyeOffIcon` right (toggles `secureTextEntry`), placeholder `••••••••`
   - Error message (inline, below fields): red text, visible only on failed login attempt

4. **Login button**
   - Label: "Увійти →", background `#F5A623`, `borderRadius: 12`, full width, `fontWeight: 700`
   - Shows `ActivityIndicator` while request is in flight, disabled during loading

5. **Footer**
   - "Немає акаунту? " (gray) + "Створити акаунт" (`#F5A623`) — `onPress` is a no-op for now (RegisterScreen TBD)

---

## Error Handling

- Firebase `auth/invalid-credential` or `auth/wrong-password` → show "Невірний email або пароль"
- Firebase `auth/invalid-email` → show "Невірний формат email"
- Firebase `auth/too-many-requests` → show "Забагато спроб. Спробуйте пізніше"
- Any other error → show "Сталася помилка. Спробуйте ще раз"

---

## Out of Scope

- "Забули пароль?" — not implemented
- RegisterScreen — UI link present but no-op; screen built in a future session
- Google Sign-In
