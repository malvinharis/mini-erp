'use server';
import { setSession } from '@/lib/auth/session';
import { type TokenPair, loginSchema } from '@/lib/schemas';
import { redirect } from 'next/navigation';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api';

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'Invalid email or password format' };

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
    cache: 'no-store',
  });

  if (!res.ok) return { error: 'Invalid credentials' };

  const { data } = (await res.json()) as { data: TokenPair };
  await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  redirect('/');
}
