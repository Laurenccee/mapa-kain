import InputField from '@/components/shared/InputField';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight02Icon,
  LockPasswordIcon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SignInData, SignInSchema } from '../schemas/authSchema';
import FormActions from './FormActions';

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { control, handleSubmit } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        Toast.show({ type: 'error', text1: error.message });
        setIsLoading(false);
        return;
      }
    } catch {
      Toast.show({ type: 'error', text1: 'An unexpected error occurred.' });
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
          isPending={isLoading}
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
          isPending={isLoading}
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
      <FormActions rememberMe={rememberMe} onRememberMeChange={setRememberMe} />
      <Button
        size="lg"
        onPress={handleSubmit(handleSignIn)}
        disabled={isLoading}
      >
        <Text className="text-lg">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Text>
        {isLoading ? (
          <Spinner size={18} />
        ) : (
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={18}
            className="text-primary-foreground"
          />
        )}
      </Button>
    </View>
  );
}
