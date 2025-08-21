import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

/**
 * ClientSuccessEngineDemo.tsx
 * Single-file, frontend-only interactive Client Success Engine demo.
 *
 * Export default: ClientSuccessEngineDemo
 *
 * Note: uses shadcn/ui components from components/ui/*
 * and framer-motion for subtle animations. All data simulated client-side.
 */

/* ===========================
   Types
   =========================== */

type PackageTier = "Starter" | "Growth" | "Premium";
type KickoffTarget = "ASAP" | "7 days" | "14 days";

type ClientProfile = {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  servicePackage: PackageTier;
  startDate: string; // ISO
};

type ContractTerms = {
  clientName: string;
  startDate: string;
  endDate: string;
  scope: string[];
  billingCadence: "Monthly" | "Quarterly" | "Annually";
  value: number;
};

type Owner = {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarColor?: string;
};

type TaskStatus = "Not Started" | "In Progress" | "Done";

type Task = {
  id: string;
  title: string;
  ownerId?: string;
  ownerName?: string;
  ownerRole?: string;
  status: TaskStatus;
  dueDate: string;
  dependencyIds?: string[];
  notes?: string;
};

type EngineConfig = {
  provisionAsana: boolean;
  provisionDocuSign: boolean;
  provisionPortal: boolean;
  provisionEmails: boolean;
  packageTier: PackageTier;
  kickoffTarget: KickoffTarget;
};

type StatusReport = {
  week: number;
  date: string;
  greeting: string;
  completed: Task[];
  upcoming: Task[];
  blockers: string[];
  nextSteps: string[];
};

/* ===========================
   Utilities
   =========================== */

const uid = (prefix = "") =>
  prefix + Math.random().toString(36).slice(2, 9);

const today = () => {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d;
};

