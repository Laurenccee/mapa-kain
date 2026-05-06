import InputField from '@/components/shared/InputField';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  ForgetPasswordData,
  ForgetPasswordSchema,
} from '../schemas/authSchema';

export default function ForgetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const { control, handleSubmit } = useForm<ForgetPasswordData>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgetPassword = async (data: ForgetPasswordData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);
      if (error) {
        Toast.show({ type: 'error', text1: error.message });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Password reset link sent to your email.',
        });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-col gap-4">
      <View className="flex-col gap-2">
        <InputField
          name="email"
          label="Email"
          placeholder="Email"
          control={control}
          leadingIcon={
            <HugeiconsIcon
              icon={Mail01Icon}
              size={24}
              className="text-muted-foreground"
            />
          }
        />
      </View>
      <Button
        size="lg"
        onPress={handleSubmit(handleForgetPassword)}
        disabled={isLoading}
      >
        <Text className="text-lg">
          {isLoading ? 'Sending...' : 'Send Password Reset Link'}
        </Text>
        {isLoading ? (
          <Spinner size={18} />
        ) : (
          <HugeiconsIcon
            icon={Mail01Icon}
            size={18}
            className="text-primary-foreground"
          />
        )}
      </Button>
    </View>
  );
}
