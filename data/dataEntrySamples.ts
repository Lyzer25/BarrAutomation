export type UseCaseKey = 'invoice' | 'lead' | 'email';

export const TOOLTIPS: Record<string, string> = {
  recordsPerDay: 'Approximate number of items your team transcribes daily.',
  wage: 'Estimated fully‑loaded hourly cost for manual data entry.',
  baselineError: 'Typical hand‑entry error rate before automation.',
  timePerRecord: 'Average minutes to key one item into your system.',
  timeSaved: 'Total hours saved each day by automation.',
  errorReduction: 'Expected reduction in data defects from consistent parsing.',
  firstPassYield: 'Percent of items that pass validation without rework.',
  mapping: 'Where each extracted field lands in your target system.',
};

export const SAMPLES = {
  invoice: {
    key: 'invoice' as UseCaseKey,
    label: 'Invoices → ERP',
    sampleText: `ACME Supplies
Invoice #INV-1042
Date: 2025-06-30
Bill To: Lone Star Coffee
Items:
  2x Grinder Burr (SKU BRR-88) @ 129.00
  1x Motor Assembly (SKU MTR-22) @ 349.00
Subtotal: 607.00
Tax: 50.58
Total: 657.58
Payment Terms: Net 30`,
    extracted: {
      vendor: 'ACME Supplies',
      invoiceNumber: 'INV-1042',
      invoiceDate: '2025-06-30',
      customer: 'Lone Star Coffee',
      subtotal: 607.0,
      tax: 50.58,
      total: 657.58,
      terms: 'Net 30',
    },
    mapping: [
      { from: 'vendor', to: 'erp.vendor_id' },
      { from: 'invoiceNumber', to: 'erp.ap.invoices.number' },
      { from: 'invoiceDate', to: 'erp.ap.invoices.date' },
      { from: 'total', to: 'erp.ap.invoices.amount_total' },
    ],
    impact: { recordsPerDay: 200, wagePerHour: 20, baselineErrorPct: 6, timeMinutesPerRecord: 4 },
    firstPassYield: 0.95,
  },
  lead: {
    key: 'lead' as UseCaseKey,
    label: 'Leads → CRM',
    sampleText: `Name: Sarah Johnson
Email: sarah@example.com
Phone: (325) 555-0199
Message: Looking for a maintenance plan. Budget around $1,200/mo.`,
    extracted: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+13255550199',
      intent: 'Maintenance plan',
      budgetMonthly: 1200,
    },
    mapping: [
      { from: 'name', to: 'crm.contacts.full_name' },
      { from: 'email', to: 'crm.contacts.email' },
      { from: 'phone', to: 'crm.contacts.phone' },
      { from: 'intent', to: 'crm.notes.latest_intent' },
    ],
    impact: { recordsPerDay: 120, wagePerHour: 22, baselineErrorPct: 8, timeMinutesPerRecord: 3 },
    firstPassYield: 0.94,
  },
  email: {
    key: 'email' as UseCaseKey,
    label: 'Support Email → Ticket',
    sampleText: `From: beverly@customer.com
Subject: Urgent: Grinder down
Body: The Model X-500 is throwing code E42 after 3 minutes. Need service ASAP.`,
    extracted: {
      customerEmail: 'beverly@customer.com',
      subject: 'Urgent: Grinder down',
      model: 'X-500',
      errorCode: 'E42',
      priority: 'High',
    },
    mapping: [
      { from: 'customerEmail', to: 'helpdesk.ticket.requester' },
      { from: 'subject', to: 'helpdesk.ticket.title' },
      { from: 'priority', to: 'helpdesk.ticket.priority' },
    ],
    impact: { recordsPerDay: 80, wagePerHour: 21, baselineErrorPct: 9, timeMinutesPerRecord: 5 },
    firstPassYield: 0.93,
  },
} as const;

export function computeImpact({
  recordsPerDay,
  wagePerHour,
  baselineErrorPct,
  timeMinutesPerRecord,
}: {
  recordsPerDay: number;
  wagePerHour: number;
  baselineErrorPct: number;
  timeMinutesPerRecord: number;
}) {
  // hoursSavedPerDay: if automation fully handles keystrokes, it's timeMinutesPerRecord minutes saved per record
  const hoursSavedPerDay = (timeMinutesPerRecord / 60) * recordsPerDay;
  const monthlySavings = Math.round(hoursSavedPerDay * wagePerHour * 22);
  const errorReduction = Math.max(0, baselineErrorPct - 1.5); // illustrative conservative reduction
  return { hoursSavedPerDay, monthlySavings, errorReduction };
}
