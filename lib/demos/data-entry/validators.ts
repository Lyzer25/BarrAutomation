import {
  Issue,
  ParsedInvoice,
  ParsedLead,
  ParsedTicket,
  ERPInvoice,
  CRMLead,
  Ticket,
  ConfidenceField,
} from '../../../types/demo/data-entry';

/**
 * Normalizers and validators used by the demo.
 */

export function normalizeEmail(email?: string | null): { value?: string; valid: boolean } {
  if (!email) return { value: undefined, valid: false };
  const v = String(email).trim().toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  return { value: ok ? v : v, valid: ok };
}

export function normalizePhone(phone?: string | null): { value?: string; valid: boolean } {
  if (!phone) return { value: undefined, valid: false };
  const digits = String(phone).replace(/[^\d+]/g, '');
  // naive E.164-ish: if starts with + keep, else add +1 if 10 digits
  let normalized = digits;
  if (/^\+/.test(phone)) {
    normalized = digits;
  } else if (digits.length === 10) {
    normalized = '+1' + digits;
  } else if (digits.length > 10 && digits.length <= 15) {
    normalized = '+' + digits;
  } else {
    normalized = digits;
  }
  const valid = /^\+?\d{7,15}$/.test(normalized);
  return { value: normalized, valid };
}

export function normalizeDate(dateStr?: string | null): { value?: string; valid: boolean } {
  if (!dateStr) return { value: undefined, valid: false };
  const s = String(dateStr).trim();
  // Try Date parsing heuristics for common formats
  const tryDate = (input: string) => {
    const d = new Date(input);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return undefined;
  };

  // common US format m/d/yyyy
  const m = /^\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\s*$/.exec(s);
  if (m) {
    const mm = Number(m[1]);
    const dd = Number(m[2]);
    let yyyy = Number(m[3]);
    if (yyyy < 100) yyyy += 2000;
    const candidate = new Date(yyyy, mm - 1, dd);
    if (!isNaN(candidate.getTime())) {
      return { value: `${candidate.getFullYear()}-${String(candidate.getMonth() + 1).padStart(2, '0')}-${String(candidate.getDate()).padStart(2, '0')}`, valid: true };
    }
  }

  // attempt Date parsing
  const parsed = tryDate(s);
  if (parsed) return { value: parsed, valid: true };

  // fallback: fail but return original
  return { value: s, valid: false };
}

export function normalizeMoney(n?: number | string | null): { value?: number; valid: boolean } {
  if (n === undefined || n === null || n === '') return { value: undefined, valid: false };
  const s = String(n); // ensure string so .replace exists
  // remove currency symbols and commas
  const cleaned = s.replace(/[^0-9.\-]/g, '');
  const num = Number(cleaned);
  const valid = !isNaN(num);
  return { value: valid ? num : undefined, valid };
}

/**
 * Generic validateAndMap
 * - source: any object with ConfidenceField values (demo parsed output)
 * - schema: array of required target field names and optional type hints
 *
 * Returns mapped object (with normalized values) and a list of issues detected.
 */
export function validateAndMap<T extends object = any>(
  source: Record<string, any>,
  schema: { required?: string[]; types?: Record<string, 'email' | 'phone' | 'date' | 'money' | 'string'> } = {}
): { mapped: Partial<T>; issues: Issue[] } {
  const issues: Issue[] = [];
  const mapped: Partial<T> = {};

  const required = schema.required ?? Object.keys(schema.types ?? {});

  // iterate through source keys - if a value is a ConfidenceField, extract .value
  for (const key of Object.keys(source || {})) {
    const v = source[key];
    let raw: any = v;
    if (v && typeof v === 'object' && 'value' in v) {
      raw = v.value;
    }
    mapped[key as keyof T] = raw;
  }

  // Validate required fields
  for (const req of required) {
    const val = (mapped as any)[req];
    if (val === undefined || val === null || (typeof val === 'string' && String(val).trim() === '')) {
      issues.push({ field: req, type: 'required', message: `${req} is required` });
    } else {
      // type validations
      const t = schema.types?.[req];
      if (t === 'email') {
        const { valid } = normalizeEmail(String(val));
        if (!valid) issues.push({ field: req, type: 'format', message: `Invalid email format for ${req}`, fix: 'Trim and lowercase, ensure @domain' });
        else (mapped as any)[req] = normalizeEmail(String(val)).value;
      }
      if (t === 'phone') {
        const { valid, value } = normalizePhone(String(val));
        if (!valid) issues.push({ field: req, type: 'format', message: `Invalid phone format for ${req}`, fix: 'Strip non-digits and add country code' });
        (mapped as any)[req] = value ?? val;
      }
      if (t === 'date') {
        const { valid, value } = normalizeDate(String(val));
        if (!valid) issues.push({ field: req, type: 'format', message: `Unparseable date for ${req}`, fix: 'Normalize to YYYY-MM-DD' });
        (mapped as any)[req] = value ?? val;
      }
      if (t === 'money') {
        const { valid, value } = normalizeMoney(val as any);
        if (!valid) issues.push({ field: req, type: 'format', message: `Invalid money format for ${req}`, fix: 'Strip symbols and parse number' });
        (mapped as any)[req] = value ?? val;
      }
    }
  }

  // Simple duplicate detection for leads (email + phone duplicates)
  if ((mapped as any).email) {
    // no-op for single record; higher-level logic can detect duplicates across arrays
  }

  return { mapped, issues };
}

