import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { QrScanMask } from "@/features/qr/components/QrScanMask";
import { useQrScanner } from "@/features/qr/hooks/useQrScanner";
import {
  ArrowLeft01Icon,
  ImageUpload01Icon,
  QrCodeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QrScreen() {
  const router = useRouter();
  const {
    permission,
    requestPermission,
    layout,
    onLayout,
    cutout,
    maskId,
    onBarcodeScanned,
    onUploadPress,
  } = useQrScanner();

  const isWeb = Platform.OS === "web";

  return (
    <View
      className="flex-1 bg-black"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        onLayout(width, height);
      }}
    >
      <StatusBar style="light" />

      {isWeb ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-white">
            QR scanning runs on iOS and Android. Open this screen on your phone.
          </Text>
        </View>
      ) : permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          active
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={onBarcodeScanned}
        />
      ) : permission === null ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#fff" />
        </View>
      ) : (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text className="text-center text-base text-white">
            Camera access is required to scan QR codes.
          </Text>
          <Button onPress={() => void requestPermission()}>
            <Text className="text-primary-foreground">Allow camera</Text>
          </Button>
        </View>
      )}

      {!isWeb && permission?.granted && layout.width > 0 ? (
        <>
          <QrScanMask
            width={layout.width}
            height={layout.height}
            cutoutX={cutout.x}
            cutoutY={cutout.y}
            cutoutSize={cutout.size}
            maskId={maskId}
          />
          <View
            pointerEvents="none"
            style={[
              styles.cutoutFrame,
              {
                left: cutout.x,
                top: cutout.y,
                width: cutout.size,
                height: cutout.size,
              },
            ]}
          />
        </>
      ) : null}

      <SafeAreaView
        className="absolute inset-0"
        edges={["top", "bottom"]}
        pointerEvents="box-none"
      >
        <View className="flex-row items-center gap-2 px-3 pt-1">
          <Button variant="secondary" size="icon" onPress={() => router.back()}>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="text-foreground" />
          </Button>

          <Text className="flex-1 pr-11 text-center text-base font-semibold text-foreground">
            Scan a QR code
          </Text>
        </View>

        <View className="flex-1" />

        <View className="flex-row gap-3 px-4 pb-2">
          <Pressable
            onPress={() => void onUploadPress()}
            className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-3 active:bg-neutral-800"
            accessibilityRole="button"
            accessibilityLabel="Upload QR from gallery"
          >
            <HugeiconsIcon icon={ImageUpload01Icon} color="#fff" size={22} />
            <Text className="text-sm font-medium text-white">Upload QR</Text>
          </Pressable>
          <Pressable
            onPress={() => console.log("Show my QR pressed")}
            className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-3 active:bg-neutral-800"
            accessibilityRole="button"
            accessibilityLabel="Show my QR code"
          >
            <HugeiconsIcon icon={QrCodeIcon} color="#fff" size={22} />
            <Text className="text-sm font-medium text-white">Show my QR</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cutoutFrame: {
    position: "absolute",
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.9)",
  },
});
