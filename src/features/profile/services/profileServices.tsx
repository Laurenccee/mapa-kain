import { supabase } from '@/lib/supabase';
import { ProfileFormValues } from '../schemas/profileSchema';

export async function checkProfile(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();
  return !!data;
}

export async function uploadAvatar(
  userId: string,
  uri: string,
): Promise<string> {
  const ext = uri.split('.').pop() ?? 'jpg';
  const path = `${userId}/avatar.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();
  const arrayBuffer = await new Response(blob).arrayBuffer();
  const file = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    contentType: `image/${ext}`,
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

export async function createProfile(values: ProfileFormValues): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Session expired. Please sign in again.');
  }

  const userId = session.user.id;
  let avatarUrl = values.avatar_url ?? '';

  if (avatarUrl && !avatarUrl.startsWith('http')) {
    avatarUrl = await uploadAvatar(userId, avatarUrl);
  }

  const { error } = await supabase.from('profiles').insert({
    id: userId,
    full_name: values.full_name,
    username: values.username,
    phone_number: values.phone_number || null,
    avatar_url: avatarUrl || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}