/**
 * Helpers to map parsed types into target schemas (ERPInvoice, CRMLead, Ticket)
 * These are shallow mappers suitable for demo.
 */

export function mapParsedInvoiceToERP(parsed: ParsedInvoice): { mapped: ERPInvoice; issues: Issue[] } {
  const issues: Issue[] = [];
  const invoiceDateNorm = normalizeDate(parsed.invoiceDate?.value);
  if (!invoiceDateNorm.valid) {
    issues.push({ field: 'invoiceDate', type: 'format', message: 'Invoice date could not be normalized', fix: 'Normalize to YYYY-MM-DD' });
  }
  const lineItems = (parsed.lineItems || []).map((li) => {
    const qty = li.quantity?.value ?? 1;
    const unit = li.unitPrice?.value ?? 0;
    const total = li.total?.value ?? qty * unit;
    return {
      description: li.description?.value ?? '',
      quantity: Number(qty),
      unitPrice: Number(unit),
      total: Number(total),
    };
  });

  const subtotalNorm = normalizeMoney(parsed.subtotal?.value ?? parsed.total?.value);
  const taxNorm = normalizeMoney(parsed.tax?.value);
  const totalNorm = normalizeMoney(parsed.total?.value);

  const mapped: ERPInvoice = {
    vendorName: parsed.vendorName?.value ?? 'Unknown Vendor',
    vendorId: parsed.vendorId?.value,
    vendorAddress: parsed.vendorAddress?.value,
    invoiceNumber: parsed.invoiceNumber?.value ?? 'UNKNOWN',
    invoiceDate: invoiceDateNorm.value ?? (parsed.invoiceDate?.value ?? ''),
    dueDate: normalizeDate(parsed.dueDate?.value ?? '')?.value,
    currency: parsed.currency?.value ?? 'USD',
    subtotal: subtotalNorm.value,
    tax: taxNorm.value,
    total: totalNorm.value,
    terms: parsed.terms?.value,
    lineItems,
  };

  return { mapped, issues };
}

export function mapParsedLeadToCRM(parsed: ParsedLead): { mapped: CRMLead; issues: Issue[] } {
  const issues: Issue[] = [];
  // first/last name split if available
  const first = parsed.firstName?.value ?? parsed.fullName?.value?.split(/\s+/)[0] ?? '';
  const last = parsed.lastName?.value ?? parsed.fullName?.value?.split(/\s+/).slice(1).join(' ') ?? '';
  const emailNorm = normalizeEmail(parsed.email?.value);
  if (parsed.email && !emailNorm.valid) {
    issues.push({ field: 'email', type: 'format', message: 'Email appears invalid', fix: 'Lowercase and ensure domain' });
  }
  const phoneNorm = normalizePhone(parsed.phone?.value);
  if (parsed.phone && !phoneNorm.valid) {
    issues.push({ field: 'phone', type: 'format', message: 'Phone appears invalid', fix: 'Normalize to +1XXXXXXXXXX' });
  }

  const mapped: CRMLead = {
    firstName: titleCase(first),
    lastName: titleCase(last),
    email: emailNorm.value,
    phone: phoneNorm.value,
    company: parsed.company?.value,
    source: parsed.source?.value,
    utmCampaign: parsed.utmCampaign?.value,
  };

  return { mapped, issues };
}

export function mapParsedTicketToTarget(parsed: ParsedTicket): { mapped: Ticket; issues: Issue[] } {
  const issues: Issue[] = [];
  // naive sentiment: look for "not", "wrong", "help"
  const body = parsed.body?.value ?? '';
  let sentiment: Ticket['sentiment'] = 'neu';
  if (/not|wrong|doesn't|didn't|error|fail|urgent|urgent/i.test(body)) sentiment = 'neg';
  if (/thank you|thanks|resolved|appreciate|great/i.test(body)) sentiment = 'pos';

  const priority: Ticket['priority'] = /urgent|asap|immediately/i.test(parsed.subject.value + ' ' + body) ? 'high' : 'med';
  const tags: string[] = [];

  // attempt to find a product
  const prodMatch = /Model\s+([A-Z0-9\-]+)/i.exec(body) || /SKU:\s*([A-Z0-9\-]+)/i.exec(body);
  const prodTag = prodMatch?.[1] ?? prodMatch?.[0];
  if (prodTag) tags.push(prodTag);

  // redact PII: remove emails and phone numbers from body copy in mapped payload
  const redactedBody = redactPII(body);

  const mapped: Ticket = {
    subject: parsed.subject?.value ?? 'No subject',
    priority,
    sentiment,
    tags,
    product: prodMatch ? prodMatch[1] : undefined,
    body: redactedBody,
  };

  return { mapped, issues };
}

/** small helpers */
function titleCase(s?: string): string {
  if (!s) return '';
  return s
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function redactPII(text: string): string {
  // redact emails
  let out = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  // redact phone-like numbers
  out = out.replace(/(\+?\d[\d\-\s\(\)]{6,}\d)/g, '[REDACTED_PHONE]');
  // redact simple addresses (very naive) - redact lines with digits + street words
  out = out.replace(/.*\d{1,5}[\w\.\s,#-]*\n?/g, (m) => m.replace(/\S/g, '•'));
  return out;
}
