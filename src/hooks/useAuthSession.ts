import { checkProfile } from '@/features/profile/services/profileServices';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { logger } from '@/utils/logger';
import { useEffect } from 'react';

export function useAuthSession() {
  const setSession = useAuthStore((s) => s.setSession);
  const setHasProfile = useProfileStore((s) => s.setHasProfile);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      logger.info(
        '[Auth] getSession -',
        session ? `authenticated as ${session.user.email}` : 'no session',
      );
      setSession(session);
      if (session) {
        const has = await checkProfile(session.user.id);
        setHasProfile(has);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN' && session) {
        const has = await checkProfile(session.user.id);
        setHasProfile(has);
      } else if (event === 'SIGNED_OUT') {
        setHasProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setHasProfile]);
}
