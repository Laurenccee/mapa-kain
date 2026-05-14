import type { BarcodeScanningResult } from "expo-camera";

export function barcodeCenterInCutout(
  result: BarcodeScanningResult,
  cutout: { x: number; y: number; size: number },
): boolean {
  const { bounds } = result;
  const w = bounds.size.width;
  const h = bounds.size.height;
  if (w <= 0 || h <= 0) return true;
  const cx = bounds.origin.x + w / 2;
  const cy = bounds.origin.y + h / 2;
  return (
    cx >= cutout.x &&
    cx <= cutout.x + cutout.size &&
    cy >= cutout.y &&
    cy <= cutout.y + cutout.size
  );
}
