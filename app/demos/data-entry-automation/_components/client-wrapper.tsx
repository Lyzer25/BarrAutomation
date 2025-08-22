'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { loadSampleText } from '../../../../lib/demos/data-entry/sampleLoader';
import { extractInvoice, extractLeadsCsv, extractSupportEmail } from '../../../../lib/demos/data-entry/extractors';
import { mapParsedInvoiceToERP, mapParsedLeadToCRM, mapParsedTicketToTarget, validateAndMap } from '../../../../lib/demos/data-entry/validators';
import { simulateSend } from '../../../../lib/demos/data-entry/simulate';
import type {
  ParsedInvoice,
  ParsedLead,
  ParsedTicket,
  ERPInvoice,
  CRMLead,
  Ticket,
  ConfidenceField,
  Issue,
} from '../../../../types/demo/data-entry';
import { Button } from '../../../../components/ui/button';

type Variant = 'invoice' | 'leads' | 'email';

/**
 * DataEntryAutomationDemo (client)
 * Contains VariantPicker, UploadZone, ExtractionPanel, FieldMapper, ValidationTable, RunSimulationModal, ImpactSidebar
 */

export default function DataEntryAutomationDemo() {
  const [variant, setVariant] = useState<Variant>('invoice');
  const [rawText, setRawText] = useState<string>('');
  const [attachedCsv, setAttachedCsv] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const [parsing, setParsing] = useState(false);
  const [stage, setStage] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [parsedInvoice, setParsedInvoice] = useState<ParsedInvoice | null>(null);
  const [parsedLeads, setParsedLeads] = useState<ParsedLead[] | null>(null);
  const [parsedTicket, setParsedTicket] = useState<ParsedTicket | null>(null);

  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [issues, setIssues] = useState<Issue[]>([]);
  const [mappedPayload, setMappedPayload] = useState<any | null>(null);

  const [runsCount, setRunsCount] = useState<number>(0);
  const [recordsProcessed, setRecordsProcessed] = useState<number>(0);

  const [showModal, setShowModal] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);

  // Impact sidebar controls
  const [recordsPerDay, setRecordsPerDay] = useState(200);
  const [wagePerHour, setWagePerHour] = useState(20);
  const [baselineErrorRate, setBaselineErrorRate] = useState(6);

  useEffect(() => {
    // reset when variant changes
    setRawText('');
    setAttachedCsv(null);
    setFileName(undefined);
    setParsedInvoice(null);
    setParsedLeads(null);
    setParsedTicket(null);
    setMappings({});
    setMappedPayload(null);
    setIssues([]);
    setLogs([]);
    setStage(0);
  }, [variant]);

  // Sample loader
  async function handleLoadSample() {
    try {
      const payload = await loadSampleText(variant === 'invoice' ? 'invoice' : variant === 'leads' ? 'leads' : 'email');
      setFileName(payload.name);
      setRawText(payload.text);
      setAttachedCsv(payload.attachedCsv ?? null);
      setLogs((l) => [...l, `Loaded sample ${payload.name}`]);
    } catch (err) {
      setLogs((l) => [...l, `Failed to load sample: ${(err as Error).message}`]);
    }
  }

  // Extraction flow with animated stages
  async function runExtract() {
    setParsing(true);
    setLogs([]);
    setStage(0);
    const newLogs: string[] = [];
    const push = (s: string) => {
      newLogs.push(s);
      setLogs([...newLogs]);
    };

    // Stage 1 OCR (simulated)
    push('OCR: reading document...');
    setStage(1);
    await sleep(400);

    // Stage 2 Parse
    push('Parse: extracting fields...');
    setStage(2);
    await sleep(450);

    try {
      if (variant === 'invoice') {
        const parsed = await extractInvoice(rawText || (await fetchLocalFile('data/demo/data-entry/invoice.json')));
        setParsedInvoice(parsed);
        push('Parse: extracted invoice fields');
          if (attachedCsv) {
            // parse attached CSV for line items
            const liText = attachedCsv;
            // small CSV parsing to create line items
            const rows = parseCsvRows(liText);
            const headers: string[] = rows.length > 0 ? (rows[0] as string[]) : [];
            const items: any[] = [];
            for (let i = 1; i < rows.length; i++) {
              const row = rows[i] ?? [];
              const obj: any = {};
              for (let j = 0; j < headers.length; j++) {
                const key = headers[j] ?? `col${j}`;
                obj[key] = row[j] ?? '';
              }
              items.push(obj);
            }
            // attach parsed line items with confidence
            const lineItems = items.map((it) => ({
              description: { value: String(it['description'] ?? ''), confidence: 0.9 },
              quantity: { value: Number(it['quantity'] ?? 1), confidence: 0.9 },
              unitPrice: { value: Number(it['unit_price'] ?? it['unit price'] ?? 0), confidence: 0.9 },
              total: { value: Number(it['total'] ?? 0), confidence: 0.9 },
            }));
            setParsedInvoice((p) => (p ? { ...p, lineItems } : null));
            push('Parse: imported line items from CSV');
          }
      } else if (variant === 'leads') {
        const parsed = await extractLeadsCsv(rawText || (await fetchLocalFile('data/demo/data-entry/leads-messy.csv')));
        setParsedLeads(parsed);
        push(`Parse: extracted ${parsed.length} lead rows`);
      } else {
        const parsed = await extractSupportEmail(rawText || (await fetchLocalFile('data/demo/data-entry/support-email.txt')));
        setParsedTicket(parsed);
        push('Parse: extracted ticket fields');
      }

      // Stage 3 Validate
      push('Validate: checking formats & required fields...');
      setStage(3);
      await sleep(350);

      // Pre-map defaults
      autoPopulateMappings();

      // Run mapping & validation
      await runMapValidate();

      // Stage 4 Map
      push('Map: preparing target payload...');
      setStage(4);
      await sleep(250);

      push('Done.');
      setRunsCount((r) => r + 1);
      if (variant === 'leads') setRecordsProcessed((n) => n + (parsedLeads ? parsedLeads.length : 1));
      else setRecordsProcessed((n) => n + 1);
    } catch (err) {
      push(`Error during extraction: ${(err as Error).message}`);
    } finally {
      setParsing(false);
    }
  }

  async function runMapValidate() {
    if (variant === 'invoice' && parsedInvoice) {
      const { mapped, issues } = mapParsedInvoiceToERP(parsedInvoice);
      setMappedPayload(mapped);
      setIssues(issues);
      return { mapped, issues };
    }
    if (variant === 'leads' && parsedLeads) {
      // pick first for single mapping demo
      const mappedAll: CRMLead[] = [];
      const allIssues: Issue[] = [];
      for (const p of parsedLeads) {
        const res = mapParsedLeadToCRM(p);
        mappedAll.push(res.mapped);
        allIssues.push(...res.issues);
      }
      setMappedPayload(mappedAll);
      setIssues(allIssues);
      return { mapped: mappedAll, issues: allIssues };
    }
    if (variant === 'email' && parsedTicket) {
      const { mapped, issues } = mapParsedTicketToTarget(parsedTicket);
      setMappedPayload(mapped);
      setIssues(issues);
      return { mapped, issues };
    }
    return { mapped: null, issues: [] as Issue[] };
  }

  function autoPopulateMappings() {
    if (variant === 'invoice' && parsedInvoice) {
      setMappings({
        vendorName: 'vendorName',
        invoiceNumber: 'invoiceNumber',
        invoiceDate: 'invoiceDate',
        dueDate: 'dueDate',
        subtotal: 'subtotal',
        tax: 'tax',
        total: 'total',
      });
    } else if (variant === 'leads') {
      setMappings({
        fullName: 'firstName',
        mail: 'email',
        'Phone #': 'phone',
        Source: 'source',
        utm_campaign: 'utmCampaign',
      });
    } else if (variant === 'email') {
      setMappings({
        subject: 'subject',
        body: 'body',
        from: 'from',
      });
    }
  }

  async function handleSend() {
    // open modal and simulate send
    setShowModal(true);
    const result = await simulateSend(mappedPayload ?? {}, variant);
    setSimResult(result);
  }

  // small helpers
  function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async function fetchLocalFile(p: string) {
    const res = await fetch('/' + p);
    if (!res.ok) throw new Error('file not found');
    return res.text();
  }

  function parseCsvRows(csv: string): string[][] {
    const lines = csv.trim().split(/\r?\n/);
    return lines.map((l) => {
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

  // Impact KPIs
  const kpis = useMemo(() => {
    const manualPerRecord = 4.5; // minutes
    const automatedPerRecord = 0.6; // minutes
    const timeSavedPerRecordMin = manualPerRecord - automatedPerRecord;
    const timeSavedPerDayHours = (recordsPerDay * timeSavedPerRecordMin) / 60;
    const monthlySavings = timeSavedPerDayHours * wagePerHour * 22;
    const errorReduction = Math.max(0, baselineErrorRate - 0.8);
    // first-pass yield: estimate percent of fields with low confidence
    let lowConfidenceFraction = 0.05;
    if (variant === 'invoice' && parsedInvoice) {
      const allFields = [
        parsedInvoice.vendorName,
        parsedInvoice.invoiceNumber,
        parsedInvoice.invoiceDate,
        parsedInvoice.total,
      ].filter(Boolean) as ConfidenceField<any>[];
      const low = allFields.filter((f) => f.confidence < 0.8).length;
      lowConfidenceFraction = allFields.length ? low / allFields.length : 0.05;
    }
    const firstPassYield = Math.max(0, 100 - Math.round(lowConfidenceFraction * 100));
    return {
      timeSavedPerDayHours,
      monthlySavings: Math.round(monthlySavings),
      errorReduction,
      firstPassYield,
    };
  }, [recordsPerDay, wagePerHour, baselineErrorRate, parsedInvoice, variant]);

  return (
    <div className="container mx-auto py-8">
      {/* Header stats */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Data-Entry Automation Studio</h2>
          <p className="text-sm text-muted-foreground">Watch AI replace manual data entry across invoices, leads, and support emails.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-muted rounded-md text-sm">Runs: {runsCount}</div>
          <div className="px-3 py-1 bg-muted rounded-md text-sm">Records processed: {recordsProcessed}</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          {/* Variant Picker */}
          <div className="mb-4 flex gap-2">
            <button className={`px-3 py-2 rounded ${variant === 'invoice' ? 'bg-primary text-white' : 'bg-card'}`} onClick={() => setVariant('invoice')}>Invoice → ERP</button>
            <button className={`px-3 py-2 rounded ${variant === 'leads' ? 'bg-primary text-white' : 'bg-card'}`} onClick={() => setVariant('leads')}>Leads → CRM</button>
            <button className={`px-3 py-2 rounded ${variant === 'email' ? 'bg-primary text-white' : 'bg-card'}`} onClick={() => setVariant('email')}>Email → Ticket</button>
          </div>

          {/* Upload Zone */}
          <div className="border-dashed border-2 border-border rounded p-4 mb-4 bg-card">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm mb-2">Upload a file or paste text</p>
                <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Paste document text here..." className="w-full h-40 p-2 rounded border" />
                <div className="mt-3 flex gap-2">
                  <Button onClick={handleLoadSample}>Sample Data</Button>
                  <Button onClick={runExtract} disabled={parsing}>Run Extraction</Button>
                </div>
              </div>
              <div className="w-48">
                <div className="text-sm font-medium mb-2">File</div>
                <div className="p-3 rounded border bg-white/5 text-sm">{fileName ?? 'No file'}</div>
                <div className="mt-4 text-xs text-muted-foreground">
                  <div><strong>Stages:</strong></div>
                  <div className="text-xs">{stage === 0 ? 'Idle' : stage === 1 ? 'OCR' : stage === 2 ? 'Parse' : stage === 3 ? 'Validate' : 'Map'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Extraction Panel */}
          <div className="mb-4 rounded border p-4 bg-card">
            <h4 className="font-semibold mb-2">Extraction Pipeline</h4>
            <div className="space-y-2">
              {logs.map((l, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="text-sm">{l}</div>
                </div>
              ))}
            </div>

            {/* Show parsed preview */}
            <div className="mt-4">
              {parsedInvoice && variant === 'invoice' && (
                <div>
                  <h5 className="font-medium">Invoice Preview</h5>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div><strong>Vendor</strong><div>{parsedInvoice.vendorName.value} <ConfidenceChip c={parsedInvoice.vendorName.confidence} /></div></div>
                    <div><strong>Invoice #</strong><div>{parsedInvoice.invoiceNumber.value} <ConfidenceChip c={parsedInvoice.invoiceNumber.confidence} /></div></div>
                    <div><strong>Date</strong><div>{parsedInvoice.invoiceDate.value} <ConfidenceChip c={parsedInvoice.invoiceDate.confidence} /></div></div>
                    <div><strong>Total</strong><div>{parsedInvoice.total?.value ?? parsedInvoice.subtotal?.value} <ConfidenceChip c={parsedInvoice.total?.confidence ?? parsedInvoice.subtotal?.confidence ?? 0.8} /></div></div>
                  </div>
                </div>
              )}

              {parsedLeads && variant === 'leads' && (
                <div>
                  <h5 className="font-medium">Leads Preview ({parsedLeads.length})</h5>
                  <div className="mt-2 space-y-1 text-sm">
                    {parsedLeads.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>{p.fullName.value}</div>
                        <div className="text-xs text-muted-foreground">{p.email?.value ?? 'no email'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedTicket && variant === 'email' && (
                <div>
                  <h5 className="font-medium">Ticket Preview</h5>
                  <div className="mt-2 text-sm">
                    <div><strong>Subject:</strong> {parsedTicket.subject.value} <ConfidenceChip c={parsedTicket.subject.confidence} /></div>
                    <div className="mt-2"><strong>Body (redacted):</strong><div className="mt-1 p-2 bg-gray-50 rounded text-xs whitespace-pre-wrap">{parsedTicket.body.value}</div></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Field Mapper */}
          <div className="mb-4 rounded border p-4 bg-card">
            <h4 className="font-semibold mb-2">Field Mapper</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm mb-2">Source Fields</div>
                <div className="space-y-2">
                  {variant === 'invoice' && parsedInvoice && Object.keys(parsedInvoice).map((k) => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <div className="capitalize">{k}</div>
                      <div className="flex items-center gap-2">
                        <select className="p-1 border rounded text-sm" value={mappings[k] ?? ''} onChange={(e) => setMappings((m) => ({ ...m, [k]: e.target.value }))}>
                          <option value="">(no mapping)</option>
                          <option value="vendorName">vendorName</option>
                          <option value="invoiceNumber">invoiceNumber</option>
                          <option value="invoiceDate">invoiceDate</option>
                          <option value="dueDate">dueDate</option>
                          <option value="subtotal">subtotal</option>
                          <option value="tax">tax</option>
                          <option value="total">total</option>
                        </select>
                        {renderConfidence(parsedInvoice[k as keyof ParsedInvoice] as any)}
                      </div>
                    </div>
                  ))}

                  {variant === 'leads' && parsedLeads && parsedLeads[0] && Object.keys(parsedLeads[0]).map((k) => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <div className="capitalize">{k}</div>
                      <div className="flex items-center gap-2">
                        <select className="p-1 border rounded text-sm" value={mappings[k] ?? ''} onChange={(e) => setMappings((m) => ({ ...m, [k]: e.target.value }))}>
                          <option value="">(no mapping)</option>
                          <option value="firstName">firstName</option>
                          <option value="lastName">lastName</option>
                          <option value="email">email</option>
                          <option value="phone">phone</option>
                          <option value="company">company</option>
                          <option value="source">source</option>
                          <option value="utmCampaign">utmCampaign</option>
                        </select>
                        {renderConfidence((parsedLeads[0] as any)[k])}
                      </div>
                    </div>
                  ))}

                  {variant === 'email' && parsedTicket && Object.keys(parsedTicket).map((k) => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <div className="capitalize">{k}</div>
                      <div className="flex items-center gap-2">
                        <select className="p-1 border rounded text-sm" value={mappings[k] ?? ''} onChange={(e) => setMappings((m) => ({ ...m, [k]: e.target.value }))}>
                          <option value="">(no mapping)</option>
                          <option value="subject">subject</option>
                          <option value="body">body</option>
                          <option value="product">product</option>
                          <option value="priority">priority</option>
                        </select>
                        {renderConfidence((parsedTicket as any)[k])}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button onClick={autoPopulateMappings}>Reset Mapping</Button>
                  <Button onClick={runMapValidate}>Apply Mapping & Validate</Button>
                </div>
              </div>

              {/* Right column: Validation */}
              <div>
                <div className="text-sm mb-2">Validation</div>
                <div className="rounded border p-2 bg-white/5 min-h-[120px]">
                  {issues.length === 0 && <div className="text-sm text-muted-foreground">No issues found</div>}
                  {issues.map((iss, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1">
                      <div>
                        <div className="font-medium">{iss.field}</div>
                        <div className="text-xs text-muted-foreground">{iss.message}</div>
                      </div>
                      <div>
                        {iss.fix && <button className="text-xs px-2 py-1 bg-secondary rounded" onClick={() => applyQuickFix(iss)}>Fix</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Run / Simulation */}
          <div className="flex gap-2">
            <Button onClick={() => { setShowModal(true); }} disabled={!mappedPayload}>Send to System</Button>
            <Button variant="secondary" onClick={() => { setMappedPayload(null); setIssues([]); setParsedInvoice(null); setParsedLeads(null); setParsedTicket(null); }}>Reset Demo</Button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
              <div className="bg-white rounded shadow-lg p-6 w-3/4 max-h-[80vh] overflow-auto z-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Run Simulation</h4>
                  <div className="text-sm text-muted-foreground">Mock webhook payload & response</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-sm mb-2">Payload</div>
                    <pre className="bg-gray-50 p-2 rounded text-xs max-h-64 overflow-auto">{JSON.stringify(mappedPayload ?? {}, null, 2)}</pre>
                    <div className="mt-2 flex gap-2">
                      <Button onClick={() => copyCurl(mappedPayload, variant)}>Copy cURL</Button>
                      <Button onClick={() => downloadJson(mappedPayload, `${variant}-payload.json`)}>Download JSON</Button>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-sm mb-2">Response</div>
                    <div className="bg-gray-50 p-2 rounded text-xs max-h-64 overflow-auto">
                      {simResult ? (
                        <>
                          <div><strong>Status:</strong> {simResult.status}</div>
                          <div><strong>ID:</strong> {simResult.id}</div>
                          <div className="mt-2"><strong>Timeline</strong></div>
                          <ul className="text-xs list-disc ml-4">
                            {simResult.timeline.map((t: any, idx: number) => (<li key={idx}>{t.step} @ {t.at}</li>))}
                          </ul>
                        </>
                      ) : (
                        <div className="text-muted-foreground">Click "Send" to run simulation</div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button onClick={async () => { const r = await simulateSend(mappedPayload ?? {}, variant); setSimResult(r); }}>Send</Button>
                      <Button onClick={() => { setShowModal(false); setSimResult(null); }}>Close</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="col-span-4">
          <div className="rounded border p-4 mb-4 bg-card">
            <h5 className="font-semibold mb-2">Impact Simulator</h5>
            <div className="text-sm mb-2">Records/day: {recordsPerDay}</div>
            <input type="range" min={10} max={2000} value={recordsPerDay} onChange={(e) => setRecordsPerDay(Number(e.target.value))} />
            <div className="text-sm mt-3">Wage $/hr: ${wagePerHour}</div>
            <input type="range" min={12} max={40} value={wagePerHour} onChange={(e) => setWagePerHour(Number(e.target.value))} />
            <div className="text-sm mt-3">Baseline error rate %: {baselineErrorRate}%</div>
            <input type="range" min={2} max={12} value={baselineErrorRate} onChange={(e) => setBaselineErrorRate(Number(e.target.value))} />

            <div className="mt-4 space-y-2 text-sm">
              <div><strong>Time Saved / day:</strong> {kpis.timeSavedPerDayHours.toFixed(1)} hrs</div>
              <div><strong>Error Reduction:</strong> {kpis.errorReduction}%</div>
              <div><strong>Monthly Savings:</strong> ${kpis.monthlySavings}</div>
              <div><strong>First-Pass Yield:</strong> {kpis.firstPassYield}%</div>
            </div>
          </div>

          <div className="rounded border p-4 bg-card">
            <h5 className="font-semibold mb-2">Notes</h5>
            <div className="text-sm text-muted-foreground">
              This demo runs entirely client-side using mocked extractors and mappers. No external networks are called.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // helper subcomponents and functions

  function renderConfidence(field?: ConfidenceField<any> | any) {
    const c = field && typeof field === 'object' && 'confidence' in field ? field.confidence : undefined;
    return <ConfidenceChip c={c ?? 0} />;
  }

  function ConfidenceChip({ c }: { c: number }) {
    const percent = Math.round((c ?? 0) * 100);
    const color = c > 0.8 ? 'bg-emerald-500' : c > 0.6 ? 'bg-yellow-400' : 'bg-red-400';
    return <span className={`px-2 py-0.5 text-xs text-white rounded ${color}`}>{percent}%</span>;
  }

  function applyQuickFix(issue: Issue) {
    // very small set of quick fixes applied locally
    if (!issue.field) return;
    if (issue.fix?.toLowerCase().includes('normalize to yyyy')) {
      // find and normalize date fields in parsedInvoice
      if (parsedInvoice && parsedInvoice.invoiceDate) {
        const { value } = (window as any).normalizeDate ? (window as any).normalizeDate(parsedInvoice.invoiceDate.value) : { value: parsedInvoice.invoiceDate.value };
        setParsedInvoice({ ...parsedInvoice, invoiceDate: { value, confidence: 0.95 } });
        setIssues((is) => is.filter((i) => i !== issue));
      }
    }
  }

  function copyCurl(payload: any, variant: string) {
    const url = `https://example.com/webhook/${variant}`;
    const curl = `curl -X POST ${url} -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`;
    navigator.clipboard.writeText(curl);
    setLogs((l) => [...l, 'Copied cURL to clipboard']);
  }

  function downloadJson(payload: any, filename = 'payload.json') {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
