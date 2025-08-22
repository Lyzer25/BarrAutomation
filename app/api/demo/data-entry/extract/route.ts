import { NextResponse } from 'next/server';
import { extractInvoice, extractLeadsCsv, extractSupportEmail } from '../../../../../lib/demos/data-entry/extractors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const variant = (body.variant || 'invoice').toLowerCase();
    const text = body.text ?? '';

    if (variant === 'invoice') {
      const parsed = await extractInvoice(text || JSON.stringify({}));
      return NextResponse.json({ variant, parsed });
    }

    if (variant === 'leads') {
      const parsed = await extractLeadsCsv(text || '');
      return NextResponse.json({ variant, parsed });
    }

    if (variant === 'email') {
      const parsed = await extractSupportEmail(text || '');
      return NextResponse.json({ variant, parsed });
    }

    return NextResponse.json({ error: 'unknown variant' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
