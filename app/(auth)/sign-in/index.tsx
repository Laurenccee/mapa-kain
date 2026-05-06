import LabeledSeparator from '@/components/shared/LabeledSeparator';
import { Text } from '@/components/ui/text';
import OAuthButtons from '@/features/auth/components/OAuthButtons';
import SignInForm from '@/features/auth/components/SignInForm';
import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
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
            <Text variant="h1" className="text-center">
              Welcome back!
            </Text>
            <Text variant="p" className="mt-0 text-center">
              Your local favorites are waiting for you.
            </Text>
          </View>
          <View className="flex-col gap-4">
            <SignInForm />
            <LabeledSeparator label="or continue with" />
            <OAuthButtons />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Link href="/sign-up" replace className="flex-row text-center py-4">
        <Text>
          Dont have an account?{' '}
          <Text className="underline">Create an account</Text>
        </Text>
      </Link>
    </SafeAreaView>
  );
}
