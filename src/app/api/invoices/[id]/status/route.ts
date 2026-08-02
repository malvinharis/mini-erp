import { INVOICES_TAG } from '@/lib/api/invoices';
import { ApiError, apiFetch } from '@/lib/api/server';
import { invoiceStatusChangeSchema } from '@/lib/schemas';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** Transition an invoice's status. Backend enforces valid state machine. */
export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const parsed = invoiceStatusChangeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { statusCode: 400, message: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const res = await apiFetch(`/invoices/${id}/status`, { method: 'POST', body: parsed.data });
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
