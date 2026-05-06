import { Checkbox } from '@/components/ui/checkbox';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { View } from 'react-native';

interface FormActionsProps {
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
}

export default function FormActions({
  rememberMe,
  onRememberMeChange,
}: FormActionsProps) {
  return (
    <View className="flex-row justify-between px-1">
      <View className="flex-row items-center">
        <Checkbox
          checked={rememberMe}
          onCheckedChange={(checked) => onRememberMeChange(checked === true)}
        />
        <Text className="ml-2">Remember me</Text>
      </View>
      <View>
        <Link
          href="/forgot-password"
          className="text-foreground text-base font-serif underline "
        >
          Forgot your password?
        </Link>
      </View>
    </View>
  );
}
