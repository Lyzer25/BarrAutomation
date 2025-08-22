export type ConfidenceField<T> = {
  value: T;
  confidence: number; // 0..1
  warnings?: string[];
};

export type IssueType = 'required' | 'format' | 'duplicate' | 'confidence' | 'other';

export type Issue = {
  field?: string;
  type: IssueType;
  message: string;
  fix?: string; // short description of an automatic fix, if available
};

export type Mapping = {
  sourceField: string;
  targetField: string;
  note?: string;
};

export type LineItem = {
  description: ConfidenceField<string>;
  quantity: ConfidenceField<number>;
  unitPrice: ConfidenceField<number>;
  total: ConfidenceField<number>;
};

export type ParsedInvoice = {
  vendorName: ConfidenceField<string>;
  vendorId?: ConfidenceField<string>;
  vendorAddress?: ConfidenceField<string>;
  invoiceNumber: ConfidenceField<string>;
  invoiceDate: ConfidenceField<string>; // best-effort ISO string or raw
  dueDate?: ConfidenceField<string>;
  currency?: ConfidenceField<string>;
  subtotal?: ConfidenceField<number>;
  tax?: ConfidenceField<number>;
  total?: ConfidenceField<number>;
  terms?: ConfidenceField<string>;
  lineItems: LineItem[];
  raw?: string; // original input
};

export type ParsedLead = {
  // keep original row/string and parsed components
  raw?: string;
  fullName: ConfidenceField<string>;
  firstName?: ConfidenceField<string>;
  lastName?: ConfidenceField<string>;
  email?: ConfidenceField<string>;
  phone?: ConfidenceField<string>;
  company?: ConfidenceField<string>;
  source?: ConfidenceField<string>;
  utmCampaign?: ConfidenceField<string>;
  rowIndex?: number;
};

export type ParsedTicket = {
  raw?: string;
  from?: ConfidenceField<string>;
  to?: ConfidenceField<string>;
  subject: ConfidenceField<string>;
  date?: ConfidenceField<string>;
  body: ConfidenceField<string>;
  orderNumber?: ConfidenceField<string>;
  piiRedacted?: boolean;
};

export type ERPInvoice = {
  vendorName: string;
  vendorId?: string;
  vendorAddress?: string;
  invoiceNumber: string;
  invoiceDate: string; // ISO YYYY-MM-DD
  dueDate?: string; // ISO
  currency?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  terms?: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
};

export type CRMLead = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  utmCampaign?: string;
};

export type Ticket = {
  subject: string;
  priority: 'low' | 'med' | 'high';
  sentiment: 'neg' | 'neu' | 'pos';
  tags: string[];
  product?: string;
  body: string;
};
