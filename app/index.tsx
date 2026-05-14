import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => !!s.session);
  const hasProfile = useProfileStore((s) => s.hasProfile);

  if (isAuthenticated && hasProfile === null) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  if (!hasProfile) {
    return <Redirect href="/setup" />;
  }

  return <Redirect href="/map" />;
}
