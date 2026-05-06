import { Button, type ButtonProps } from '@/components/ui/button';
import { Input, type InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

// Context so InputGroupInput can notify the group when focused/blurred
type InputGroupContextValue = {
  focused: boolean;
  setFocused: (v: boolean) => void;
  invalid: boolean;
};

const InputGroupContext = React.createContext<InputGroupContextValue>({
  focused: false,
  setFocused: () => {},
  invalid: false,
});

type InputGroupProps = ViewProps & {
  className?: string;
  invalid?: boolean;
};

function InputGroup({
  className,
  invalid = false,
  children,
  ...props
}: InputGroupProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <InputGroupContext.Provider value={{ focused, setFocused, invalid }}>
      <View
        className={cn(
          'flex-row w-full items-center rounded-lg border border-input bg-transparent',
          focused && 'border-ring',
          invalid && 'border-destructive',
          className,
        )}
        {...props}
      >
        {children}
      </View>
    </InputGroupContext.Provider>
  );
}

const inputGroupAddonVariants = cva(
  'flex-row items-center justify-center gap-2',
  {
    variants: {
      align: {
        'inline-start': 'pl-3',
        'inline-end': 'pr-3',
        'block-start': 'w-full px-3 pt-2',
        'block-end': 'w-full px-3 pb-2',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

type InputGroupAddonProps = ViewProps &
  VariantProps<typeof inputGroupAddonVariants> & {
    className?: string;
  };

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: InputGroupAddonProps) {
  return (
    <View
      className={cn(inputGroupAddonVariants({ align }), className)}
      {...props}
    />
  );
}

type InputGroupButtonProps = Omit<ButtonProps, 'size'> & {
  className?: string;
  size?: 'sm' | 'icon';
};

function InputGroupButton({
  className,
  variant = 'ghost',
  size = 'sm',
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('shadow-none px-0', className)}
      {...props}
    />
  );
}

type InputGroupTextProps = ViewProps & { className?: string };

function InputGroupText({ className, ...props }: InputGroupTextProps) {
  return (
    <View className={cn('flex-row items-center gap-2', className)} {...props} />
  );
}

type InputGroupInputProps = InputProps;

function InputGroupInput({
  className,
  onFocus,
  onBlur,
  ...props
}: InputGroupInputProps) {
  const { setFocused, invalid } = React.useContext(InputGroupContext);

  return (
    <Input
      className={cn('flex-1 rounded-none border-0', className)}
      invalid={invalid}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

type InputGroupTextareaProps = InputProps;

function InputGroupTextarea({
  className,
  onFocus,
  onBlur,
  ...props
}: InputGroupTextareaProps) {
  const { setFocused, invalid } = React.useContext(InputGroupContext);

  return (
    <Input
      multiline
      className={cn('flex-1 rounded-none border-0 py-2', className)}
      invalid={invalid}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
