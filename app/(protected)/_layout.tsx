import { useProfileStore } from '@/stores/profileStore';
import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function ProtectedLayout() {
  const hasProfile = useProfileStore((s) => s.hasProfile);
  const router = useRouter();

  if (hasProfile === null) {
    return <ActivityIndicator />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Protected guard={!hasProfile}>
        <Stack.Screen name="(profile)/setup/index" />
      </Stack.Protected>
      <Stack.Protected guard={!!hasProfile}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
