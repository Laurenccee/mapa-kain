import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="sign-in/index" />
      <Stack.Screen name="sign-up/index" />
      <Stack.Screen name="forgot-password/index" />
    </Stack>
  );
}
