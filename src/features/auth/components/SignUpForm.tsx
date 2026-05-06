import InputField from '@/components/shared/InputField';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockPasswordIcon, Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SignUpData, SignUpSchema } from '../schemas/authSchema';

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const { control, handleSubmit } = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) {
        Toast.show({ type: 'error', text1: error.message });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Check your email to confirm your account!',
        });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex flex-col gap-4">
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
        <InputField
          name="password"
          label="Password"
          placeholder="Password"
          control={control}
          leadingIcon={
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={24}
              className="text-muted-foreground"
            />
          }
          secureTextEntry
        />
        <InputField
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-type Password"
          control={control}
          leadingIcon={
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={24}
              className="text-muted-foreground"
            />
          }
          secureTextEntry
        />
      </View>

      <Button
        size="lg"
        onPress={handleSubmit(handleSignUp)}
        disabled={isLoading}
      >
        <Text className="text-lg">
          {isLoading ? 'Creating account...' : 'Create Account'}
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
