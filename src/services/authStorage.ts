import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'bloodconnect_token';
const ROLE_KEY = 'bloodconnect_role';

export async function saveAuth(token: string, role: 'donor' | 'hospital') {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(ROLE_KEY, role);
}

export async function getAuth() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const role = (await SecureStore.getItemAsync(ROLE_KEY)) as
    | 'donor'
    | 'hospital'
    | null;

  if (!token || !role) {
    return { token: null, role: null as 'donor' | 'hospital' | null };
  }

  return { token, role };
}

export async function clearAuth() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(ROLE_KEY);
}
