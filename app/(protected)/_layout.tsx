import { useProfileStore } from '@/stores/profileStore';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  const hasProfile = useProfileStore((s) => s.hasProfile);

  // Wait for profile check before rendering
  if (hasProfile === null) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Protected guard={!hasProfile}>
        <Stack.Screen name="(profile)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={hasProfile}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
