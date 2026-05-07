import { TabBar } from '@/components/layouts/TabBar';
import { useTheme } from '@/hooks/useTheme';
import { MapPinIcon, Settings01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={MapPinIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Settings01Icon} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