const addDays = (d: Date, days: number) => {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const isoDate = (d: Date) => d.toISOString();

const formatCurrency = (v: number) =>
  v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/* deterministic owner sets */
const OWNER_POOLS: Record<PackageTier, Owner[]> = {
  Starter: [
    { id: "o1", name: "Avery Shah", role: "Client Success Lead", email: "avery@barri.ai", avatarColor: "bg-indigo-600" },
    { id: "o2", name: "Jordan Kim", role: "Project Manager", email: "jordan@barri.ai", avatarColor: "bg-emerald-600" },
  ],
  Growth: [
    { id: "o3", name: "Taylor Reed", role: "Engagement Manager", email: "taylor@barri.ai", avatarColor: "bg-violet-600" },
    { id: "o4", name: "Samir Patel", role: "Implementation Lead", email: "samir@barri.ai", avatarColor: "bg-rose-600" },
    { id: "o2", name: "Jordan Kim", role: "Project Manager", email: "jordan@barri.ai", avatarColor: "bg-emerald-600" },
  ],
  Premium: [
    { id: "o5", name: "Riley Thompson", role: "Senior Client Strategist", email: "riley@barri.ai", avatarColor: "bg-yellow-600" },
    { id: "o3", name: "Taylor Reed", role: "Engagement Manager", email: "taylor@barri.ai", avatarColor: "bg-violet-600" },
    { id: "o1", name: "Avery Shah", role: "Client Success Lead", email: "avery@barri.ai", avatarColor: "bg-indigo-600" },
    { id: "o4", name: "Samir Patel", role: "Implementation Lead", email: "samir@barri.ai", avatarColor: "bg-rose-600" },
  ],
};

const sampleClient = (pkg: PackageTier = "Growth"): ClientProfile => {
  const start = addDays(today(), 3);
  return {
    id: uid("c_"),
    companyName: "Brightline Creative",
    contactName: "Avery Shah",
    contactEmail: "avery@brightline.co",
    contactPhone: "555-321-9876",
    servicePackage: pkg,
    startDate: isoDate(start),
  };
};

const sampleContract = (clientName = "Brightline Creative"): ContractTerms => {
  const s = addDays(today(), 3);
  const e = addDays(s, 90);
  return {
    clientName,
    startDate: isoDate(s),
    endDate: isoDate(e),
    scope: [
      "Kickoff & onboarding",
      "Technical integration",
      "Monthly performance reports",
      "Quarterly strategic review",
    ],
    billingCadence: "Monthly",
    value: 18000,
  };
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/* generate tasks based on package and kickoff */
const generateTasks = (
  pkg: PackageTier,
  kickoff: KickoffTarget,
  contract: ContractTerms | null,
  clientStart: string
): Task[] => {
  const baseDate = new Date(clientStart);
  // number of tasks by package
  const counts = { Starter: 6, Growth: 10, Premium: 16 };
  const total = counts[pkg];
  const titlesStarter = [
    "Welcome call & agenda",
    "Collect branding assets",
    "Set up project board",
    "Create client portal space",
    "Send contract summary",
    "Schedule kickoff meeting",
  ];
  const titlesGrowth = [
    ...titlesStarter,
    "Define success metrics",
    "Create onboarding checklist",
    "Integrate billing & invoicing",
    "Assign primary owners",
  ];
  const titlesPremium = [
    ...titlesGrowth,
    "Data migration plan",
    "Configure automated reporting",
    "Setup single sign-on (SSO)",
    "Run technical validation",
    "Prepare kickoff presentation",
    "Stakeholder alignment session",
  ];

  const pool = pkg === "Starter" ? titlesStarter : pkg === "Growth" ? titlesGrowth : titlesPremium;
  const chosen = pool.slice(0, total);

  // kickoff speed affects due offsets
  const kickoffOffset = kickoff === "ASAP" ? 2 : kickoff === "7 days" ? 7 : 14;
  // premium compresses times further (faster)
  const packageCompression = pkg === "Premium" ? 0.7 : pkg === "Starter" ? 1.2 : 1.0;

  const tasks: Task[] = chosen.map((t, idx) => {
    const daysOffset = Math.round((idx + 1) * (kickoffOffset / 2) * packageCompression);
    const due = addDays(baseDate, clamp(daysOffset, 1, 30));
    const status: TaskStatus = idx === 0 ? "In Progress" : idx < 2 ? "Not Started" : "Not Started";
    return {
      id: uid("task_"),
      title: t,
      status,
      dueDate: isoDate(due),
      dependencyIds: idx > 0 ? [/* will assign later deterministically */] : undefined,
    };
  });

  // create simple deterministic dependencies: each depends on previous for items beyond first
  for (let i = 1; i < tasks.length; i++) tasks[i].dependencyIds = [tasks[i - 1].id];

  return tasks;
};

const assignOwners = (tasks: Task[], owners: Owner[]): Task[] => {
  if (!owners || owners.length === 0) return tasks;
  // round-robin assign owners
  return tasks.map((task, i) => {
    const owner = owners[i % owners.length];
    if (!owner) return task;
    return {
      ...task,
      ownerId: owner.id,
      ownerName: owner.name,
      ownerRole: owner.role,
    };
  });
};

const scheduleStatusEmail = (client: ClientProfile | null, week = 1): StatusReport => {
  const date = addDays(today(), week * 7);
  const greeting = `Hello ${client?.contactName ?? "Team"},`;
  return {
    week,
    date: isoDate(date),
    greeting,
    completed: [],
    upcoming: [],
    blockers: [],
    nextSteps: ["Review completed tasks", "Confirm next milestones", "Share questions before Friday review"],
  };
};

/* ===========================
   Small UI helpers
   =========================== */

const HeroMetric: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <Card className="p-3 bg-gradient-to-br from-slate-800/70 to-slate-900/60 border border-slate-700">
    <div className="flex flex-col">
      <div className="text-sm text-slate-300">{subtitle}</div>
      <div className="mt-2 text-lg font-semibold text-white">{title}</div>
    </div>
  </Card>
);

/* ===========================
   Main Component
   =========================== */

export default function ClientSuccessEngineDemo() {
  /* Wizard / Inputs */
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [contractTerms, setContractTerms] = useState<ContractTerms | null>(null);

  const [config, setConfig] = useState<EngineConfig>({
    provisionAsana: true,
    provisionDocuSign: true,
    provisionPortal: true,
    provisionEmails: true,
    packageTier: "Growth",
    kickoffTarget: "7 days",
  });

  /* generated runtime */
  const [owners, setOwners] = useState<Owner[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [stageIndex, setStageIndex] = useState<number>(-1);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);

  /* progress stages */
  const stages = [
    "Reading contract and extracting details…",
    "Creating project board with template tasks…",
    "Assigning owners and due dates based on scope…",
    "Provisioning client portal…",
    "Scheduling weekly status report…",
  ];

  /* Recompute owners/tasks when client, contract, or config changes (but not while running) */
  useEffect(() => {
    if (!clientProfile) return;
    const pool = OWNER_POOLS[config.packageTier];
    setOwners(pool);
    const generated = generateTasks(config.packageTier, config.kickoffTarget, contractTerms, clientProfile.startDate);
    const assigned = assignOwners(generated, pool);
    setTasks(assigned);
    // recompute launched flag if config changes mid-run
    setIsLaunched(false);
  }, [clientProfile, contractTerms, config.packageTier, config.kickoffTarget]);

  /* Engine simulation */
  const resetEngine = React.useCallback(() => {
    setIsRunning(false);
    setStageIndex(-1);
    setLogLines([]);
    setIsLaunched(false);
    setOwners([]);
    setTasks([]);
    setShowTable(false);
    // do not clear client/contract unless full reset requested
  }, []);

  useEffect(() => {
    let timeouts: number[] = [];
    if (!isRunning) return;
    setLogLines([]);
    setStageIndex(-1);
    const baseDelay = 500;
    stages.forEach((stage, i) => {
      const delay = baseDelay + i * 600 + (i % 2 === 0 ? 120 : 0);
      const t = window.setTimeout(() => {
        setStageIndex(i);
        setLogLines((s) => [...s, `• ${stage}`]);
        // at certain stages, update tasks or owners to reflect progress
        if (i === 1) {
          // mark first task in progress
          setTasks((prev) => prev.map((t0, idx) => (idx === 0 ? { ...t0, status: "In Progress" } : t0)));
        }
        if (i === 2) {
          setTasks((prev) =>
            prev.map((t0, idx) =>
              idx > 0 && idx <= Math.max(1, Math.floor(prev.length * 0.25)) ? { ...t0, status: "Not Started" } : t0
            )
          );
        }
        if (i === stages.length - 1) {
          // finish after last stage
          setTimeout(() => {
            setIsRunning(false);
            setIsLaunched(true);
            setStageIndex(stages.length);
          }, 400);
        }
      }, delay + 200 * i);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  /* Launch handler */
  const canLaunch = !!clientProfile && !!contractTerms && !isRunning;
  const handleLaunch = () => {
    if (!canLaunch) return;
    // ensure owners/tasks up-to-date
    const pool = OWNER_POOLS[config.packageTier];
    setOwners(pool);
    const generated = generateTasks(config.packageTier, config.kickoffTarget, contractTerms, clientProfile!.startDate);
    const assigned = assignOwners(generated, pool);
    setTasks(assigned);
    setIsRunning(true);
    setStageIndex(0);
    setLogLines([`• Launch started for ${clientProfile?.companyName}`]);
    setIsLaunched(false);
    // move to stage progression handled by effect
  };

  /* reset full demo */
  const resetFull = () => {
    setWizardStep(1);
    setClientProfile(null);
    setContractTerms(null);
    setConfig({
      provisionAsana: true,
      provisionDocuSign: true,
      provisionPortal: true,
      provisionEmails: true,
      packageTier: "Growth",
      kickoffTarget: "7 days",
    });
    resetEngine();
  };

  /* sample injection helpers */
  const useSampleData = (pkg?: PackageTier) => {
    const p = pkg ?? config.packageTier;
    const sample = sampleClient(p);
    setClientProfile(sample);
  };

  const useSampleContract = (clientName?: string) => {
    const c = sampleContract(clientName ?? clientProfile?.companyName ?? "Brightline Creative");
    setContractTerms(c);
  };

  /* Derived values */
  const projectSummary = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    return { total, done, inProgress };
  }, [tasks]);

  const weeklyReport = useMemo(() => {
    return scheduleStatusEmail(clientProfile, 1);
  }, [clientProfile]);

  const riskIndicator = useMemo(() => {
    if (config.kickoffTarget === "ASAP" && tasks.length > 10) return "High";
    if (config.kickoffTarget === "ASAP" && tasks.length > 6) return "Medium";
    return "Low";
  }, [config.kickoffTarget, tasks.length]);

  /* simple handlers to toggle task status */
  const advanceTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: t.status === "Not Started" ? "In Progress" : t.status === "In Progress" ? "Done" : "Done" } : t
      )
    );
  };

  /* layout */
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-slate-100">
      {/* Hero / Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Client Success Engine</h1>
          <p className="text-slate-300 max-w-xl">
            From signed contract to kickoff in minutes. See tasks, owners, client portal, and weekly status—auto-generated.
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge className="bg-slate-700 text-slate-200">Agencies</Badge>
            <Badge className="bg-slate-700 text-slate-200">Consulting</Badge>
            <Badge className="bg-slate-700 text-slate-200">Legal</Badge>
            <Badge className="bg-slate-700 text-slate-200">Accounting</Badge>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="grid grid-cols-3 gap-3">
            <HeroMetric title="85% Faster Onboarding" subtitle="Reduce time to value" />
            <HeroMetric title="< 10 min to Kickoff" subtitle="Automated setup & scheduling" />
            <HeroMetric title="Weekly Status: 100% On-Time" subtitle="Consistent, scheduled updates" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Wizard */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-slate-800 border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm text-slate-300">Onboarding Wizard</div>
                <div className="text-lg font-semibold">Step {wizardStep} of 4</div>
              </div>
              <div className="text-sm text-slate-400">Kickoff target: {config.kickoffTarget}</div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {wizardStep === 1 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <Label>Client Intake</Label>
                  <div className="mt-2 space-y-3">
                    <Input
                      value={clientProfile?.companyName ?? ""}
                      placeholder="Company Name"
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientProfile((p) => ({ ...(p ?? sampleClient()), companyName: e.target.value } as ClientProfile))}
                    />
                    <Input
                      value={clientProfile?.contactName ?? ""}
                      placeholder="Primary Contact Name"
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientProfile((p) => ({ ...(p ?? sampleClient()), contactName: e.target.value } as ClientProfile))}
                    />
                    <Input
                      value={clientProfile?.contactEmail ?? ""}
                      placeholder="Primary Contact Email"
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientProfile((p) => ({ ...(p ?? sampleClient()), contactEmail: e.target.value } as ClientProfile))}
                    />
                    <div className="flex gap-2">
                      <Input
                        value={clientProfile?.contactPhone ?? ""}
                        placeholder="Phone"
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientProfile((p) => ({ ...(p ?? sampleClient()), contactPhone: e.target.value } as ClientProfile))}
                      />
                      <select
                        value={clientProfile?.servicePackage ?? config.packageTier}
onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const pkg = e.target.value as PackageTier;
                          setConfig((c) => ({ ...c, packageTier: pkg }));
                          setClientProfile((p) => ({ ...(p ?? sampleClient(pkg)), servicePackage: pkg } as ClientProfile));
                        }}
                        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
                      >
                        <option>Starter</option>
                        <option>Growth</option>
                        <option>Premium</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={clientProfile ? formatDate(clientProfile.startDate) : ""}
                        placeholder="Start Date"
                        onFocus={() => {
                          // noop - date editing simplified for demo
                        }}
                      />
                      <Button variant="ghost" onClick={() => useSampleData()}>
                        Use Sample Data
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {wizardStep === 2 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <Label>Contract Intake</Label>
                  <div className="mt-2 text-slate-300">Upload signed agreement (client-side parsing)</div>
                  <div className="mt-3">
                    <input
                      id="file-upload"
                      type="file"
                      accept="application/json"
onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          try {
                            const parsed = JSON.parse(String(reader.result));
                            // try to map fields
                            const mapped: ContractTerms = {
                              clientName: parsed.clientName ?? parsed.name ?? clientProfile?.companyName ?? "Client",
                              startDate: parsed.startDate ?? new Date().toISOString(),
                              endDate: parsed.endDate ?? addDays(new Date(), 90).toISOString(),
                              scope: parsed.scope ?? parsed.services ?? ["Kickoff & onboarding"],
                              billingCadence: parsed.billingCadence ?? "Monthly",
                              value: parsed.value ?? 5000,
                            };
                            setContractTerms(mapped);
                          } catch {
                            // ignore parse error
                          }
                        };
                        reader.readAsText(f);
                      }}
                      className="text-slate-200"
                    />
                    <div className="mt-3 flex gap-2">
                      <Button onClick={() => useSampleContract()}>Use Sample Contract</Button>
                      <Button variant="ghost" onClick={() => setContractTerms(null)}>Clear</Button>
                    </div>
                    {contractTerms && (
                      <Card className="mt-4 p-3 bg-slate-900 border border-slate-700">
                        <div className="text-sm text-slate-300">Parsed Contract Preview</div>
                        <div className="mt-2">
                          <div className="font-semibold text-white">{contractTerms.clientName}</div>
                          <div className="text-slate-400 text-sm">
                            {formatDate(contractTerms.startDate)} — {formatDate(contractTerms.endDate)} • {contractTerms.billingCadence}
                          </div>
                          <ul className="mt-2 text-slate-300 text-sm list-disc list-inside">
                            {contractTerms.scope.slice(0, 4).map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                          <div className="mt-2 text-slate-200 font-medium">{formatCurrency(contractTerms.value)} / term</div>
                        </div>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {wizardStep === 3 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <Label>Playbook & Tooling</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
<Checkbox checked={config.provisionAsana} onCheckedChange={(v: boolean | "indeterminate") => setConfig((c) => ({ ...c, provisionAsana: !!v }))} />
                        <div>
                          <div className="text-white">Asana/Monday project board</div>
                          <div className="text-slate-400 text-sm">Create templated tasks and sections</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
<Checkbox checked={config.provisionDocuSign} onCheckedChange={(v: boolean | "indeterminate") => setConfig((c) => ({ ...c, provisionDocuSign: !!v }))} />
                        <div>
                          <div className="text-white">DocuSign profile</div>
                          <div className="text-slate-400 text-sm">Provision signature workflows</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
<Checkbox checked={config.provisionPortal} onCheckedChange={(v: boolean | "indeterminate") => setConfig((c) => ({ ...c, provisionPortal: !!v }))} />
                        <div>
                          <div className="text-white">Client Portal</div>
                          <div className="text-slate-400 text-sm">Shared resources and progress</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
<Checkbox checked={config.provisionEmails} onCheckedChange={(v: boolean | "indeterminate") => setConfig((c) => ({ ...c, provisionEmails: !!v }))} />
                        <div>
                          <div className="text-white">Weekly Status Emails</div>
                          <div className="text-slate-400 text-sm">Automated Friday summaries</div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2" />

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-slate-300 w-28">Package</div>
                        <div className="flex gap-2">
                          <Button variant={config.packageTier === "Starter" ? "default" : "ghost"} onClick={() => setConfig((c) => ({ ...c, packageTier: "Starter" }))}>
                            Starter
                          </Button>
                          <Button variant={config.packageTier === "Growth" ? "default" : "ghost"} onClick={() => setConfig((c) => ({ ...c, packageTier: "Growth" }))}>
                            Growth
                          </Button>
                          <Button variant={config.packageTier === "Premium" ? "default" : "ghost"} onClick={() => setConfig((c) => ({ ...c, packageTier: "Premium" }))}>
                            Premium
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="text-sm text-slate-300 w-28">Kickoff Target</div>
                        <div className="flex gap-2">
                          <Button variant={config.kickoffTarget === "ASAP" ? "default" : "ghost"} onClick={() => setConfig((c) => ({ ...c, kickoffTarget: "ASAP" }))}>
                            ASAP
                          </Button>
                          <Button variant={config.kickoffTarget === "7 days" ? "default" : "ghost"} onClick={() => setConfig((c) => ({ ...c, kickoffTarget: "7 days" }))}>
                            7 days
                          </Button>
                          <Button variant={config.kickoffTarget === "14 days" ? "default" : "ghost"} onClick={() => setConfig((c) => ({ ...c, kickoffTarget: "14 days" }))}>
                            14 days
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 text-sm">
                        <div className="text-slate-400">Risk: <span className={riskIndicator === "High" ? "text-amber-400" : riskIndicator === "Medium" ? "text-amber-300" : "text-emerald-300"}>{riskIndicator}</span></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {wizardStep === 4 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <Label>Review & Launch</Label>
                  <div className="mt-2 space-y-2">
                    <div className="text-slate-300">Summary</div>
                    <Card className="p-3 bg-slate-900 border border-slate-700">
                      <div className="text-white font-semibold">{clientProfile?.companyName ?? "—"}</div>
                      <div className="text-slate-400 text-sm">{clientProfile?.contactName ?? "—"} • {clientProfile?.contactEmail ?? "—"}</div>
                      <div className="mt-2 text-slate-300 text-sm">
                        Service package: <span className="font-medium text-white">{config.packageTier}</span> • Kickoff target: <span className="font-medium text-white">{config.kickoffTarget}</span>
                      </div>
                      <div className="mt-2 text-slate-300 text-sm">
                        Contract: {contractTerms ? `${formatDate(contractTerms.startDate)} – ${formatDate(contractTerms.endDate)}` : "None"}
                      </div>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {config.provisionAsana && <Badge>Project Board</Badge>}
                        {config.provisionDocuSign && <Badge>DocuSign</Badge>}
                        {config.provisionPortal && <Badge>Client Portal</Badge>}
                        {config.provisionEmails && <Badge>Weekly Emails</Badge>}
                      </div>
                    </Card>

                    <div className="flex gap-2">
                      <Button onClick={handleLaunch} disabled={!canLaunch || isRunning}>
                        Launch Client Setup
                      </Button>
                      <Button variant="ghost" onClick={() => setWizardStep((s) => Math.max(1, s - 1))}>Back</Button>
                      <Button variant="link" onClick={() => resetFull()}>Reset Demo</Button>
                    </div>
                    {!clientProfile || !contractTerms ? (
                      <div className="text-amber-300 text-sm">Complete client intake and contract or use sample buttons to proceed.</div>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-slate-400 text-sm">Progress</div>
              <div className="flex gap-2">
                {wizardStep > 1 && <Button variant="ghost" onClick={() => setWizardStep((s) => s - 1)}>Prev</Button>}
                {wizardStep < 4 && <Button onClick={() => setWizardStep((s) => s + 1)}>Continue</Button>}
              </div>
            </div>
          </Card>

          {/* Engine run & logs */}
          <Card className="p-3 bg-slate-800 border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-sm text-slate-300">Automation Run</div>
                <div className="font-medium text-white">{isRunning ? "Running" : isLaunched ? "Completed" : "Idle"}</div>
              </div>
              <div className="text-slate-400 text-sm">{logLines.length} steps</div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                {stages.map((s, i) => {
                  const done = i < stageIndex || (isLaunched && i <= stages.length - 1);
                  const active = i === stageIndex && isRunning;
                  return (
                    <div key={i} className={`flex items-center justify-between p-2 rounded ${done ? "bg-slate-900" : "bg-slate-800"} border border-slate-700`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700">
                          <AnimatePresence>
                            {done ? (
                              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-300 font-semibold">
                                ✓
                              </motion.span>
                            ) : active ? (
                              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-slate-300">⏳</motion.span>
                            ) : (
                              <span className="text-slate-400">•</span>
                            )}
                          </AnimatePresence>
                        </div>
                        <div>
                          <div className="text-white">{s}</div>
                          <div className="text-slate-400 text-sm">{done ? "Completed" : active ? "In progress" : "Pending"}</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">{done ? "Done" : ""}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 text-sm text-slate-300">
                <div className="font-medium">Run log</div>
                <div className="mt-1">
                  {logLines.slice(-6).map((l, i) => (
                    <div key={i} className="text-slate-400 text-xs">{l}</div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button onClick={handleLaunch} disabled={!canLaunch || isRunning}>
                  {isRunning ? "Running…" : "Run Engine"}
                </Button>
                <Button variant="ghost" onClick={() => resetEngine()}>Reset Run</Button>
                <Button variant="link" onClick={() => { useSampleData(); useSampleContract(); setWizardStep(4); }}>Quick Start</Button>
              </div>
            </div>
          </Card>

          <div className="hidden lg:block">
            <Card className="p-3 bg-slate-800 border border-slate-700">
              <div className="text-slate-300 text-sm">Configuration Summary</div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Badge>Package: {config.packageTier}</Badge>
                <Badge>Kickoff: {config.kickoffTarget}</Badge>
                {config.provisionAsana && <Badge>Project Board</Badge>}
                {config.provisionPortal && <Badge>Client Portal</Badge>}
                {config.provisionEmails && <Badge>Weekly Emails</Badge>}
              </div>
            </Card>
          </div>
        </div>

        {/* Right column: Outputs */}
        <div className="lg:col-span-2 space-y-4">
          {/* Project Plan + Kanban */}
          <Card className="p-4 bg-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-slate-300">Project Plan</div>
                <div className="text-xl font-semibold">Onboarding Tasks</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-slate-400 text-sm mr-2">View</div>
                <Button variant={showTable ? "ghost" : "default"} onClick={() => setShowTable(false)}>Kanban</Button>
                <Button variant={showTable ? "default" : "ghost"} onClick={() => setShowTable(true)}>Table</Button>
              </div>
            </div>

            {!showTable ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["Not Started", "In Progress", "Done"] as TaskStatus[]).map((col) => (
                  <div key={col} className="bg-slate-900 p-3 rounded border border-slate-700">
                    <div className="text-sm text-slate-300 mb-2 font-medium">{col}</div>
                    <div className="space-y-2">
                      {tasks.filter((t) => t.status === col).map((t) => (
                        <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-2 bg-slate-800 rounded border border-slate-700">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="font-medium text-white">{t.title}</div>
                              <div className="text-slate-400 text-xs">{t.ownerName} • {t.ownerRole}</div>
                              <div className="text-slate-400 text-xs mt-1">Due {formatDate(t.dueDate)}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => advanceTask(t.id)}>Advance</Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {tasks.filter((t) => t.status === col).length === 0 && (
                        <div className="text-slate-500 text-sm">No tasks</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-sm">
                      <th className="p-2">Task</th>
                      <th className="p-2">Owner</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Due</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t.id} className="border-t border-slate-700">
                        <td className="p-2 text-white">{t.title}</td>
                        <td className="p-2 text-slate-300">{t.ownerName}</td>
                        <td className="p-2 text-slate-300">{t.ownerRole}</td>
                        <td className="p-2 text-slate-300">{t.status}</td>
                        <td className="p-2 text-slate-300">{formatDate(t.dueDate)}</td>
                        <td className="p-2">
                          <Button size="sm" variant="ghost" onClick={() => advanceTask(t.id)}>Advance</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Client Portal + Status Report + Config Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-slate-800 border border-slate-700">
              <div className="text-sm text-slate-300">Client Portal Preview</div>
              <div className="mt-2">
                <div className="text-white font-semibold">Welcome, {clientProfile?.contactName ?? "Client"}.</div>
                <div className="text-slate-400 text-sm mt-1">Portal Access: <span className="text-emerald-300">Enabled</span> • Last updated just now</div>
                <ul className="mt-3 space-y-2 text-slate-300">
                  <li><a className="text-slate-100 underline">Onboarding Guide</a></li>
                  <li><a className="text-slate-100 underline">Kickoff Agenda</a></li>
                  <li><a className="text-slate-100 underline">FAQs</a></li>
                  <li><a className="text-slate-100 underline">Billing & Invoices</a></li>
                  <li><a className="text-slate-100 underline">Support</a></li>
                </ul>
              </div>
            </Card>

            <Card className="p-4 bg-slate-800 border border-slate-700">
              <div className="text-sm text-slate-300">Weekly Status Report</div>
              <div className="mt-2">
                <div className="text-white font-semibold">Week 1 Status for {clientProfile?.companyName ?? "Client"}</div>
                <div className="text-slate-300 text-sm mt-2">
                  {weeklyReport.greeting}
                </div>
                <div className="mt-3 text-slate-300 text-sm">
                  <div className="font-medium">Completed</div>
                  <ul className="list-disc list-inside text-slate-300">
                    {tasks.filter(t => t.status === "Done").slice(0,3).map(t => <li key={t.id}>{t.title}</li>)}
                    {tasks.filter(t => t.status === "Done").length === 0 && <li>No completed tasks yet</li>}
                  </ul>
                </div>
                <div className="mt-3 text-slate-300 text-sm">
                  <div className="font-medium">Upcoming</div>
                  <ul className="list-disc list-inside text-slate-300">
                    {tasks.filter(t => t.status !== "Done").slice(0,3).map(t => <li key={t.id}>{t.title} — Due {formatDate(t.dueDate)}</li>)}
                  </ul>
                </div>
                <div className="mt-3 text-slate-300 text-sm italic">Will send automatically every Friday 9am</div>
              </div>
            </Card>

            <Card className="p-4 bg-slate-800 border border-slate-700">
              <div className="text-sm text-slate-300">Configuration Summary</div>
              <div className="mt-2 text-white font-medium">{clientProfile?.companyName ?? "—"}</div>
              <div className="mt-2 text-slate-300 text-sm">
                Package: {config.packageTier}<br />
                Kickoff target: {config.kickoffTarget}<br />
                Billing: {contractTerms?.billingCadence ?? "—"} • {contractTerms ? formatCurrency(contractTerms.value) : "—"}
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {config.provisionAsana && <Badge>Asana/Monday</Badge>}
                {config.provisionDocuSign && <Badge>DocuSign</Badge>}
                {config.provisionPortal && <Badge>Client Portal</Badge>}
                {config.provisionEmails && <Badge>Weekly Emails</Badge>}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky CTA footer */}
      <div className="fixed left-0 right-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent backdrop-blur p-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-white font-semibold">Ready to launch this experience for your clients?</div>
              <div className="text-slate-300 text-sm">Automate onboarding, status reports, and portal access in minutes.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="/pricing" className="text-slate-300 hover:underline">See Pricing & Options</a>
            <a href="/contact">
              <Button>Build My Solution</Button>
            </a>
            <Button variant="ghost" onClick={() => resetFull()}>Reset Demo</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
