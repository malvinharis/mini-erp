import { INVOICES_TAG } from '@/lib/api/invoices';
import { ApiError, apiFetch } from '@/lib/api/server';
import { updateInvoiceSchema } from '@/lib/schemas';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** Fetch a single invoice. */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const res = await apiFetch(`/invoices/${id}`, { tags: [INVOICES_TAG] });
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

/** Update invoice fields — only allowed while DRAFT (enforced by backend). */
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const parsed = updateInvoiceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { statusCode: 400, message: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const res = await apiFetch(`/invoices/${id}`, { method: 'PATCH', body: parsed.data });
    revalidateTag(INVOICES_TAG);
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
