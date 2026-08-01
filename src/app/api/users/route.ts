import { ApiError, apiFetch } from '@/lib/api/server';
import { USERS_TAG } from '@/lib/api/users';
import { createUserSchema } from '@/lib/schemas';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/** Create user. Backend RolesGuard('ADMIN') is the real authorization gate. */
export async function POST(request: Request) {
  const parsed = createUserSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { statusCode: 400, message: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const res = await apiFetch('/users', { method: 'POST', body: parsed.data });
    revalidateTag(USERS_TAG);
    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { statusCode: error.status, message: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
