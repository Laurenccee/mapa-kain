import { useTheme } from '@/hooks/useTheme';
import { EyeIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { View } from 'react-native';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group';
import { Text } from '../ui/text';

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  isPending?: boolean;
  secureTextEntry?: boolean;
  placeholder?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export default function InputField<T extends FieldValues>({
  name,
  label,
  control,
  isPending = false,
  secureTextEntry = false,
  placeholder,
  leadingIcon,
  trailingIcon,
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <View className="gap-1 ">
          <Text className="uppercase text-sm tracking-widest text-muted-foreground ml-1">
            {label}
          </Text>
          <InputGroup invalid={fieldState.invalid}>
            {leadingIcon && (
              <InputGroupAddon align="inline-start">
                {leadingIcon}
              </InputGroupAddon>
            )}
            <InputGroupInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry && !showPassword}
              autoComplete={secureTextEntry ? 'current-password' : undefined}
              editable={!isPending}
              invalid={fieldState.invalid}
            />
            {secureTextEntry ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton onPress={() => setShowPassword((v) => !v)}>
                  <HugeiconsIcon
                    icon={showPassword ? ViewOffIcon : EyeIcon}
                    className="text-muted-foreground"
                  />
                </InputGroupButton>
              </InputGroupAddon>
            ) : (
              trailingIcon && (
                <InputGroupAddon align="inline-end" className="pr-3">
                  {trailingIcon}
                </InputGroupAddon>
              )
            )}
          </InputGroup>
          {fieldState.error?.message && (
            <Text className="text-xs text-rose-500 ml-1">
              {fieldState.error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
