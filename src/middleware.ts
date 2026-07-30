import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const API_URL = process.env.API_URL ?? 'http://localhost:4000/api';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

/** Decode a JWT's `exp` (seconds) without verifying the signature. Edge-safe (atob). */
function jwtExp(token?: string): number | null {
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === 'number' ? exp : null;
  } catch {
    return null;
  }
}

function isValid(token?: string): boolean {
  const exp = jwtExp(token);
  return exp !== null && exp * 1000 > Date.now();
}

/** Exchange a refresh token for a fresh pair. Returns null on any failure. */
async function tryRefresh(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const { data } = (await res.json()) as { data: { accessToken: string; refreshToken: string } };
    return data;
  } catch {
    return null;
  }
}

function setAuthCookies(
  res: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
): void {
  res.cookies.set(ACCESS_COOKIE, tokens.accessToken, { ...cookieBase, maxAge: 60 * 15 });
  res.cookies.set(REFRESH_COOKIE, tokens.refreshToken, { ...cookieBase, maxAge: 60 * 60 * 24 * 7 });
}

function clearAuthCookies(res: NextResponse): void {
  res.cookies.delete(ACCESS_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;

  // 1) Valid access token → authenticated.
  if (isValid(access)) {
    if (isPublic) return NextResponse.redirect(new URL('/', req.url));
    return NextResponse.next();
  }

  // 2) Access missing/expired but a refresh token exists → try a silent refresh.
  if (refresh) {
    const refreshed = await tryRefresh(refresh);
    if (refreshed) {
      // reload the SAME url so the RSC sees the fresh cookie on the next request
      const target = isPublic ? '/' : `${pathname}${search}`;
      const res = NextResponse.redirect(new URL(target, req.url));
      setAuthCookies(res, refreshed);
      return res;
    }
  }

  // 3) Not authenticated.
  if (isPublic) return NextResponse.next();
  const res = NextResponse.redirect(new URL('/login', req.url));
  clearAuthCookies(res);
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
