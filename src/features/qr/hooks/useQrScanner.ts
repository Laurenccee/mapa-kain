import {
  type BarcodeScanningResult,
  scanFromURLAsync,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Linking, Platform, Share } from "react-native";
import Toast from "react-native-toast-message";

import { barcodeCenterInCutout } from "../utils/barcode";
import { CUTOUT_RATIO, SCAN_COOLDOWN_MS } from "../utils/constants";

export function useQrScanner() {
  const router = useRouter();
  const maskIdRef = useRef(`qrMask_${Math.random().toString(36).slice(2, 11)}`);
  const [permission, requestPermission] = useCameraPermissions();
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const lastScanRef = useRef({ at: 0, data: "" });

  const cutout = useMemo(() => {
    const { width: w, height: h } = layout;
    if (!w || !h) return { x: 0, y: 0, size: 0 };
    const size = Math.min(w, h) * CUTOUT_RATIO;
    const x = (w - size) / 2;
    const y = (h - size) / 2 + 12;
    return { x, y, size };
  }, [layout]);

  const onLayout = useCallback((width: number, height: number) => {
    setLayout((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  const handlePayload = useCallback(
    async (data: string) => {
      const trimmed = data.trim();
      if (!trimmed) return;

      try {
        const canOpen = await Linking.canOpenURL(trimmed);
        if (canOpen) {
          await Linking.openURL(trimmed);
          router.back();
          return;
        }
      } catch {
        /* fall through */
      }

      Alert.alert("QR code", trimmed, [
        { text: "OK", style: "default" },
        {
          text: "Share",
          onPress: () => {
            void Share.share({ message: trimmed }).catch(() => undefined);
          },
        },
      ]);
    },
    [router],
  );

  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (cutout.size <= 0 || !barcodeCenterInCutout(result, cutout)) return;

      const now = Date.now();
      if (
        now - lastScanRef.current.at < SCAN_COOLDOWN_MS &&
        lastScanRef.current.data === result.data
      ) {
        return;
      }
      lastScanRef.current = { at: now, data: result.data };

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      void handlePayload(result.data);
    },
    [cutout, handlePayload],
  );

  const onUploadPress = useCallback(async () => {
    if (Platform.OS === "web") {
      Toast.show({
        type: "info",
        text1: "Upload QR is available on the mobile app.",
      });
      return;
    }
    try {
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!lib.granted) {
        Toast.show({
          type: "error",
          text1: "Photos access is needed to scan from an image.",
        });
        return;
      }

      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (picked.canceled || !picked.assets[0]?.uri) return;

      const results = await scanFromURLAsync(picked.assets[0].uri, ["qr"]);
      const first = results[0];
      if (!first?.data) {
        Toast.show({
          type: "info",
          text1: "No QR code found in that image.",
        });
        return;
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await handlePayload(first.data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Could not read that image.",
      });
    }
  }, [handlePayload]);

  return {
    permission,
    requestPermission,
    layout,
    onLayout,
    cutout,
    maskId: maskIdRef.current,
    onBarcodeScanned,
    onUploadPress,
  };
}
