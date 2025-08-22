import { NextResponse } from 'next/server';
import { simulateSend } from '../../../../../lib/demos/data-entry/simulate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const variant = (body.variant || 'invoice').toLowerCase();
    const payload = body.payload ?? {};
    const result = await simulateSend(payload, variant);
    return NextResponse.json({ ok: true, result }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
