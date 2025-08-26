'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SAMPLES, TOOLTIPS, computeImpact, UseCaseKey } from '../../../data/dataEntrySamples';
import { Button } from '../../../components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../../components/ui/tooltip';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

/**
 * Guided, visual Data-Entry Automation Studio demo
 * - Client-only
 * - Uses static samples from data/dataEntrySamples.ts
 * - Lightweight, accessible, and responsive
 */

const USE_CASE_KEYS: UseCaseKey[] = ['invoice', 'lead', 'email'];

// ROI Calculator Component
function ROICalculator({
  initialRecordsPerDay,
  initialWagePerHour,
  initialManualTime,
}: {
  initialRecordsPerDay: number;
  initialWagePerHour: number;
  initialManualTime: number;
}) {
  const [recordsPerDay, setRecordsPerDay] = useState(initialRecordsPerDay);
  const [wagePerHour, setWagePerHour] = useState(initialWagePerHour);
  const [manualTimeMinutes, setManualTimeMinutes] = useState(initialManualTime);
  
  // AI processing time is constant (6 seconds = 0.1 minutes)
  const AI_TIME_MINUTES = 0.1;

  // Calculate derived values
  const calculations = useMemo(() => {
    // Cost per record
    const costPerRecordManual = (wagePerHour / 60) * manualTimeMinutes;
    const costPerRecordAutomated = (wagePerHour / 60) * AI_TIME_MINUTES;
    
    // Monthly costs (22 working days)
    const monthlyCostManual = costPerRecordManual * recordsPerDay * 22;
    const monthlyCostAutomated = costPerRecordAutomated * recordsPerDay * 22;
    
    // Savings
    const netMonthlySavings = monthlyCostManual - monthlyCostAutomated;
    const roiPercent = monthlyCostManual > 0 ? (netMonthlySavings / monthlyCostManual) * 100 : 0;
    
    // Time saved
    const timeSavedPerDay = ((manualTimeMinutes - AI_TIME_MINUTES) * recordsPerDay) / 60;
    
    return {
      costPerRecordManual,
      costPerRecordAutomated,
      monthlyCostManual,
      monthlyCostAutomated,
      netMonthlySavings,
      roiPercent,
      timeSavedPerDay,
    };
  }, [recordsPerDay, wagePerHour, manualTimeMinutes]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="records-per-day" className="text-sm text-muted-foreground flex items-center gap-1">
            Records/day
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  tabIndex={0} 
                  role="button"
                  aria-label="More info about records per day"
                  className="text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"
                >
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent>{TOOLTIPS.recordsPerDay}</TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="records-per-day"
            type="number"
            min={1}
            max={10000}
            value={recordsPerDay}
            onChange={(e) => setRecordsPerDay(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="wage-per-hour" className="text-sm text-muted-foreground flex items-center gap-1">
            Wage $/hr
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  tabIndex={0} 
                  role="button"
                  aria-label="More info about wage per hour"
                  className="text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"
                >
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent>{TOOLTIPS.wage}</TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="wage-per-hour"
            type="number"
            min={1}
            max={200}
            step={0.5}
            value={wagePerHour}
            onChange={(e) => setWagePerHour(Math.max(1, parseFloat(e.target.value) || 1))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="manual-time" className="text-sm text-muted-foreground flex items-center gap-1">
            Manual time (min/record)
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  tabIndex={0} 
                  role="button"
                  aria-label="More info about manual time per record"
                  className="text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"
                >
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent>{TOOLTIPS.timePerRecord}</TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="manual-time"
            type="number"
            min={0.5}
            max={60}
            step={0.5}
            value={manualTimeMinutes}
            onChange={(e) => setManualTimeMinutes(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
            className="mt-1"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white/5">
          <div className="text-xs text-muted-foreground mb-2">Time Saved/Day</div>
          <div className="text-2xl font-bold text-green-400">
            {calculations.timeSavedPerDay.toFixed(1)} hrs
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            vs {AI_TIME_MINUTES * 60} seconds per record with AI
          </div>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="text-xs text-muted-foreground mb-2">Monthly Savings</div>
          <div className="text-2xl font-bold text-green-400">
            ${calculations.netMonthlySavings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Based on 22 working days
          </div>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="text-xs text-muted-foreground mb-2">ROI</div>
          <div className="text-2xl font-bold text-green-400">
            {calculations.roiPercent.toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Cost reduction
          </div>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white/5 rounded p-4">
        <h5 className="text-sm font-medium mb-3">Cost Breakdown</h5>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Manual cost per record:</span>
              <span className="font-mono">${calculations.costPerRecordManual.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Manual monthly cost:</span>
              <span className="font-mono">${calculations.monthlyCostManual.toFixed(0)}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">AI cost per record:</span>
              <span className="font-mono">${calculations.costPerRecordAutomated.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI monthly cost:</span>
              <span className="font-mono">${calculations.monthlyCostAutomated.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Use these numbers to estimate your current spend per record and the monthly savings when automated.
      </p>
    </div>
  );
}

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
    setMapping([...s.mapping]);
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

              <h5 className="mt-4 font-medium">Field Mapping
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      tabIndex={0} 
                      role="button"
                      aria-label="More info about field mapping"
                      className="ml-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"
                    >
                      ?
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{TOOLTIPS.mapping}</TooltipContent>
                </Tooltip>
              </h5>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                {mapping.map((m, i) => (
                  <li key={i}><strong>{m.from}</strong> → <span className="font-mono">{m.to}</span></li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </section>

      {/* ROI Calculator */}
      <section className="p-4 rounded border border-white/6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">ROI Calculator</h4>
          <div className="text-xs text-muted-foreground">Calculate your savings</div>
        </div>

        <ROICalculator
          initialRecordsPerDay={recordsPerDay}
          initialWagePerHour={SAMPLES[active].impact.wagePerHour}
          initialManualTime={SAMPLES[active].impact.timeMinutesPerRecord}
        />
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
              setText(SAMPLES[active].sampleText);
              setExtracted(SAMPLES[active].extracted);
              setMapping(JSON.parse(JSON.stringify(SAMPLES[active].mapping)));
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
