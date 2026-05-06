import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

type InputProps = Omit<TextInputProps, 'placeholderTextColor'> & {
  className?: string;
  invalid?: boolean;
};

function Input({ className, invalid, editable = true, ...props }: InputProps) {
  const theme = useTheme();

  return (
    <TextInput
      className={cn(
        'h-12 w-full rounded-lg border border-input bg-transparent font-serif px-3 text-base',
        !editable && 'opacity-50',
        invalid && 'border-destructive',
        className,
      )}
      style={{ color: theme.foreground, fontSize: 16 }}
      placeholderTextColor={theme.mutedForeground}
      editable={editable}
      {...props}
    />
  );
}

export { Input, type InputProps };
