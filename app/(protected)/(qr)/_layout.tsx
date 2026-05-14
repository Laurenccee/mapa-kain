import { useProfileStore } from "@/stores/profileStore";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function QrLayout() {
  const hasCarenderia = useProfileStore((s) => s.hasCarenderia);

  if (hasCarenderia === null) {
    return <ActivityIndicator />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Protected guard={!!hasCarenderia}>
        <Stack.Screen name="qr-scanner" options={{ presentation: "modal" }} />
      </Stack.Protected>
      <Stack.Protected guard={!hasCarenderia}>
        <Stack.Screen name="my-qr" options={{ presentation: "modal" }} />
      </Stack.Protected>
    </Stack>
  );
}
