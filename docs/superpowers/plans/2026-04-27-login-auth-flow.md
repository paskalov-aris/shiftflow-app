# Login Screen & Auth Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a LoginScreen with Firebase email/password auth; unauthenticated users see only the auth stack, authenticated users see the full BottomTabs app.

**Architecture:** `App.tsx` subscribes to `auth().onAuthStateChanged` and pushes the result into a Zustand store. `RootNavigation` reads `user` and `isLoading` from the store and conditionally renders `AuthStack` or `BottomTabs` inside a single `NavigationContainer`.

**Tech Stack:** React Native 0.85, @react-native-firebase/auth ^24, Zustand ^5, React Navigation v7 (native-stack + bottom-tabs), TypeScript.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/stores/authStore.ts` | Zustand store — `user`, `isLoading`, setters |
| Create | `src/services/auth.ts` | Firebase auth wrapper — `signIn`, `signOut` |
| Create | `src/navigation/AuthNavigator/AuthNavigator.tsx` | NativeStack with single Login screen |
| Create | `src/screens/LoginScreen/LoginScreen.tsx` | Login UI matching the design |
| Modify | `src/navigation/navigationTypes.ts` | Add `AuthStackParamList` |
| Modify | `src/navigation/RootNavigation.ts` → `.tsx` | Convert to React component, conditional render |
| Modify | `App.tsx` | Add `onAuthStateChanged` subscription |
| Create | `__tests__/stores/authStore.test.ts` | Unit tests for the store |

---

## Task 1: Zustand Auth Store

**Files:**
- Create: `src/stores/authStore.ts`
- Create: `__tests__/stores/authStore.test.ts`

- [ ] **Step 1.1: Write the failing test**

Create `__tests__/stores/authStore.test.ts`:

```typescript
import { useAuthStore } from '../../src/stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: true });
  });

  it('starts with user null and isLoading true', () => {
    const { user, isLoading } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isLoading).toBe(true);
  });

  it('setUser updates user', () => {
    const fakeUser = { uid: 'abc123' } as any;
    useAuthStore.getState().setUser(fakeUser);
    expect(useAuthStore.getState().user).toEqual(fakeUser);
  });

  it('setUser with null clears user', () => {
    useAuthStore.setState({ user: { uid: 'abc' } as any });
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('setLoading updates isLoading', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
```

- [ ] **Step 1.2: Run test to verify it fails**

```bash
npx jest __tests__/stores/authStore.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '../../src/stores/authStore'`

- [ ] **Step 1.3: Create the store**

Create `src/stores/authStore.ts`:

```typescript
import { create } from 'zustand';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: true,
  setUser: user => set({ user }),
  setLoading: isLoading => set({ isLoading }),
}));
```

- [ ] **Step 1.4: Run test to verify it passes**

```bash
npx jest __tests__/stores/authStore.test.ts --no-coverage
```

Expected: PASS — 4 tests pass

- [ ] **Step 1.5: Commit**

```bash
git add src/stores/authStore.ts __tests__/stores/authStore.test.ts
git commit -m "feat: add Zustand auth store"
```

---

## Task 2: Auth Service

**Files:**
- Create: `src/services/auth.ts`

- [ ] **Step 2.1: Create the service**

Create `src/services/auth.ts`:

```typescript
import auth from '@react-native-firebase/auth';

export const signIn = (email: string, password: string) =>
  auth().signInWithEmailAndPassword(email, password);

export const signOut = () => auth().signOut();
```

- [ ] **Step 2.2: Commit**

```bash
git add src/services/auth.ts
git commit -m "feat: add auth service"
```

---

## Task 3: Navigation Types + Auth Navigator

**Files:**
- Modify: `src/navigation/navigationTypes.ts`
- Create: `src/navigation/AuthNavigator/AuthNavigator.tsx`

- [ ] **Step 3.1: Add AuthStackParamList to navigationTypes**

Replace the (empty) contents of `src/navigation/navigationTypes.ts` with:

```typescript
export type AuthStackParamList = {
  Login: undefined;
};
```

- [ ] **Step 3.2: Create AuthNavigator**

Create `src/navigation/AuthNavigator/AuthNavigator.tsx`:

```typescript
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen/LoginScreen';

export const AuthStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    Login: LoginScreen,
  },
});
```

- [ ] **Step 3.3: Commit**

```bash
git add src/navigation/navigationTypes.ts src/navigation/AuthNavigator/AuthNavigator.tsx
git commit -m "feat: add auth navigator and navigation types"
```

---

## Task 4: Login Screen

**Files:**
- Create: `src/screens/LoginScreen/LoginScreen.tsx`

- [ ] **Step 4.1: Create LoginScreen**

Create `src/screens/LoginScreen/LoginScreen.tsx`:

```typescript
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { EyeIcon, EyeOffIcon, LockIcon, LogoIcon, MailIcon } from '../../assets';
import { signIn } from '../../services/auth';

