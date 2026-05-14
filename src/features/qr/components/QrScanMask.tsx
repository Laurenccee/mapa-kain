import { StyleSheet } from "react-native";
import Svg, { Defs, Mask, Rect } from "react-native-svg";

import { MASK_DIM } from "../utils/constants";

interface QrScanMaskProps {
  width: number;
  height: number;
  cutoutX: number;
  cutoutY: number;
  cutoutSize: number;
  maskId: string;
}

export function QrScanMask({
  width,
  height,
  cutoutX,
  cutoutY,
  cutoutSize,
  maskId,
}: QrScanMaskProps) {
  if (width <= 0 || height <= 0) return null;
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <Mask id={maskId} x={0} y={0} width={width} height={height}>
          <Rect width={width} height={height} fill="#ffffff" />
          <Rect
            x={cutoutX}
            y={cutoutY}
            width={cutoutSize}
            height={cutoutSize}
            rx={18}
            ry={18}
            fill="#000000"
          />
        </Mask>
      </Defs>
      <Rect
        width={width}
        height={height}
        fill={MASK_DIM}
        mask={`url(#${maskId})`}
      />
    </Svg>
  );
}
