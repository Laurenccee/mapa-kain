# MapaKain — Full-Stack Code Audit

> **Stack:** React Native (Expo), NativeWind, Supabase, Expo Router, Zustand, React Hook Form + Zod
> **Date:** May 7, 2026
> **Auditor:** Senior Full-Stack Engineer & Security Auditor

---

## Table of Contents

1. [Security & Data Integrity](#1-security--data-integrity)
2. [Architecture & Design](#2-architecture--design)
3. [Performance & Efficiency](#3-performance--efficiency)
4. [Production Readiness](#4-production-readiness)
5. [Code Bloat & Consistency](#5-code-bloat--consistency)
6. [Responsiveness & UX](#6-responsiveness--ux)

---

## 1. Security & Data Integrity

---

### 🔴 SEC-01 — Plaintext Password Stored in SecureStore

**The Problem:**
`useRememberMe.ts` stores the raw password in `expo-secure-store` so the "Remember Me" feature can pre-fill the form.

```ts
// src/features/auth/hooks/useRememberMe.ts
await SecureStore.setItemAsync(PASSWORD_KEY, password); // ← stores plaintext password
```

**Risk Level:** `CRITICAL`

**The Solution:**
Never persist passwords. Supabase already handles persistent sessions via `AsyncStorage` with `persistSession: true`. The "Remember Me" feature should only persist the **email**, and rely entirely on Supabase's own token refresh mechanism for re-authentication. Remove `PASSWORD_KEY` entirely.

```ts
// store only email
export async function saveRememberMe(email: string): Promise<void> {
  await SecureStore.setItemAsync(EMAIL_KEY, email);
}

export async function loadRememberMe(): Promise<{ email: string } | null> {
  const email = await SecureStore.getItemAsync(EMAIL_KEY);
  if (email) return { email };
  return null;
}
```

Then in `SignInForm.tsx`, remove the `setValue('password', saved.password)` line.

**Why:** If a device is compromised, jailbroken, or the backup is leaked, the user's actual password is exposed. An attacker who obtains it can access the account from any device, bypassing session revocation. Supabase refresh tokens are scoped, revocable, and expire — plaintext passwords are none of these things.

---

### 🔴 SEC-02 — MIME Type Spoofing in Avatar Upload

**The Problem:**
`uploadAvatar` in `profileServices.tsx` derives the content-type directly from the file URI extension. A user could engineer a URI ending in `.exe` or `.html`.

```ts
const ext = uri.split('.').pop() ?? 'jpg';
const path = `${userId}/avatar.${ext}`;
// ...
const { error } = await supabase.storage.from('avatars').upload(path, file, {
  contentType: `image/${ext}`, // ← user-controlled extension
  upsert: true,
});
```

**Risk Level:** `HIGH`

**The Solution:**
Whitelist allowed extensions and default to `jpeg` for unknowns.

```ts
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const;
type AllowedExt = (typeof ALLOWED_IMAGE_EXTENSIONS)[number];

function getSafeExtension(uri: string): AllowedExt {
  const raw = uri.split('.').pop()?.toLowerCase() ?? '';
  return (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(raw)
    ? (raw as AllowedExt)
    : 'jpeg';
}
```

**Why:** Prevents uploading files with misleading MIME types to a public Supabase storage bucket, which could be served to other users.

---

### 🔴 SEC-03 — Password Reset Missing `redirectTo` Deep Link

**The Problem:**
`resetPasswordForEmail` is called without a `redirectTo`, so the reset email uses the Supabase dashboard default URL — which is a web URL, not a deep link into the mobile app. The user ends up on a broken page.

```ts
// ForgetPasswordForm.tsx
const { error } = await supabase.auth.resetPasswordForEmail(data.email);
// ← no redirectTo
```

**Risk Level:** `HIGH`

**The Solution:**
Pass a deep link scheme so the user is redirected back into the app.

```ts
const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
  redirectTo: 'mapakain://reset-password', // match your app.json scheme
});
```

Also register a `reset-password` route in the app to handle the incoming `access_token` from the URL and call `supabase.auth.updateUser({ password: newPassword })`.

**Why:** Without this, password reset is completely non-functional on mobile. This is a broken security flow.

---

### 🟠 SEC-04 — `checkProfile` Silently Ignores DB Errors

**The Problem:**
`checkProfile()` destructures only `data` and swallows any `error`. A Row Level Security (RLS) policy rejection, a network failure, or a schema mismatch will silently return `false`, treating the user as if they have no profile.

```ts
export async function checkProfile(userId: string): Promise<boolean> {
  const { data } = await supabase // ← error is discarded
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();
  return !!data;
}
```

**Risk Level:** `HIGH`

**The Solution:**

```ts
export async function checkProfile(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle(); // use maybeSingle() — single() throws on 0 rows

  if (error) throw error; // surface the real error
  return !!data;
}
```

**Why:** A misdiagnosed "no profile" state could force a user through the profile setup screen on every login, corrupting existing profile data or creating duplicate insert errors.

---

### 🟠 SEC-05 — `createProfile` Calls `getSession()` Instead of Using the Store

**The Problem:**
`createProfile()` in `profileServices.tsx` re-fetches the session from Supabase instead of reading it from the auth store. This creates an extra async round-trip and a TOCTOU (Time-Of-Check-Time-Of-Use) gap where the session could expire between the auth check and the insert.

```ts
export async function createProfile(values: ProfileFormValues): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession(); // ← extra call
  if (!session) throw new Error('Session expired.');
  const userId = session.user.id;
  // ...
}
```

**Risk Level:** `MEDIUM`

**The Solution:**
Pass `userId` as a parameter from the component where the store is already available:

```ts
// profileServices.tsx
export async function createProfile(
  userId: string,
  values: ProfileFormValues,
): Promise<void> {
  // ... no session re-fetch needed
}

// ProfileSetupForm.tsx
const userId = useAuthStore((s) => s.session?.user.id);
// ...
await createProfile(userId!, data);
```

**Why:** Eliminates a network call, removes the TOCTOU gap, and keeps services free of Supabase auth coupling — a cleaner separation of concerns.

---

### 🟠 SEC-06 — OAuth Buttons Are Non-Functional (Silent Failure)

**The Problem:**
`OAuthButtons.tsx` renders functional-looking Google and Facebook buttons with no `onPress` handlers. A user who taps them receives zero feedback.

```tsx
<Button variant="outline" size="icon" className="justify-center gap-2">
  {/* no onPress */}
  <HugeiconsIcon icon={GoogleIcon} ... />
</Button>
```

**Risk Level:** `MEDIUM`

**The Solution:**
Either implement the OAuth flow using `supabase.auth.signInWithOAuth` + `expo-web-browser`, or disable and visually mark the buttons as "coming soon":

```tsx
<Button variant="outline" size="icon" disabled className="opacity-50">
  <HugeiconsIcon icon={GoogleIcon} ... />
</Button>
```

**Why:** A visible but non-responsive UI element is a UX defect that erodes trust. If a user relies on it and it doesn't work, they may not be able to access their account.

---

### 🟡 SEC-07 — No Email Verification Gate After Sign-Up

**The Problem:**
After `supabase.auth.signUp()` succeeds, the user sees a "Check your email" toast — but there is no actual gate preventing them from trying to sign in before verifying. Depending on Supabase project settings, unverified users may still receive a valid session on sign-in.

**Risk Level:** `MEDIUM`

**The Solution:**
After a successful sign-in, check `session.user.email_confirmed_at`:

```ts
const { data, error } = await supabase.auth.signInWithPassword({ ... });

if (!error && data.user && !data.user.email_confirmed_at) {
  await supabase.auth.signOut();
  Toast.show({
    type: 'error',
    text1: 'Please verify your email before signing in.',
  });
  return;
}
```

**Why:** Prevents unverified accounts from accessing the app, which is standard security hygiene for email-based auth.

---

## 2. Architecture & Design

---

### 🔴 ARCH-01 — Profile State Management Is Duplicated Across Two Places

**The Problem:**
Profile check and initialization logic lives in **both** `useAuthSession.ts` (the hook) **and** `ProfileProvider.tsx` (the provider). `useAuthSession` calls `checkProfile` and calls `setHasProfile` / `setIsProfileInitialized`. `ProfileProvider` also watches `userId` and resets these values. This creates competing writes to the same Zustand store.

```ts
// useAuthSession.ts — sets profile state
setHasProfile(has);
setIsProfileInitialized(true);

// ProfileProvider.tsx — also resets profile state
useEffect(() => {
  if (!isInitialized || userId) return;
  setHasProfile(null);
  setIsProfileInitialized(false);
}, [userId, isInitialized]);
```

**Risk Level:** `HIGH`

**The Solution:**
Make `useAuthSession` the **single source of truth** for all auth + profile state. Remove the duplicate reset logic from `ProfileProvider`, or remove `ProfileProvider` entirely since it doesn't provide a React Context — it's just a side-effect component:

```tsx
// ProfileProvider.tsx — simplify to just render children
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

Move the sign-out reset logic into the `SIGNED_OUT` handler in `useAuthSession`.

**Why:** Two sources of truth for the same state = unpredictable race conditions. The reset in `ProfileProvider` fires based on `userId` going `undefined`, which may interleave with the Supabase `SIGNED_OUT` event handler.

---

### 🟠 ARCH-02 — Sign-Out Logic Is Duplicated in Two Screens

**The Problem:**
Both `app/(protected)/(tabs)/map/index.tsx` and `app/(protected)/(profile)/setup/index.tsx` contain an identical `handleSignOut` async function with identical error handling and Toast calls. This is ~20 lines of duplicated imperative code.

**Risk Level:** `MEDIUM`

**The Solution:**
Extract into a shared hook:

```ts
// src/hooks/useSignOut.ts
export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) Toast.show({ type: 'error', text1: error.message });
    } catch {
      Toast.show({ type: 'error', text1: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return { signOut, isLoading };
}
```

**Why:** Single point of change. If the sign-out flow changes (e.g., clearing local caches), you update it once.

---

### 🟠 ARCH-03 — `useRememberMe` Is Named as a Hook But Is Not One

**The Problem:**
`src/features/auth/hooks/useRememberMe.ts` exports three standalone async functions (`loadRememberMe`, `saveRememberMe`, `clearRememberMe`). It is not a React hook (no `use*` prefix convention should be used, no hooks are called inside it).

**Risk Level:** `LOW`

**The Solution:**
Rename the file to `rememberMe.ts` and move it to `src/features/auth/utils/rememberMe.ts`. This prevents confusion and false expectations about when the code can be called.

**Why:** React hooks have the strict rule of only being called at the top level of a component. Naming a utility file as a hook misleads contributors into thinking these are hooks with that restriction.

---

### 🟠 ARCH-04 — `ROUTES` Constants Are Defined But Never Used

**The Problem:**
`src/utils/constants/routes.ts` defines a `ROUTES` object, but every navigation call in the codebase uses hardcoded string literals instead (e.g., `router.replace('/(protected)/(tabs)/map')`).

**Risk Level:** `LOW`

**The Solution:**
Either delete the file, or migrate all hardcoded route strings to use the constants:

```ts
// Instead of:
router.replace('/(protected)/(tabs)/map');

// Use:
router.replace(ROUTES.MAP); // after updating ROUTES with Expo Router-compatible paths
```

**Why:** Unused code is dead weight. If ROUTES is kept, centralizing route strings prevents typos and makes future renames a one-line change.

---

### 🟡 ARCH-05 — `ProfileProvider` Is a Misnomer

**The Problem:**
`ProfileProvider` is named to imply it provides a React Context, but it doesn't create or expose any context. It directly mutates global Zustand state as a side-effect. The naming is architecturally misleading.

**Risk Level:** `LOW`

**The Solution:**
If it's retained at all, rename it to `ProfileResetEffect` or simply merge its logic into `useAuthSession`. If removed, no consumers need to change since there's no actual context consumer anywhere.

**Why:** The Provider naming convention in React implies `React.createContext` + `.Provider`. Violating this confuses developers about where state is managed.

---

## 3. Performance & Efficiency

---

### 🟠 PERF-01 — `useTheme()` Called but Result Never Used

**The Problem:**
`SignUpForm.tsx` and `ForgetPasswordForm.tsx` both call `useTheme()` and assign it to `theme`, but `theme` is never referenced in either component's JSX or logic.

```ts
// SignUpForm.tsx
const theme = useTheme(); // ← theme is never used below

// ForgetPasswordForm.tsx
const theme = useTheme(); // ← same
```

**Risk Level:** `LOW`

**The Solution:**
Remove the unused hook calls from both components.

```diff
- const theme = useTheme();
```

**Why:** `useTheme()` calls `useThemeStore` (a Zustand selector) and `useColorScheme()` on every render of these components. Removing unused subscriptions slightly reduces re-render work and eliminates dead code.

---

### 🟠 PERF-02 — Inefficient Image Conversion Pipeline in `uploadAvatar`

**The Problem:**
The upload pipeline does: `fetch(uri)` → `.blob()` → `new Response(blob).arrayBuffer()` → `new Uint8Array(...)`. This is three sequential async memory copies of the same image data.

```ts
const response = await fetch(uri);
const blob = await response.blob();
const arrayBuffer = await new Response(blob).arrayBuffer();
const file = new Uint8Array(arrayBuffer);
```

**Risk Level:** `LOW`

**The Solution:**
Use `expo-file-system` to read the file as a Base64 string and upload via `FormData`, or use the `Blob` directly since Supabase's `upload` method accepts a `Blob`:

```ts
const response = await fetch(uri);
const blob = await response.blob();

const { error } = await supabase.storage
  .from('avatars')
  .upload(path, blob, { contentType: `image/${safeExt}`, upsert: true });
```

**Why:** Removes one full in-memory copy of the image data, which matters for large images on low-memory Android devices.

---

### 🟡 PERF-03 — Hardcoded Tab Bar Colors Bypass the Theme System

**The Problem:**
`TabsLayout` uses hardcoded hex colors instead of the theme object, meaning they won't respond to dark mode changes.

```ts
// app/(protected)/(tabs)/_layout.tsx
tabBarActiveTintColor: '#141053',   // ← hardcoded
tabBarInactiveTintColor: 'rgba(20,16,83,0.5)', // ← hardcoded
```

**Risk Level:** `LOW`

**The Solution:**
Use `useTheme()` which is already imported:

```ts
const theme = useTheme();
// ...
tabBarActiveTintColor: theme.primary,
tabBarInactiveTintColor: theme.mutedForeground,
```

**Why:** The current code will show a dark-purple tab bar even in dark mode where the primary color is different, breaking visual consistency.

---

## 4. Production Readiness

---

### 🔴 PROD-01 — `console.log` With Session Data in Root Layout

**The Problem:**
`app/_layout.tsx` contains a `console.log` that fires on every render and logs auth initialization state. In production, this pollutes the console and could appear in crash reports or log aggregators.

```ts
console.log('RootLayout rendered -', { fontsLoaded, isInitialized });
```

**Risk Level:** `MEDIUM`

**The Solution:**
Replace with the project's own `logger` utility which should gate on `__DEV__`:

```ts
// Use logger instead, or remove entirely
if (__DEV__) {
  logger.debug('RootLayout rendered', { fontsLoaded, isInitialized });
}
```

**Why:** Console output in production builds leaks internal state and adds noise to log monitoring tools.

---

### 🟠 PROD-02 — Logger Always Logs to Console in All Environments

**The Problem:**
`logger.ts` calls `console.log` and `console.error` in all environments. Only `addBreadcrumb` checks `__DEV__`. The `setUser` and `clearUser` functions also log to console unconditionally.

```ts
export const logger = {
  debug: (message: string, data?: any) => {
    console.log(`🔍 [DEBUG] ${message}`, data || ''); // ← no __DEV__ guard
    ...
  },
  info: ...  // ← same
};
```

**Risk Level:** `MEDIUM`

**The Solution:**
Gate all console output on `__DEV__`:

```ts
export const logger = {
  debug: (message: string, data?: any) => {
    if (__DEV__) console.log(`🔍 [DEBUG] ${message}`, data ?? '');
    addBreadcrumb(`DEBUG: ${message}`, data);
  },
  info: (message: string, data?: any) => {
    if (__DEV__) console.log(`ℹ️ [INFO] ${message}`, data ?? '');
    addBreadcrumb(`INFO: ${message}`, data);
  },
  // ...
};
```

In production, wire this to a real service like Sentry (`captureException`) or Datadog.

**Why:** Verbose logging in production increases bundle overhead and can leak PII (emails, user IDs) to anyone with access to device logs or crash reports.

---

### 🟠 PROD-03 — `isLoading` Never Resets on Successful Sign-In

**The Problem:**
In `SignInForm.tsx`, the `handleSignIn` function calls `setIsLoading(true)` but only calls `setIsLoading(false)` in the error paths. On a **successful** sign-in, it relies on the component unmounting (via navigation) to clean up the state. If navigation is slow or delayed, the Sign In button remains disabled with no user feedback.

```ts
const handleSignIn = async (data: SignInData) => {
  setIsLoading(true);
  try {
    // ...
    if (error) {
      setIsLoading(false); // ← only resets on error
      return;
    }
    // ← on success: never resets isLoading
  } catch {
    setIsLoading(false); // ← resets on exception
  }
};
```

**Risk Level:** `MEDIUM`

**The Solution:**
Use `finally` consistently:

```ts
const handleSignIn = async (data: SignInData) => {
  setIsLoading(true);
  try {
    if (rememberMe) await saveRememberMe(data.email);
    else await clearRememberMe();

    const { error } = await supabase.auth.signInWithPassword({ ... });
    if (error) Toast.show({ type: 'error', text1: error.message });
  } catch {
    Toast.show({ type: 'error', text1: 'An unexpected error occurred.' });
  } finally {
    setIsLoading(false);
  }
};
```

**Why:** If the Supabase auth state change event is delayed (slow network), the button stays frozen. Using `finally` guarantees the loading state is always cleaned up.

---

### 🟠 PROD-04 — No Error Boundary in the App

**The Problem:**
There are no React Error Boundaries anywhere in the component tree. A JavaScript error thrown during rendering (e.g., from a malformed profile payload) will crash the entire app with a white screen.

**Risk Level:** `MEDIUM`

**The Solution:**
Add a root-level error boundary:

```tsx
// src/components/shared/ErrorBoundary.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
```

Wrap `<GestureHandlerRootView>` in `_layout.tsx` with this boundary.

**Why:** Error boundaries prevent full-app crashes from isolated component failures and give users a recoverable state instead of a blank screen.

---

### 🟠 PROD-05 — `getSession` Call Missing Error Handling in `useAuthSession`

**The Problem:**
The initial session bootstrap in `useAuthSession` does not handle the case where `supabase.auth.getSession()` itself fails (e.g., corrupted AsyncStorage, network error on first boot).

```ts
const initSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession(); // ← no error handling
  // ...
};
```

**Risk Level:** `MEDIUM`

**The Solution:**

```ts
const initSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) logger.error('[Auth] getSession failed', { error });
    // ... rest of logic
  } catch (err) {
    logger.error('[Auth] Critical session init failure', { err });
    // Still call setSession(null) so isInitialized becomes true
    setSession(null);
    setIsProfileInitialized(true);
  }
};
```

**Why:** If `getSession` throws, `isInitialized` never becomes `true`, the splash screen never hides, and the app is permanently frozen on the splash screen.

---

### 🟡 PROD-06 — Commented-Out Navigation Code in `ProfileSetupForm`

**The Problem:**
There is a commented-out `useEffect` in `ProfileSetupForm.tsx` that was meant to navigate to the map screen after profile creation. This logic appears to be broken or incomplete.

```ts
// useEffect(() => {
//   if (hasProfile) {
//     router.replace('/(protected)/(tabs)/map');
//   }
// }, [hasProfile]);
```

**Risk Level:** `LOW`

**The Solution:**
The navigation after profile creation should be triggered by the Supabase realtime subscription in `useAuthSession` (which already calls `setHasProfile(true)` on a profile `INSERT` event), and the `ProtectedLayout` guard will handle the redirect automatically. Remove the commented code to keep the file clean.

**Why:** Dead code confuses future developers about the intended navigation flow.

---

## 5. Code Bloat & Consistency

---

### 🟠 BLOAT-01 — Unused Dependencies in `package.json`

**The Problem:**
Several packages are installed but appear unused in the codebase:

| Package                         | Status                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `aes-js` + `@types/aes-js`      | Not imported anywhere. Likely leftover from a manual encryption attempt for the "Remember Me" feature. |
| `expo-sqlite`                   | Not imported anywhere.                                                                                 |
| `react-native-sonner`           | Not imported. The app uses `react-native-toast-message`.                                               |
| `@react-navigation/bottom-tabs` | Expo Router's `Tabs` wraps this; direct usage not needed.                                              |
| `@react-navigation/elements`    | Same as above.                                                                                         |

**Risk Level:** `LOW`

**The Solution:**

```sh
npx expo install --fix
# then remove unused packages:
npm uninstall aes-js @types/aes-js expo-sqlite react-native-sonner
```

**Why:** Unused dependencies increase bundle size, increase attack surface (supply chain risk), and slow down `npm install` in CI. `aes-js` in particular is suspicious — if encryption was being planned for password storage, that's a design smell that was caught by SEC-01.

---

### 🟡 BLOAT-02 — `error: any` Type Bypass in `ProfileSetupForm`

**The Problem:**
The catch block uses `error: any`, defeating TypeScript's type safety.

```ts
} catch (error: any) {
  Toast.show({ text2: error?.message ?? 'Please try again.' });
}
```

**Risk Level:** `LOW`

**The Solution:**

```ts
} catch (err) {
  const message = err instanceof Error ? err.message : 'Please try again.';
  Toast.show({ type: 'error', text1: 'Failed to create profile', text2: message });
}
```

**Why:** `catch (error: any)` silences TypeScript and can hide incorrect error handling. Proper narrowing is two lines and is safer.

---

### 🟡 BLOAT-03 — `ROUTES` Constants Use Incorrect Path Format for Expo Router

**The Problem:**
The `ROUTES` object (even if it were used) maps to paths like `/sign-in`, `/dashboard`, and `/profile-setup`. These don't match Expo Router's actual file-based paths (e.g., `/(auth)/sign-in`, `/(protected)/(tabs)/map`).

**Risk Level:** `LOW`

**The Solution:**
Update the file to match Expo Router's actual route structure, or delete it entirely since navigation is handled by the layout guards (no explicit `router.push` is needed for the primary auth/profile flows).

**Why:** Incorrect constants that don't match the router's expectations would cause silent navigation failures if they were actually used.

---

## 6. Responsiveness & UX

---

### 🟠 UX-01 — `sm:` Responsive Breakpoints Used on React Native

**The Problem:**
Multiple screens use NativeWind responsive prefixes like `sm:py-4` and `sm:p-6`:

```tsx
// app/(auth)/sign-in/index.tsx
contentContainerClassName = 'items-center px-4 py-8 sm:py-4 sm:p-6';
```

In React Native, NativeWind's responsive breakpoints are not based on viewport width (as in the web). They work based on **platform** (`android:`, `ios:`, `web:`) or **device pixel density**, not screen size. The `sm:` prefix will have no effect on a phone where the screen is technically smaller than 640px.

**Risk Level:** `MEDIUM`

**The Solution:**
Replace web-style breakpoints with platform or dimension-based logic:

```tsx
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const isTablet = width >= 640;

