import { useProfileStore } from "@/stores/profileStore";
import { Redirect } from "expo-router";

export default function QrIndex() {
  const hasCarenderia = useProfileStore((s) => s.hasCarenderia);
  return (
    <Redirect
      href={
        hasCarenderia
          ? "/(protected)/(qr)/qr-scanner"
          : "/(protected)/(qr)/my-qr"
      }
    />
  );
}
