import { checkProfile } from '@/features/profile/services/profileServices';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { logger } from '@/utils/logger';
import { useEffect, useRef } from 'react';

export function useAuthSession() {
  const setSession = useAuthStore((s) => s.setSession);
  const setHasProfile = useProfileStore((s) => s.setHasProfile);
  const setIsProfileInitialized = useProfileStore(
    (s) => s.setIsProfileInitialized,
  );
  const profileChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(
    null,
  );

  const subscribeToProfile = (userId: string) => {
    if (profileChannelRef.current) {
      supabase.removeChannel(profileChannelRef.current);
    }

    profileChannelRef.current = supabase
      .channel(`profile-changes:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            logger.info('[Auth] Profile created in DB');
            setHasProfile(true);
          } else if (payload.eventType === 'DELETE') {
            logger.info('[Auth] Profile deleted in DB');
            setHasProfile(false);
          }
        },
      )
      .subscribe();
  };

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      logger.info(
        '[Auth] getSession -',
        session ? `authenticated as ${session.user.email}` : 'no session',
      );
      if (session?.user.id) {
        const has = await checkProfile(session.user.id);
        logger.info('[Auth] Profile preloaded:', has);
        setHasProfile(has);
        subscribeToProfile(session.user.id);
      } else {
        setHasProfile(false);
      }
      setIsProfileInitialized(true);
      setSession(session);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('[Auth] onAuthStateChange -', event);
      if (event === 'SIGNED_IN' && session?.user.id) {
        const has = await checkProfile(session.user.id);
        logger.info('[Auth] Profile preloaded on sign-in:', has);
        setHasProfile(has);
        setIsProfileInitialized(true);
        subscribeToProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        if (profileChannelRef.current) {
          supabase.removeChannel(profileChannelRef.current);
          profileChannelRef.current = null;
        }
        setHasProfile(null);
        setIsProfileInitialized(false);
      }
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
      if (profileChannelRef.current) {
        supabase.removeChannel(profileChannelRef.current);
      }
    };
  }, [setSession, setHasProfile, setIsProfileInitialized]);
}
