'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SAMPLES, TOOLTIPS, computeImpact, UseCaseKey } from '../../../data/dataEntrySamples';
import { Button } from '../../../components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../../components/ui/tooltip';
import { Card } from '../../../components/ui/card';

/**
 * Guided, visual Data-Entry Automation Studio demo
 * - Client-only
 * - Uses static samples from data/dataEntrySamples.ts
 * - Lightweight, accessible, and responsive
 */

const USE_CASE_KEYS: UseCaseKey[] = ['invoice', 'lead', 'email'];

export default function DataEntryAutomationStudioPage() {
  const [active, setActive] = useState<UseCaseKey>('invoice');
  const [text, setText] = useState<string>(SAMPLES.invoice.sampleText);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<Record<string, any> | null>(SAMPLES.invoice.extracted);
  const [mapping, setMapping] = useState<{ from: string; to: string }[]>(
    JSON.parse(JSON.stringify(SAMPLES.invoice.mapping))
  );
  const [recordsPerDay, setRecordsPerDay] = useState<number>(SAMPLES.invoice.impact.recordsPerDay);
  const [runs, setRuns] = useState<number>(0);
  const [recordsProcessed, setRecordsProcessed] = useState<number>(0);

  useEffect(() => {
    // load new sample when active changes
    const s = SAMPLES[active];
    setText(s.sampleText);
    setExtracted(s.extracted);
    setMapping(JSON.parse(JSON.stringify(s.mapping)));
    setRecordsPerDay(s.impact.recordsPerDay);
  }, [active]);

  async function runExample() {
    setLoading(true);
    // simulate processing time 600-900ms
    await new Promise((r) => setTimeout(r, 600 + Math.floor(Math.random() * 300)));
    const s = SAMPLES[active];
    setExtracted(s.extracted);
    setMapping(s.mapping);
    setRuns((r) => r + 1);
    setRecordsProcessed((n) => n + (s.impact.recordsPerDay ? Math.max(1, Math.round(s.impact.recordsPerDay / 200)) : 1));
    setLoading(false);
  }

  function insertSample() {
    const s = SAMPLES[active];
    setText(s.sampleText);
    // keep extracted/mapping until user runs example
  }

  const impact = useMemo(() => {
    const s = SAMPLES[active];
    return computeImpact({
      recordsPerDay,
      wagePerHour: s.impact.wagePerHour,
      baselineErrorPct: s.impact.baselineErrorPct,
      timeMinutesPerRecord: s.impact.timeMinutesPerRecord,
    });
  }, [active, recordsPerDay]);

  return (
    <TooltipProvider>
    <main className="container mx-auto px-4 py-10">
      {/* Header */}
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Data‑Entry Automation Studio</h1>
          <p className="mt-2 text-sm text-subtle-gray">Watch AI convert messy inputs into clean, mapped records — a simple, guided demo.</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-muted-foreground">Runs: <span aria-live="polite" className="font-mono ml-1">{runs}</span></div>
          <div className="text-xs text-muted-foreground">Records processed: <span aria-live="polite" className="font-mono ml-1">{recordsProcessed}</span></div>
        </div>
      </header>

      {/* Selector */}
      <section className="mb-6">
        <div role="tablist" aria-label="Use case selector" className="inline-flex rounded-xl overflow-hidden border border-white/10">
          {USE_CASE_KEYS.map((k) => {
            const s = SAMPLES[k];
            const activeClass = k === active ? 'bg-accent text-black' : 'bg-card text-white';
            return (
              <button
                key={k}
                role="tab"
                aria-selected={k === active}
                aria-controls={`panel-${k}`}
                onClick={() => setActive(k)}
                className={`px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 ${activeClass}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Before / After visual */}
      <section className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Before</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Manual reading and typing</li>
            <li>• Several minutes per record</li>
            <li>• Typos and inconsistent formats</li>
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-2">After</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Instant structured extraction</li>
            <li>• Auto‑mapping to system fields</li>
            <li>• Higher first‑pass yield and fewer fixes</li>
          </ul>
        </Card>
      </section>

      {/* Sample Data + Results */}
      <section className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4" aria-labelledby="sample-heading">
          <div className="flex items-center justify-between mb-2">
            <h4 id="sample-heading" className="font-medium">Sample Data</h4>
            <div className="text-xs text-muted-foreground">Demo only</div>
          </div>

          <textarea
            aria-label="Sample data"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 p-3 bg-transparent border border-white/10 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />

          <div className="mt-3 flex gap-3">
            <Button onClick={insertSample} aria-label="Insert sample data">Insert Sample</Button>
            <Button onClick={runExample} aria-label="Run example extraction" disabled={loading}>
              {loading ? 'Processing…' : 'Run Example'}
            </Button>
          </div>
        </Card>

        <Card className="p-4" aria-labelledby="results-heading">
          <div className="flex items-center justify-between mb-2">
            <h4 id="results-heading" className="font-medium">Extraction Results</h4>
            <div className="text-xs text-muted-foreground">Read-only</div>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse rounded" />
              <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse rounded" />
              <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse rounded" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {extracted && Object.entries(extracted).map(([k, v]) => (
                  <div key={k} className="bg-white/5 rounded p-2">
                    <div className="text-xs text-muted-foreground capitalize">{k}</div>
                    <div className="mt-1 font-mono text-sm">{String(v)}</div>
                  </div>
                ))}
              </div>

              <h5 className="mt-4 font-medium">Field Mapping <span className="ml-2">
                <Tooltip>
                  <TooltipTrigger asChild><span className="text-xs text-muted-foreground">?</span></TooltipTrigger>
                  <TooltipContent>{TOOLTIPS.mapping}</TooltipContent>
                </Tooltip>
              </span></h5>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                {mapping.map((m, i) => (
                  <li key={i}><strong>{m.from}</strong> → <span className="font-mono">{m.to}</span></li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </section>

      {/* Impact Snapshot */}
      <section className="p-4 rounded border border-white/6 mb-6">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Impact Snapshot</h4>
          <div className="text-xs text-muted-foreground">Demo only</div>
        </div>

        <div className="mt-4 grid md:grid-cols-4 gap-4">
          <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                Records/day
                <Tooltip>
                  <TooltipTrigger asChild><span className="ml-1 text-xs text-muted-foreground">?</span></TooltipTrigger>
                  <TooltipContent>{TOOLTIPS.recordsPerDay}</TooltipContent>
                </Tooltip>
              </label>
            <input
              aria-label="Records per day"
              type="range"
              min={10}
              max={500}
              value={recordsPerDay}
              onChange={(e) => setRecordsPerDay(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">{recordsPerDay}</div>
          </div>

          <div className="bg-white/5 rounded p-3">
            <div className="text-xs text-muted-foreground">Time saved/day <Tooltip><TooltipTrigger asChild><span className="ml-1 text-xs">?</span></TooltipTrigger><TooltipContent>{TOOLTIPS.timeSaved}</TooltipContent></Tooltip></div>
            <div className="text-lg font-semibold">{impact.hoursSavedPerDay.toFixed(1)} hrs</div>
          </div>

          <div className="bg-white/5 rounded p-3">
            <div className="text-xs text-muted-foreground">Monthly savings <Tooltip><TooltipTrigger asChild><span className="ml-1 text-xs">?</span></TooltipTrigger><TooltipContent>{TOOLTIPS.wage}</TooltipContent></Tooltip></div>
            <div className="text-lg font-semibold">${impact.monthlySavings}</div>
          </div>

          <div className="bg-white/5 rounded p-3">
            <div className="text-xs text-muted-foreground">First‑pass yield <Tooltip><TooltipTrigger asChild><span className="ml-1 text-xs">?</span></TooltipTrigger><TooltipContent>{TOOLTIPS.firstPassYield}</TooltipContent></Tooltip></div>
            <div className="text-lg font-semibold">{Math.round(SAMPLES[active].firstPassYield * 100)}%</div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="mb-6">
        <p className="text-sm text-muted-foreground">This demo runs entirely in your browser using mocked extractors and mappers — no external networks are called.</p>
      </section>

      {/* CTA Bar */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 rounded border border-white/6">
        <p className="text-sm text-muted-foreground">Ready to map this to your stack? We tailor extractors, validators, and connectors to your process.</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/contact" className="px-4 py-2">Build my solution</Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const s = SAMPLES[active];
              setText(s.sampleText);
              setExtracted(s.extracted);
              setMapping(JSON.parse(JSON.stringify(s.mapping)));
              setRecordsPerDay(s.impact.recordsPerDay);
              setWagePerHour(s.impact.wagePerHour);
              setTimePerRecord(s.impact.timeMinutesPerRecord);
              setOverheadPct(25);
            }}
          >
            Reset
          </Button>
        </div>
      </section>
    </main>
    </TooltipProvider>
  );
}
