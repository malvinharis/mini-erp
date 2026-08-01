import 'server-only';
import { apiFetch } from '@/lib/api/server';
import { type AuthUser, UserRole } from '@/lib/schemas';

/** Current authenticated user from the API (`GET /users/me`). */
export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await apiFetch<AuthUser>('/users/me', { tags: ['me'] });
  return data;
}

/** UI-only capability map. Backend RolesGuard is the real gate. */
type Action = 'users.manage';

const CAPABILITIES: Record<Action, UserRole[]> = {
  'users.manage': [UserRole.ADMIN],
};

export function can(role: UserRole, action: Action): boolean {
  return CAPABILITIES[action].includes(role);
}
