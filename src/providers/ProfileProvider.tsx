import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import React, { useEffect } from 'react';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore((s) => s.session?.user.id);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const setHasProfile = useProfileStore((s) => s.setHasProfile);
  const setIsProfileInitialized = useProfileStore(
    (s) => s.setIsProfileInitialized,
  );

  useEffect(() => {
    if (!isInitialized || userId) return;
    setHasProfile(null);
    setIsProfileInitialized(false);
  }, [userId, isInitialized]);

  return <>{children}</>;
}
