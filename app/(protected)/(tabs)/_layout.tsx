import { MapingIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#141053',
        tabBarInactiveTintColor: 'rgba(20,16,83,0.5)',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={MapingIcon} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
