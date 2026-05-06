import { AppImagePicker } from '@/components/shared/AppImagePicker';
import InputField from '@/components/shared/InputField';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useProfileStore } from '@/stores/profileStore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight02Icon,
  AtIcon,
  TelephoneIcon,
  UserAccountIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { ProfileFormValues, profileSchema } from '../schemas/profileSchema';
import { createProfile } from '../services/profileServices';

export default function ProfileSetupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const setHasProfile = useProfileStore((s) => s.setHasProfile);
  const hasProfile = useProfileStore((s) => s.hasProfile);
  const router = useRouter();

  const { control, handleSubmit } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      username: '',
      phone_number: '',
      avatar_url: '',
    },
  });

  const handleProfileSetup = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await createProfile(data);
      Toast.show({ type: 'success', text1: 'Profile created successfully!' });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to create profile',
        text2: error?.message ?? 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasProfile) {
      router.replace('/(protected)/(tabs)/map');
    }
  }, [hasProfile]);

  return (
    <View className="flex flex-col gap-4">
      <AppImagePicker name="avatar_url" control={control} variant="avatar" />
      <View className="flex-col gap-2">
        <InputField
          name="full_name"
          label="Full Name"
          placeholder="Full Name"
          control={control}
          isPending={isLoading}
          leadingIcon={
            <HugeiconsIcon
              icon={UserAccountIcon}
              size={24}
              className="text-muted-foreground"
            />
          }
        />
        <InputField
          name="username"
          label="Username"
          placeholder="Username"
          control={control}
          isPending={isLoading}
          leadingIcon={
            <HugeiconsIcon
              icon={AtIcon}
              size={24}
              className="text-muted-foreground"
            />
          }
        />
        <InputField
          name="phone_number"
          label="Phone Number (Optional)"
          placeholder="(+63XXXXXXXXX)"
          control={control}
          isPending={isLoading}
          keyboardType="phone-pad"
          onChangeText={(text, onChange) => {
            const val = text.replace(/\s+/g, '');
            if (val.startsWith('09')) {
              onChange(`+63${val.slice(1)}`);
            } else {
              onChange(val);
            }
          }}
          leadingIcon={
            <HugeiconsIcon
              icon={TelephoneIcon}
              size={24}
              className="text-muted-foreground"
            />
          }
        />
      </View>
      <Button
        size="lg"
        onPress={handleSubmit(handleProfileSetup)}
        disabled={isLoading}
      >
        <Text className="text-lg">
          {isLoading ? 'Creating Profile...' : 'Set Up Profile'}
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