const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Невірний email або пароль';
    case 'auth/invalid-email':
      return 'Невірний формат email';
    case 'auth/too-many-requests':
      return 'Забагато спроб. Спробуйте пізніше';
    default:
      return 'Сталася помилка. Спробуйте ще раз';
  }
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Введіть email та пароль');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
      // onAuthStateChanged in App.tsx handles navigation after successful login
    } catch (e: any) {
      setError(getErrorMessage(e.code ?? ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <LogoIcon width={40} height={40} />
            <Text style={styles.logoText}>
              {'Shift'}
              <Text style={styles.logoOrange}>{'Flow'}</Text>
            </Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>З поверненням.</Text>
          <Text style={styles.subtitle}>
            {'Увійдіть, щоб побачити сьогоднішні зміни\nта задачі вашої бригади.'}
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <MailIcon width={18} height={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="m.koval@shiftflow.ua"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputRow}>
              <LockIcon width={18} height={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(v => !v)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showPassword ? (
                  <EyeOffIcon width={18} height={18} color="#9CA3AF" />
                ) : (
                  <EyeIcon width={18} height={18} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#1C1917" />
            ) : (
              <Text style={styles.buttonText}>Увійти →</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerGray}>Немає акаунту? </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.footerOrange}>Створити акаунт</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  logoOrange: {
    color: '#F5A623',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 32,
  },
  form: {
    gap: 12,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  eyeButton: {
    padding: 2,
  },
  error: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#F5A623',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  footerGray: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerOrange: {
    fontSize: 14,
    color: '#F5A623',
    fontWeight: '600',
  },
});

export default LoginScreen;
```

- [ ] **Step 4.2: Commit**

```bash
git add src/screens/LoginScreen/LoginScreen.tsx
git commit -m "feat: add LoginScreen UI"
```

---

## Task 5: Update RootNavigation

**Files:**
- Rename/modify: `src/navigation/RootNavigation.ts` → `src/navigation/RootNavigation.tsx`

The current file uses `createStaticNavigation` which wraps `NavigationContainer` and returns a fixed tree. We need a React component that conditionally renders either `AuthStack` or `BottomTabs` based on auth state.

- [ ] **Step 5.1: Replace RootNavigation**

Delete `src/navigation/RootNavigation.ts` and create `src/navigation/RootNavigation.tsx`:

```typescript
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { BottomTabs } from './BottomTabsNavigator/BottomTabsNavigator';
import { AuthStack } from './AuthNavigator/AuthNavigator';

export default function RootNavigation() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#F7F3EE' }} />;
  }

  return (
    <NavigationContainer>
      {user ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
```

- [ ] **Step 5.2: Update the import in App.tsx to use the new path**

`App.tsx` imports `from './src/navigation/RootNavigation'` — the path stays the same, only the extension changes (TypeScript resolves it automatically). No change needed in App.tsx for this step.

- [ ] **Step 5.3: Commit**

```bash
git rm src/navigation/RootNavigation.ts
git add src/navigation/RootNavigation.tsx
git commit -m "feat: convert RootNavigation to conditional auth/main renderer"
```

---

## Task 6: Update App.tsx

**Files:**
- Modify: `App.tsx`

- [ ] **Step 6.1: Add onAuthStateChanged subscription**

Replace the full contents of `App.tsx` with:

```typescript
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import RootNavigation from './src/navigation/RootNavigation';
import { useAuthStore } from './src/stores/authStore';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigation />
    </SafeAreaProvider>
  );
}

export default App;
```

- [ ] **Step 6.2: Commit**

```bash
git add App.tsx
git commit -m "feat: subscribe to Firebase auth state in App.tsx"
```

---

## Task 7: Smoke Test

- [ ] **Step 7.1: Run the unit tests**

```bash
npx jest --no-coverage
```

Expected: all tests pass (including existing `App.test.tsx` and the new `authStore` tests).

- [ ] **Step 7.2: Run on iOS simulator**

```bash
npx react-native run-ios
```

Expected:
- App launches showing `LoginScreen` (not BottomTabs) — user is not authenticated
- Background is warm off-white `#F7F3EE`
- "ShiftFlow" logo + heading + form visible
- Entering wrong credentials shows the Ukrainian error message inline
- Entering correct Firebase credentials → `onAuthStateChanged` fires → app switches to `BottomTabs`
- Killing and relaunching the app while logged in → app launches directly into `BottomTabs` (Firebase persists the session)

- [ ] **Step 7.3: Verify logout path (manual)**

From any screen in BottomTabs, open a console / add a temporary button and call `signOut()` from `src/services/auth.ts`. Expected: `onAuthStateChanged` fires with `null`, app switches back to LoginScreen.
