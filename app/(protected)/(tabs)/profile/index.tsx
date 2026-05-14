import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Toast.show({
          type: "error",
          text1: "Error signing out:",
          text2: error.message,
        });

        setIsLoading(false);
        return;
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error signing out:",
      });
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-background py-4">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="w-full text-center text-4xl">John Doe</Text>
        <Text className="text-center text-base">example@email.com</Text>
        <View className="mt-4 w-full gap-2 rounded-2xl bg-card py-2">
          <Pressable onPress={handleSignOut} disabled={isLoading}>
            <Text className="text-center">Log out</Text>
          </Pressable>
          <Separator />
          <Pressable>
            <Text className="text-center">Reset Onboarding</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
