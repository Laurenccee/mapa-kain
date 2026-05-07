import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function MapScreen() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Error signing out:',
          text2: error.message,
        });

        setIsLoading(false);
        return;
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error signing out:',
      });
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 w-full items-center justify-center bg-background">
      <Button
        className="max-w-xs w-full"
        onPress={handleSignOut}
        disabled={isLoading}
      >
        <Text>{isLoading ? 'Signing out...' : 'Sign Out'}</Text>
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
    </SafeAreaView>
  );
}
