import 'server-only';
import { cookies } from 'next/headers';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

/** Persist tokens in httpOnly cookies — never localStorage (XSS-readable). */
export async function setSession({ accessToken, refreshToken }: SessionTokens): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, { ...baseCookie, maxAge: 60 * 15 });
  store.set(REFRESH_COOKIE, refreshToken, { ...baseCookie, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}
