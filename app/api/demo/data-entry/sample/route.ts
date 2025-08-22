import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'demo', 'data-entry');

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const variant = (url.searchParams.get('variant') || 'invoice').toLowerCase();

    if (variant === 'invoice') {
      const jsonPath = path.join(DATA_DIR, 'invoice.json');
      const csvPath = path.join(DATA_DIR, 'invoice-lineitems.csv');
      const [jsonRaw, csvRaw] = await Promise.all([fs.readFile(jsonPath, 'utf8'), fs.readFile(csvPath, 'utf8')]);
      return NextResponse.json({
        name: 'invoice.json',
        text: jsonRaw,
        attachedCsv: csvRaw,
      });
    }

    if (variant === 'leads') {
      const csvPath = path.join(DATA_DIR, 'leads-messy.csv');
      const csvRaw = await fs.readFile(csvPath, 'utf8');
      return NextResponse.json({
        name: 'leads-messy.csv',
        text: csvRaw,
        attachedCsv: null,
      });
    }

    if (variant === 'email') {
      const txtPath = path.join(DATA_DIR, 'support-email.txt');
      const txtRaw = await fs.readFile(txtPath, 'utf8');
      return NextResponse.json({
        name: 'support-email.txt',
        text: txtRaw,
        attachedCsv: null,
      });
    }

    return NextResponse.json({ error: 'Unknown variant' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
