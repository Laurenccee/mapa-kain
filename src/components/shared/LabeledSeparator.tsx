import { View } from 'react-native';
import { Separator } from '../ui/separator';
import { Text } from '../ui/text';

interface LabeledSeparatorProps {
  label: string;
  uppercase?: boolean;
}

export default function LabeledSeparator({
  label,
  uppercase,
}: LabeledSeparatorProps) {
  return (
    <View className="flex-row items-center gap-2 w-full ">
      <Separator className="flex-1" />
      <Text className="text-sm text-muted-foreground">
        {uppercase ? label.toUpperCase() : label}
      </Text>
      <Separator className="flex-1" />
    </View>
  );
}
