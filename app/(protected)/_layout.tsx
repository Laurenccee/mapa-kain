import { useProfileStore } from '@/stores/profileStore';
import { Stack, useRouter } from 'expo-router';

export default function ProtectedLayout() {
  const hasProfile = useProfileStore((s) => s.hasProfile);
  const router = useRouter();

  if (hasProfile === null) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Protected guard={!hasProfile}>
        <Stack.Screen name="(profile)/setup" />
      </Stack.Protected>
      <Stack.Protected guard={hasProfile}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
