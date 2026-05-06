import * as SecureStore from 'expo-secure-store';

const EMAIL_KEY = 'remember_me_email';
const PASSWORD_KEY = 'remember_me_password';

export async function loadRememberMe(): Promise<{
  email: string;
  password: string;
} | null> {
  const email = await SecureStore.getItemAsync(EMAIL_KEY);
  const password = await SecureStore.getItemAsync(PASSWORD_KEY);
  if (email && password) return { email, password };
  return null;
}

export async function saveRememberMe(
  email: string,
  password: string,
): Promise<void> {
  await SecureStore.setItemAsync(EMAIL_KEY, email);
  await SecureStore.setItemAsync(PASSWORD_KEY, password);
}

export async function clearRememberMe(): Promise<void> {
  await SecureStore.deleteItemAsync(EMAIL_KEY);
  await SecureStore.deleteItemAsync(PASSWORD_KEY);
}
