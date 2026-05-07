import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import {
  MapPinIcon,
  QrCodeIcon,
  Settings01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';

const ROUTE_ICONS: Record<string, any> = {
  'map/index': MapPinIcon,
  'settings/index': Settings01Icon,
};

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();
  return (
    <View
      className="absolute left-0 right-0 bottom-0 flex-row justify-center pb-safe gap-4 z-50 items-center"
      pointerEvents="box-none"
    >
      <View className="flex-row bg-card rounded-2xl px-2 py-2 gap-1 pointer-events-auto">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name.replace(/\/index$/, '');

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              className={cn(
                'flex-col items-center justify-center gap-1 w-20 h-14 px-4 py-2 rounded-xl transition-all ease-in-out',
                isFocused ? 'bg-primary' : 'bg-transparent',
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
                  'text-[11px] tracking-wide capitalize',
                  isFocused
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* QR floating action button */}
      <View
        className="pointer-events-auto rounded-2xl overflow-hidden"
        style={{
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        }}
      >
        <Pressable
          className="items-center justify-center bg-primary w-16 h-16 rounded-2xl"
          onPress={() => {
            // TODO: Open your QR modal here
          }}
          accessibilityLabel="Open QR"
          accessibilityRole="button"
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
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
