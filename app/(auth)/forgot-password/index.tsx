import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import ForgetPasswordForm from '@/features/auth/components/ForgetPasswordForm';
import {
  ArrowLeft01Icon,
  InformationSquareIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgetPasswordScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 mb-safe">
      <View className="px-4">
        <Button variant="secondary" size="icon" onPress={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="text-foreground" />
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
          <View className="flex-col ">
            <Text variant="h1">Forgot Password</Text>
            <Text variant="p" className="mt-0">
              Don't worry! Enter your email and we'll send you a link to reset
              your password.
            </Text>
          </View>
          <ForgetPasswordForm />
          <Card>
            <CardContent className="flex-row gap-2 items-center">
              <HugeiconsIcon
                icon={InformationSquareIcon}
                size={24}
                className="text-muted-foreground"
              />
              <Text className="text-sm text-foreground">
                Can't access your email? Please contact our support collective
                for manual account verification.
              </Text>
            </CardContent>
          </Card>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
