import { Separator } from '@/components/ui/separator';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 py-4 bg-background">
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-secondary text-4xl font-serif text-center">
          John Doe
        </Text>
        <Text className="text-secondary/70 text-base font-oswald text-center">
          example@email.com
        </Text>
        <View className="mt-4 py-4 rounded-2xl w-full gap-4 bg-white">
          <Pressable>
            <Text className="text-secondary/70 text-base font-oswald text-center">
              Log out
            </Text>
          </Pressable>
          <Separator />
          <Pressable>
            <Text className="text-secondary/70 text-base font-oswald text-center">
              Reset Onboarding
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
