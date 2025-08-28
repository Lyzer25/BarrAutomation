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
  // Use string state for inputs so they can be empty / 0
  const [recordsPerDayStr, setRecordsPerDayStr] = useState(String(initialRecordsPerDay));
  const [wagePerHourStr, setWagePerHourStr] = useState(String(initialWagePerHour));
  const [manualTimeMinutesStr, setManualTimeMinutesStr] = useState(String(initialManualTime));
  const [dataEntryEmployeesStr, setDataEntryEmployeesStr] = useState('1'); // "Number of data entry employees" (default 1)

  // Input filter helper: prevents non-numeric keystrokes while allowing editing keys.
  // allowDecimal = true for wage/time fields
  const filterNumeric =
    (allowDecimal: boolean = false) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
      if (allowedKeys.includes(e.key)) return;
      if (/^[0-9]$/.test(e.key)) return;
      if (allowDecimal && (e.key === '.' || e.key === ',')) return;
      // Prevent any other characters
      e.preventDefault();
    };

  // AI constants
  const AI_TIME_MINUTES = 0.1; // 6 seconds per record
  const AI_SETUP_COST = 5000; // One-time setup fee
  const AI_MONTHLY_COST = 1500; // Fixed $1500/month for AI service

  // AI can process 600 records per hour (6 seconds each)
  // Assuming 24/7 availability but practical limit of 10,000 per day
  const AI_MAX_CAPACITY_PER_DAY = 10000;

  // Calculate derived values
  const calculations = useMemo(() => {
    // Parse user inputs (strings -> numbers). Allow empty/0 safely and preserve "0" as valid.
    const recordsPerDayNum = recordsPerDayStr === '' ? 0 : Math.max(0, Math.floor(Number(recordsPerDayStr) || 0));
    const wagePerHourNum = wagePerHourStr === '' ? 0 : Math.max(0, Number(wagePerHourStr) || 0);
    const manualTimeMinutesNum = manualTimeMinutesStr === '' ? 0 : Math.max(0, Number(manualTimeMinutesStr) || 0);
    const numEmployees = dataEntryEmployeesStr === '' ? 0 : Math.max(0, Math.floor(Number(dataEntryEmployeesStr) || 0));

    // Human capacity (per person) and totals
    const humanHoursPerDay = 8; // Standard work day (confirmed)
    const humanRecordsPerDay = manualTimeMinutesNum > 0 ? Math.floor((humanHoursPerDay * 60) / manualTimeMinutesNum) : 0;
    const humanTotalCapacity = humanRecordsPerDay * numEmployees;

    // Coverage and recommended staff
    const coveragePct = recordsPerDayNum > 0 ? Math.min(100, Math.round((humanTotalCapacity / recordsPerDayNum) * 100)) : 0;
    const recommendedEmployees = humanRecordsPerDay > 0 ? Math.ceil(recordsPerDayNum / humanRecordsPerDay) : 0;

    // Per-record manual cost (for transparency)
    const costPerRecordManual = manualTimeMinutesNum > 0 ? (wagePerHourNum / 60) * manualTimeMinutesNum : 0;

    // Manual monthly cost (staff-based)
    const monthlyCostManual = numEmployees * wagePerHourNum * humanHoursPerDay * 22;

    // AI cost is fixed at AI_MONTHLY_COST/month
    const monthlyCostAutomated = AI_MONTHLY_COST;
    const costPerRecordAutomated = recordsPerDayNum > 0 ? AI_MONTHLY_COST / (recordsPerDayNum * 22) : 0;

    // Savings
    const netMonthlySavings = monthlyCostManual - monthlyCostAutomated;

    // Payback period (months to recover setup cost)
    const paybackPeriod = netMonthlySavings > 0 ? AI_SETUP_COST / netMonthlySavings : 0;

    // First year ROI (includes setup cost)
    const firstYearCostAI = AI_SETUP_COST + AI_MONTHLY_COST * 12;
    const firstYearCostManual = monthlyCostManual * 12;
    const firstYearSavings = firstYearCostManual - firstYearCostAI;
    const firstYearROI = firstYearCostAI > 0 ? (firstYearSavings / firstYearCostAI) * 100 : 0;

    // Time saved (hours/day)
    const timeSavedPerDay = ((manualTimeMinutesNum - AI_TIME_MINUTES) * recordsPerDayNum) / 60;

    // Human processing time (total team hours per day and per person)
    const humanProcessingTimeHoursTotal = (manualTimeMinutesNum * recordsPerDayNum) / 60;
    const humanProcessingTimeHoursPerPerson = numEmployees > 0 ? humanProcessingTimeHoursTotal / numEmployees : humanProcessingTimeHoursTotal;

    return {
      // parsed values exposed for rendering
      recordsPerDayNum,
      wagePerHourNum,
      manualTimeMinutesNum,
      numEmployees,

      costPerRecordManual,
      costPerRecordAutomated,
      monthlyCostManual,
      monthlyCostAutomated,
      netMonthlySavings,
      firstYearROI,
      paybackPeriod,
      timeSavedPerDay,
      humanRecordsPerDay,
      humanTotalCapacity,
      coveragePct,
      recommendedEmployees,
      humanProcessingTimeHoursTotal,
      humanProcessingTimeHoursPerPerson,
      aiCapacityPerDay: AI_MAX_CAPACITY_PER_DAY,
      firstYearSavings,
    };
  }, [recordsPerDayStr, wagePerHourStr, manualTimeMinutesStr, dataEntryEmployeesStr]);

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
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={recordsPerDayStr}
            onChange={(e) => setRecordsPerDayStr(e.target.value)}
            onKeyDown={filterNumeric(false)}
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
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={wagePerHourStr}
            onChange={(e) => setWagePerHourStr(e.target.value)}
            onKeyDown={filterNumeric(true)}
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
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={manualTimeMinutesStr}
            onChange={(e) => setManualTimeMinutesStr(e.target.value)}
            onKeyDown={filterNumeric(true)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Number of data entry employees */}
      <div className="mt-3 md:mt-0">
        <Label htmlFor="data-entry-employees" className="text-sm text-muted-foreground flex items-center gap-1">
          Number of data entry employees
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                tabIndex={0}
                role="button"
                aria-label="More info about number of data entry employees"
                className="ml-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"
              >
                ?
              </button>
            </TooltipTrigger>
            <TooltipContent>Set how many employees currently perform data-entry. Use 0 to model an AI-only scenario.</TooltipContent>
          </Tooltip>
        </Label>
        <Input
          id="data-entry-employees"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={dataEntryEmployeesStr}
          onChange={(e) => setDataEntryEmployeesStr(e.target.value)}
          onKeyDown={filterNumeric(false)}
          className="mt-1 w-36"
        />
      </div>

      {/* Results Section */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/5">
          <div className="text-xs text-muted-foreground mb-2">Monthly Savings</div>
          <div className={`text-2xl font-bold ${calculations.netMonthlySavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${Math.abs(calculations.netMonthlySavings).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {calculations.netMonthlySavings > 0 ? 'After implementation' : 'Need higher volume'}
          </div>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="text-xs text-muted-foreground mb-2">First Year ROI</div>
          <div className={`text-2xl font-bold ${calculations.firstYearROI > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
            {calculations.firstYearROI > 0 ? `${calculations.firstYearROI.toFixed(0)}%` : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Including $5K setup
          </div>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="text-xs text-muted-foreground mb-2">Payback Period</div>
          <div className={`text-2xl font-bold ${calculations.paybackPeriod > 0 && calculations.paybackPeriod < 12 ? 'text-green-400' : calculations.paybackPeriod >= 12 ? 'text-yellow-400' : 'text-gray-400'}`}>
            {calculations.paybackPeriod > 0 ? `${calculations.paybackPeriod.toFixed(1)} mo` : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            To recover setup cost
          </div>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="text-xs text-muted-foreground mb-2">Number of data entry employees</div>
          <div className="text-2xl font-bold text-blue-400">
            {calculations.numEmployees}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            vs 1 AI system
          </div>
        </Card>
      </div>

      {/* First Year Summary */}
      <Card className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/20">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">First Year Total Savings</div>
            <div className={`text-3xl font-bold ${calculations.firstYearSavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${Math.abs(calculations.firstYearSavings).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Investment Required</div>
            <div className="text-lg">$5,000 setup + $1,500/mo</div>
          </div>
        </div>
      </Card>

      {/* Capacity Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 bg-white/5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-muted-foreground mb-2">Human Capacity</div>
              <div className="text-lg font-semibold">
                {calculations.humanRecordsPerDay} records/day <span className="text-sm text-white/60">per person</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Per person (8 hour workday)</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Team total</div>
              <div className="text-lg font-semibold">{calculations.humanTotalCapacity} records/day</div>
              <div className="text-xs text-muted-foreground mt-1">for {calculations.numEmployees} person(s)</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="text-xs text-muted-foreground">Coverage</div>
            <div className={`text-xs font-semibold ${calculations.coveragePct >= 100 ? 'text-green-400' : calculations.coveragePct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {calculations.coveragePct}% of required volume
            </div>

            <div className="text-xs text-muted-foreground">Recommended staff</div>
            <div className="text-xs">{calculations.recommendedEmployees} person(s)</div>

            <div className="text-xs text-muted-foreground">Team processing time</div>
            <div className="text-xs">
              {calculations.humanProcessingTimeHoursTotal.toFixed(1)} hrs/day total • {calculations.humanProcessingTimeHoursPerPerson.toFixed(1)} hrs/day per person
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="text-xs text-muted-foreground mb-2">AI Capacity</div>
          <div className="text-lg font-semibold text-green-400">
            {calculations.aiCapacityPerDay.toLocaleString()} records/day
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            24/7 availability
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
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Manual monthly cost:</span>
              <span className="font-mono">${calculations.monthlyCostManual.toFixed(0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Staff required:</span>
              <span className="font-mono">{calculations.numEmployees} person(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Team processing time:</span>
              <span className="font-mono">{calculations.humanProcessingTimeHoursTotal.toFixed(1)} hrs/day</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">AI cost per record:</span>
              <span className="font-mono">${calculations.costPerRecordAutomated.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">AI setup cost (one-time):</span>
              <span className="font-mono">${AI_SETUP_COST}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">AI monthly cost:</span>
              <span className="font-mono">${AI_MONTHLY_COST}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing time:</span>
              <span className="font-mono">{AI_TIME_MINUTES * 60}s per record</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        AI service requires a one-time $5,000 setup fee plus $1,500/month for unlimited processing. Most businesses see ROI within 3-6 months.
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
