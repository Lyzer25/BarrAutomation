import {
  ParsedInvoice,
  ParsedLead,
  ParsedTicket,
  ConfidenceField,
  LineItem,
} from '../../../types/demo/data-entry';

function withConfidence<T>(value: T, confidence = 0.9, warnings?: string[]): ConfidenceField<T> {
  return { value, confidence, warnings };
}

/**
 * Very small CSV parser for the invoice line items used in the demo.
 */
function parseCsvRows(csv: string): string[][] {
  const lines = csv.trim().split(/\r?\n/);
  return lines.map((l) => {
    // naive split, handle quoted commas
    const parts: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < l.length; i++) {
      const ch = l[i];
      if (ch === '"' && l[i - 1] !== '\\') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === ',' && !inQuotes) {
        parts.push(cur.trim());
        cur = '';
        continue;
      }
      cur += ch;
    }
    parts.push(cur.trim());
    return parts;
  });
}

/**
 * extractInvoice
 * Accepts invoice JSON or raw text. When a line-items CSV is referenced, the UI sample loader will load it
 * separately. For demo purposes, we provide reasonable confidences based on "easy" parsing vs fallback heuristics.
 */
export async function extractInvoice(input: string): Promise<ParsedInvoice> {
  // Try to parse JSON
  let obj: any = null;
  try {
    obj = JSON.parse(input);
  } catch {
    // not JSON; do best-effort text extraction
  }

  const raw = input;
  const vendorName = obj?.vendorName ?? /Vendor:\s*(.+)/i.exec(input)?.[1] ?? 'Unknown Vendor';
  const invoiceNumber = obj?.invoiceNumber ?? /INV[-\s:]?(\S+)/i.exec(input)?.[0] ?? 'UNKNOWN';
  const invoiceDateRaw = obj?.invoiceDate ?? /Date:\s*([^\n]+)/i.exec(input)?.[1] ?? '';
  const dueDateRaw = obj?.dueDate ?? /Due:\s*([^\n]+)/i.exec(input)?.[1] ?? '';
  const currency = obj?.currency ?? 'USD';
  const subtotal = obj?.subtotal ?? obj?.amount ?? undefined;
  const tax = obj?.tax ?? undefined;
  const total = obj?.total ?? undefined;
  const terms = obj?.terms ?? undefined;
  const vendorAddress = obj?.vendorAddress ?? /Vendor:[\s\S]*?(\d{3,}[\s\S]*)/i.exec(input)?.[1];

  // line items: if obj has lineItemsCsv or CSV inline, we won't load CSV here (UI will)
  const lineItems: LineItem[] = [];
  if (obj?.lineItems && Array.isArray(obj.lineItems)) {
    for (const li of obj.lineItems) {
      lineItems.push({
        description: withConfidence(String(li.description ?? ''), 0.9),
        quantity: withConfidence(Number(li.quantity ?? 1), 0.9),
        unitPrice: withConfidence(Number(li.unitPrice ?? 0), 0.9),
        total: withConfidence(Number(li.total ?? 0), 0.9),
      });
    }
  }

  const parsed: ParsedInvoice = {
    vendorName: withConfidence(vendorName, vendorName === 'Unknown Vendor' ? 0.6 : 0.98, vendorName === 'Unknown Vendor' ? ['Vendor name detected via fallback'] : undefined),
    vendorId: obj?.vendorId ? withConfidence(String(obj.vendorId), 0.95) : undefined,
    vendorAddress: vendorAddress ? withConfidence(String(vendorAddress).trim(), 0.88) : undefined,
    invoiceNumber: withConfidence(String(invoiceNumber), invoiceNumber.startsWith('INV') ? 0.95 : 0.7),
    invoiceDate: withConfidence(String(invoiceDateRaw || ''), invoiceDateRaw ? 0.8 : 0.5, invoiceDateRaw ? undefined : ['Date not found, parsed as empty']),
    dueDate: withConfidence(String(dueDateRaw || ''), dueDateRaw ? 0.75 : 0.5),
    currency: withConfidence(String(currency || 'USD'), 0.95),
    subtotal: subtotal !== undefined ? withConfidence(Number(subtotal), 0.9) : undefined,
    tax: tax !== undefined ? withConfidence(Number(tax), 0.85) : undefined,
    total: total !== undefined ? withConfidence(Number(total), 0.9) : undefined,
    terms: terms ? withConfidence(String(terms), 0.8) : undefined,
    lineItems,
    raw,
  };

  return new Promise((res) => setTimeout(() => res(parsed), 120)); // slight async feel
}

