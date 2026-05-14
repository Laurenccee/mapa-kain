import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import {
  MapPinIcon,
  Newspaper,
  QrCodeIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../ui/text";

const ROUTE_ICONS: Record<string, any> = {
  "map/index": MapPinIcon,
  "feed/index": Newspaper,
  "profile/index": User02Icon,
};

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <View
      className="pb-safe absolute bottom-7 left-0 right-0 z-50 flex-row items-center justify-center gap-4"
      pointerEvents="box-none"
    >
      <View
        className="pointer-events-auto flex-row gap-1 rounded-2xl bg-card px-2 py-2"
        style={{
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel ??
            options.title ??
            route.name.replace(/\/index$/, "");

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              onLongPress={() =>
                navigation.emit({ type: "tabLongPress", target: route.key })
              }
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              className={cn(
                "h-14 w-20 flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-all ease-in-out",
                isFocused ? "bg-primary" : "bg-transparent",
              )}
            >
              {ROUTE_ICONS[route.name] && (
                <HugeiconsIcon
                  icon={ROUTE_ICONS[route.name]}
                  color={
                    isFocused ? theme.primaryForeground : theme.mutedForeground
                  }
                  size={20}
                />
              )}

              <Text
                className={cn(
                  "text-[11px] capitalize tracking-wide",
                  isFocused
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        className="pointer-events-auto overflow-hidden rounded-2xl"
        style={{
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        }}
      >
        <Pressable
          className="h-16 w-16 items-center justify-center rounded-2xl bg-primary"
          onPress={() => {
            router.push("/(protected)/(qr)/index");
          }}
          accessibilityLabel="Open QR"
          accessibilityRole="button"
          android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
        >
          <HugeiconsIcon
            icon={QrCodeIcon}
            className="text-primary-foreground"
            strokeWidth={1.7}
            size={32}
          />
        </Pressable>
      </View>
    </View>
  );
}
