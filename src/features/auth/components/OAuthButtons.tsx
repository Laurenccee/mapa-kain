import { Button } from "@/components/ui/button";
import { FacebookIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { View } from "react-native";

export default function OAuthButtons() {
  return (
    <View className="w-full flex-row justify-center gap-2">
      <Button variant="outline" size="icon" className="justify-center gap-2">
        <HugeiconsIcon
          icon={GoogleIcon}
          strokeWidth={1.5}
          className="text-foreground"
        />
      </Button>
      <Button variant="outline" size="icon" className="justify-center gap-2">
        <HugeiconsIcon
          icon={FacebookIcon}
          strokeWidth={1.5}
          className="text-foreground"
        />
      </Button>
    </View>
  );
}
