import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import QrCode from "@/features/qr/components/QrCode";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyQrScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-row items-center gap-2 px-3 pt-1">
        <Button variant="secondary" size="icon" onPress={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="text-foreground" />
        </Button>

        <Text className="flex-1 pr-11 text-center text-base font-semibold text-foreground">
          My QR Code
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <QrCode />
      </View>
    </SafeAreaView>
  );
}
