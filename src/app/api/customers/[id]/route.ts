import { CUSTOMERS_TAG } from '@/lib/api/customers';
import { ApiError, apiFetch } from '@/lib/api/server';
import { updateCustomerSchema } from '@/lib/schemas';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** Fetch a single customer. */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const res = await apiFetch(`/customers/${id}`, { tags: [CUSTOMERS_TAG] });
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

/** Update customer fields. */
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const parsed = updateCustomerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { statusCode: 400, message: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const res = await apiFetch(`/customers/${id}`, { method: 'PATCH', body: parsed.data });
    revalidateTag(CUSTOMERS_TAG);
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

/** Soft delete. */
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await apiFetch(`/customers/${id}`, { method: 'DELETE' });
    revalidateTag(CUSTOMERS_TAG);
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