/**
 * extractLeadsCsv
 * Very small CSV -> ParsedLead[] for demo.
 */
export async function extractLeadsCsv(csv: string): Promise<ParsedLead[]> {
  const rows = parseCsvRows(csv);
  const header = rows[0].map((h) => h.toLowerCase().trim());
  const results: ParsedLead[] = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const map: any = {};
    for (let j = 0; j < header.length; j++) {
      map[header[j]] = r[j] ?? '';
    }
    const fullNameRaw = map['full name'] ?? map['name'] ?? '';
    const emailRaw = (map['mail'] ?? map['email'] ?? '').trim();
    const phoneRaw = (map['phone #'] ?? map['phone'] ?? '').trim();
    const sourceRaw = (map['source'] ?? '').trim();
    const utmRaw = (map['utm_campaign'] ?? map['utm campaign'] ?? '').trim();

    // name heuristics
    let first = '';
    let last = '';
    const nameParts = fullNameRaw.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      first = nameParts[0];
      last = nameParts.slice(1).join(' ');
    } else {
      first = fullNameRaw.trim();
    }

    const lead: ParsedLead = {
      raw: r.join(','),
      fullName: withConfidence(String(fullNameRaw).trim(), fullNameRaw ? 0.85 : 0.5),
      firstName: withConfidence(first, first ? 0.9 : 0.5),
      lastName: last ? withConfidence(last, 0.88) : undefined,
      email: emailRaw ? withConfidence(emailRaw.toLowerCase(), emailRaw.includes('@') ? 0.95 : 0.6) : undefined,
      phone: phoneRaw ? withConfidence(phoneRaw, 0.7) : undefined,
      company: map['company'] ? withConfidence(String(map['company']).trim(), 0.8) : undefined,
      source: sourceRaw ? withConfidence(sourceRaw, 0.75) : undefined,
      utmCampaign: utmRaw ? withConfidence(utmRaw, 0.7) : undefined,
      rowIndex: i - 1,
    };

    results.push(lead);
  }

  return new Promise((res) => setTimeout(() => res(results), 120));
}

/**
 * extractSupportEmail
 * Parse a raw email into structured ticket.
 */
export async function extractSupportEmail(text: string): Promise<ParsedTicket> {
  const raw = text;
  const fromMatch = /From:\s*(.+)/i.exec(text);
  const toMatch = /To:\s*(.+)/i.exec(text);
  const subjectMatch = /Subject:\s*(.+)/i.exec(text);
  const dateMatch = /Date:\s*(.+)/i.exec(text);
  const orderMatch = /Order\s*#?([A-Z0-9-]+)/i.exec(text) || /ORD[-\s]?(\d+)/i.exec(text);

  const bodySplit = text.split(/\r?\n\r?\n/);
  const body = bodySplit.slice(1).join('\n\n').trim() || text;

  const ticket: ParsedTicket = {
    raw,
    from: fromMatch ? withConfidence(fromMatch[1].trim(), 0.9) : undefined,
    to: toMatch ? withConfidence(toMatch[1].trim(), 0.9) : undefined,
    subject: withConfidence(subjectMatch ? subjectMatch[1].trim() : 'No subject', subjectMatch ? 0.95 : 0.5),
    date: dateMatch ? withConfidence(dateMatch[1].trim(), 0.8) : undefined,
    body: withConfidence(body, 0.85),
    orderNumber: orderMatch ? withConfidence(orderMatch[0].trim(), 0.9) : undefined,
    piiRedacted: false,
  };

  return new Promise((res) => setTimeout(() => res(ticket), 100));
}
