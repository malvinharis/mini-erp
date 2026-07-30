import 'server-only';
import type { ApiResponse } from '@/lib/schemas';
import { getAccessToken } from '../auth/session';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

interface ServerFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Next.js cache tag for revalidateTag() after mutations. */
  tags?: string[];
}

/**
 * fetch() wrapper for Server Components — participates in the Next.js cache,
 * unlike axios (which uses Node http and bypasses revalidation).
 */
export async function apiFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ApiResponse<T>> {
  const token = await getAccessToken();
  const { body, tags, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    next: tags ? { tags } : undefined,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, (detail as { message?: string }).message ?? 'Request failed');
  }
  if (res.status === 204) return { data: undefined as T, meta: null };
  return (await res.json()) as ApiResponse<T>;
}
