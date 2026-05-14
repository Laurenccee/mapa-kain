import { TabBar } from "@/components/layouts/TabBar";
import { MapPinIcon, Newspaper, User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
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
        name="feed"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Newspaper} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={User02Icon} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
