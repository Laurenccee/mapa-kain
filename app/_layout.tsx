import { useAuthSession } from '@/hooks/useAuthSession';
import { ProfileProvider } from '@/providers/ProfileProvider';
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import {
  InstrumentSerif_400Regular,
  useFonts,
} from '@expo-google-fonts/instrument-serif';
import { PortalHost } from '@rn-primitives/portal';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'InstrumentSerif-Regular': InstrumentSerif_400Regular,
  });

  useAuthSession();
  const isAuthenticated = useAuthStore((s) => !!s.session);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isProfileInitialized = useProfileStore((s) => s.isProfileInitialized);

  useEffect(() => {
    if (fontsLoaded && isInitialized && isProfileInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isInitialized, isProfileInitialized]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View className="flex-1 bg-background">
          <KeyboardProvider>
            <ProfileProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              >
                <Stack.Protected guard={!isAuthenticated}>
                  <Stack.Screen name="(auth)" />
                </Stack.Protected>
                <Stack.Protected guard={isAuthenticated}>
                  <Stack.Screen name="(protected)" />
                </Stack.Protected>
              </Stack>
              <PortalHost />
              <Toast />
            </ProfileProvider>
          </KeyboardProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
