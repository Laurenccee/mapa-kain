import LabeledSeparator from '@/components/shared/LabeledSeparator';
import { Text } from '@/components/ui/text';
import OAuthButtons from '@/features/auth/components/OAuthButtons';
import SignUpForm from '@/features/auth/components/SignUpForm';
import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="items-center px-4 py-8 sm:py-4 sm:p-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardDismissMode="interactive"
      >
        <View className="w-full flex-col gap-8">
          <View className="flex-col">
            <Text variant="h1">Join the Neighborhood</Text>
            <Text variant="p" className="mt-0">
              Create your account to start discovering the best hyper-local
              flavors around you.
            </Text>
          </View>
          <View className="flex-col gap-6">
            <SignUpForm />
            <LabeledSeparator label="or continue with" />
            <OAuthButtons />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Link href="/sign-in" replace className="flex-row text-center py-4">
        <Text>
          Already have an account? <Text className="underline">Sign In</Text>
        </Text>
      </Link>
    </SafeAreaView>
  );
}
