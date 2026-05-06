import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import ProfileSetupForm from '@/features/profile/components/ProfileSetupForm';
import { supabase } from '@/lib/supabase';
import { Logout02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function ProfileSetupScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Error signing out:',
          text2: error.message,
        });

        setIsLoading(false);
        return;
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error signing out:',
      });
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 mb-safe">
      <View className="px-4 self-end">
        <Button
          variant="secondary"
          size="icon"
          onPress={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size={18} />
          ) : (
            <HugeiconsIcon
              icon={Logout02Icon}
              className="text-muted-foreground"
            />
          )}
        </Button>
      </View>
      <KeyboardAwareScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="items-center px-4 py-8 sm:py-4 sm:p-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardDismissMode="interactive"
      >
        <View className="w-full flex-col gap-8">
          <View className="flex-col">
            <Text variant="h1">Create Your Profile</Text>
            <Text variant="p" className="mt-0">
              Let's start by setting up your profile. This will help us
              personalize.
            </Text>
          </View>
          <ProfileSetupForm />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
