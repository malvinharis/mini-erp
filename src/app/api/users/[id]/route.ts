import { ApiError, apiFetch } from '@/lib/api/server';
import { USERS_TAG } from '@/lib/api/users';
import { updateUserSchema } from '@/lib/schemas';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** Update name / role / active flag. */
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const parsed = updateUserSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { statusCode: 400, message: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const res = await apiFetch(`/users/${id}`, { method: 'PATCH', body: parsed.data });
    revalidateTag(USERS_TAG);
    return NextResponse.json(res);
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

/** Deactivate (soft delete). */
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await apiFetch(`/users/${id}`, { method: 'DELETE' });
    revalidateTag(USERS_TAG);
    return new NextResponse(null, { status: 204 });
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