// Then apply conditionally:
contentContainerStyle={{
  flexGrow: 1,
  justifyContent: 'center',
  paddingHorizontal: isTablet ? 24 : 16,
  paddingVertical: isTablet ? 16 : 32,
}}
```

**Why:** The `sm:` prefix silently does nothing in RN, giving a false impression that tablet layout is handled when it is not.

---

### 🟡 UX-02 — No `accessibilityLabel` on Icon-Only Buttons

**The Problem:**
Icon-only buttons (the sign-out button, the OAuth buttons, the tab bar icon) have no `accessibilityLabel`. Screen readers will announce these as "button" with no context.

```tsx
// ProfileSetupScreen
<Button variant="secondary" size="icon" onPress={handleSignOut}>
  <HugeiconsIcon icon={Logout02Icon} ... />
</Button>
```

**Risk Level:** `LOW`

**The Solution:**

```tsx
<Button
  variant="secondary"
  size="icon"
  onPress={handleSignOut}
  accessibilityLabel="Sign out"
  accessibilityRole="button"
>
```

**Why:** Accessibility is a legal requirement in many markets and a quality signal for production apps. Screen reader users (including users with motor disabilities who use switch access) cannot use the app without proper labels.

---

### 🟡 UX-03 — "Don't have an account?" Copy Has a Typo

**The Problem:**
The sign-in screen has a grammatical error: `Dont` is missing an apostrophe.

```tsx
// app/(auth)/sign-in/index.tsx
<Text>Dont have an account?{' '} ...
```

**Risk Level:** `LOW`

**The Solution:**

```tsx
<Text>Don't have an account?{' '}
```

**Why:** Copy quality reflects the professionalism of the product.

---

## Summary Table

| ID       | Category     | Issue                                          | Risk        |
| -------- | ------------ | ---------------------------------------------- | ----------- |
| SEC-01   | Security     | Plaintext password in SecureStore              | 🔴 Critical |
| SEC-02   | Security     | MIME type spoofing in avatar upload            | 🔴 High     |
| SEC-03   | Security     | Password reset has no `redirectTo` deep link   | 🔴 High     |
| SEC-04   | Security     | `checkProfile` silently ignores DB errors      | 🟠 High     |
| SEC-05   | Security     | `createProfile` re-fetches session (TOCTOU)    | 🟠 Medium   |
| SEC-06   | Security     | OAuth buttons are non-functional stubs         | 🟠 Medium   |
| SEC-07   | Security     | No email verification gate                     | 🟡 Medium   |
| ARCH-01  | Architecture | Profile state duplicated in two places         | 🔴 High     |
| ARCH-02  | Architecture | Sign-out logic duplicated in two screens       | 🟠 Medium   |
| ARCH-03  | Architecture | `useRememberMe` is not a hook                  | 🟡 Low      |
| ARCH-04  | Architecture | `ROUTES` constants defined but unused          | 🟡 Low      |
| ARCH-05  | Architecture | `ProfileProvider` is a misnomer                | 🟡 Low      |
| PERF-01  | Performance  | `useTheme()` called but result unused          | 🟠 Low      |
| PERF-02  | Performance  | Inefficient 3-step image conversion            | 🟠 Low      |
| PERF-03  | Performance  | Hardcoded tab colors bypass dark mode theme    | 🟡 Low      |
| PROD-01  | Production   | `console.log` with state data in root layout   | 🟠 Medium   |
| PROD-02  | Production   | Logger outputs to console in all environments  | 🟠 Medium   |
| PROD-03  | Production   | `isLoading` never resets on successful sign-in | 🟠 Medium   |
| PROD-04  | Production   | No React Error Boundary                        | 🟠 Medium   |
| PROD-05  | Production   | `getSession` bootstrap has no error handling   | 🟠 Medium   |
| PROD-06  | Production   | Commented-out navigation code left in          | 🟡 Low      |
| BLOAT-01 | Bloat        | 5 unused dependencies in `package.json`        | 🟠 Low      |
| BLOAT-02 | Bloat        | `error: any` bypasses TypeScript               | 🟡 Low      |
| BLOAT-03 | Bloat        | `ROUTES` paths don't match Expo Router         | 🟡 Low      |
| UX-01    | UX/Layout    | `sm:` breakpoints are no-ops in React Native   | 🟠 Medium   |
| UX-02    | UX/A11y      | No `accessibilityLabel` on icon buttons        | 🟡 Low      |
| UX-03    | UX/Copy      | Missing apostrophe in sign-in copy             | 🟡 Low      |

---

## Recommended Fix Priority

1. **Immediate (before next release):** SEC-01, SEC-03, PROD-03, PROD-05, ARCH-01
2. **Short-term (next sprint):** SEC-02, SEC-04, SEC-05, SEC-06, PROD-02, PROD-04
3. **Backlog:** Everything else

---
