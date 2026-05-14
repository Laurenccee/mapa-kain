import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/stores/authStore";
import React from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrCode() {
  const userId = useAuthStore((s) => s.session?.user.id);
  const qrValue = userId ? `onspot://user/${userId}` : "";
  return (
    <View className="items-center justify-center gap-8 rounded-lg border border-border bg-card p-6">
      <View className="rounded-lg border-2 border-border bg-white p-4">
        <QRCode
          value={qrValue}
          size={220}
          logoSize={50}
          logoBackgroundColor={"transparent"}
          logoMargin={5}
          logoBorderRadius={10}
        />
      </View>

      <View>
        <Text className="text-center text-xl font-semibold tracking-tight text-primary">
          Suki QR Code
        </Text>
        <Text className="text-center text-muted-foreground">
          Show this to the cashier to earn points
        </Text>
      </View>
    </View>
  );
}
