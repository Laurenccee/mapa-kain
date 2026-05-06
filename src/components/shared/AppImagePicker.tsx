import { Text } from '@/components/ui/text';
import {
  Camera01Icon,
  KitchenUtensilsIcon,
  User03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Alert, Image, TouchableOpacity, View } from 'react-native';

interface AppImagePickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  variant?: 'avatar' | 'menu';
  disabled?: boolean;
}

export function AppImagePicker<T extends FieldValues>({
  name,
  control,
  label,
  variant = 'avatar',
  disabled = false,
}: AppImagePickerProps<T>) {
  const isAvatar = variant === 'avatar';
  const aspectRatio: [number, number] = isAvatar ? [1, 1] : [4, 3];
  const borderRadius = isAvatar ? 'rounded-[1rem]' : 'rounded-2xl';
  const containerSize = isAvatar ? 'w-32 h-32' : 'w-full h-48';

  const handlePickImage = async (onChange: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Access to photos is needed to continue.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspectRatio,
      quality: 0.6,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => (
        <View className={`gap-1 ${isAvatar ? 'items-center' : ''}`}>
          {label && (
            <Text className="uppercase text-sm tracking-widest text-muted-foreground ml-1 self-start">
              {label}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => handlePickImage(onChange)}
            activeOpacity={0.8}
            disabled={disabled}
            className={`relative ${containerSize} ${borderRadius} overflow-hidden border-2 border-dashed ${
              fieldState.invalid ? 'border-destructive' : 'border-border'
            } bg-secondary items-center justify-center`}
          >
            {value ? (
              <Image
                source={{ uri: value }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center gap-2">
                <HugeiconsIcon
                  icon={isAvatar ? User03Icon : KitchenUtensilsIcon}
                  size={22}
                  className={
                    fieldState.invalid
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }
                />
                <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Add {isAvatar ? 'Photo' : 'Food Photo'}
                </Text>
              </View>
            )}

            <View className="absolute bottom-1 z-10 right-1 bg-primary p-1.5 rounded-full border-2 border-background">
              <HugeiconsIcon
                icon={Camera01Icon}
                size={14}
                className="text-primary-foreground"
              />
            </View>
          </TouchableOpacity>

          {!value && !fieldState.invalid && (
            <Text className="text-muted-foreground text-xs">
              {isAvatar
                ? 'Let owners recognize you'
                : "Show them what's cooking today!"}
            </Text>
          )}
          {fieldState.error && (
            <Text className="text-destructive text-xs ml-1">
              {fieldState.error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
