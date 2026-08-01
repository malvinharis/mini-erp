import { CUSTOMERS_TAG } from '@/lib/api/customers';
import { ApiError, apiFetch } from '@/lib/api/server';
import { createCustomerSchema } from '@/lib/schemas';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/** List customers — delegates search/pagination params straight through. */
export async function GET(request: Request) {
  const { search } = new URL(request.url);
  try {
    const res = await apiFetch(`/customers${search}`, { tags: [CUSTOMERS_TAG] });
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

/** Create customer. Backend RolesGuard is the real authorization gate. */
export async function POST(request: Request) {
  const parsed = createCustomerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { statusCode: 400, message: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const res = await apiFetch('/customers', { method: 'POST', body: parsed.data });
    revalidateTag(CUSTOMERS_TAG);
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
