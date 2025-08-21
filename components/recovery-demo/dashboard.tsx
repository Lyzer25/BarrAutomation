"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

/**
 * Revenue Recovery Robot - Demo-only interactive dashboard
 *
 * Notes:
 * - This component is intentionally self-contained and uses only local state and dummy data.
 * - NO network requests, NO real emails/SMS, and NO Shopify integration occur here.
 * - In production, integrations (Shopify webhooks, SendGrid/Twilio, AI provider) would be wired
 *   where the comments below mark "PRODUCTION INTEGRATION".
 *
 * File: components/recovery-demo/dashboard.tsx
 *
 * Accessibility:
 * - Modal uses role="dialog" and basic focus management.
 * - Buttons and inputs include accessible labels.
 *
 * This file implements:
 * - Recharts-based charts (donut + sparkline)
 * - Abandoned cart simulator table
 * - AI response modal with multiple scripted variations interpolating customer/cart fields
 * - Customer history editable fields which update AI message content in real time
 */

/* -----------------------------
   Dummy data models (local-only)
   ----------------------------- */
type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type DummyCart = {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  abandonedMinutesAgo: number;
  triggers: string[]; // e.g. ["exit-intent", "idle-60s", "high-value", "coupon-error"]
  recovered?: boolean;
  recoveredAmount?: number;
  recoveryProbability?: number;
};

type DummyCustomer = {
  id: string;
  name: string;
  email: string;
  aov: number;
  lifetimeValue: number;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  notes?: string;
  orders: { id: string; total: number; date: string }[];
};

/* Seed some dummy customers and carts */
const seedCustomers: DummyCustomer[] = [
  {
    id: "c1",
    name: "Olivia Hart",
    email: "olivia@example.com",
    aov: 85,
    lifetimeValue: 520,
    loyaltyTier: "Silver",
    notes: "Prefers free shipping, responded to 10% off previously.",
    orders: [
      { id: "o100", total: 72.5, date: "2024-11-09" },
      { id: "o212", total: 45.0, date: "2025-02-02" },
    ],
  },
  {
    id: "c2",
    name: "Marcus Lee",
    email: "marcus@example.com",
    aov: 210,
    lifetimeValue: 1940,
    loyaltyTier: "Gold",
    notes: "High LTV customer; offer minor discount + free expedited shipping.",
    orders: [{ id: "o501", total: 230.0, date: "2025-06-22" }],
  },
  {
    id: "c3",
    name: "Priya Sharma",
    email: "priya@example.com",
    aov: 45,
    lifetimeValue: 120,
    loyaltyTier: "Bronze",
    notes: "New customer; hesitant about returns policy.",
    orders: [{ id: "o321", total: 45.0, date: "2025-07-10" }],
  },
  {
    id: "c4",
    name: "Ethan Park",
    email: "ethan@example.com",
    aov: 140,
    lifetimeValue: 880,
    loyaltyTier: "Silver",
    notes: "Usually buys bundles; respond well to limited-time coupons.",
    orders: [{ id: "o411", total: 140.0, date: "2025-05-18" }],
  },
];

const seedCarts: DummyCart[] = [
  {
    id: "cart-1",
    customerId: "c1",
    items: [
      { id: "p1", name: "Bamboo Tumbler (20oz)", price: 24.99, qty: 1 },
      { id: "p2", name: "Eco Tote Bag", price: 19.0, qty: 2 },
    ],
    total: 62.99,
    abandonedMinutesAgo: 3,
    triggers: ["idle-60s"],
  },
  {
    id: "cart-2",
    customerId: "c2",
    items: [
      { id: "p10", name: "Premium Leather Wallet", price: 129.99, qty: 1 },
      { id: "p11", name: "Gift Box", price: 9.99, qty: 1 },
    ],
    total: 139.98,
    abandonedMinutesAgo: 12,
    triggers: ["exit-intent", "high-value"],
  },
  {
    id: "cart-3",
    customerId: "c3",
    items: [{ id: "p20", name: "Organic Face Serum", price: 44.0, qty: 1 }],
    total: 44.0,
    abandonedMinutesAgo: 1,
    triggers: ["coupon-error"],
  },
  {
    id: "cart-4",
    customerId: "c4",
    items: [
      { id: "p30", name: "Running Shoes - Size 10", price: 119.0, qty: 1 },
      { id: "p31", name: "Performance Socks (3-pack)", price: 19.0, qty: 1 },
    ],
    total: 138.0,
    abandonedMinutesAgo: 25,
    triggers: ["idle-60s", "high-value"],
  },
];

/* -------------------------
   Small utility functions
   ------------------------- */
const currency = (n: number) => `$${n.toFixed(2)}`;

const joinItemNames = (items: CartItem[]) =>
  items.map((i) => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ""}`).join(", ");

/* -------------------------
   Small Accessible Modal
   ------------------------- */
function useLockBodyScroll(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
}

function Dialog({
  title,
  open,
  onClose,
  children,
}: {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const el = ref.current?.querySelector<HTMLElement>(
      "button, [href], input, textarea, [tabindex]:not([tabindex='-1'])"
    );
    el?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div ref={ref} className="relative z-10 max-w-3xl w-full bg-black border border-white/10 rounded-lg p-6">
        {title && (
          <h3 id="dialog-title" className="font-mono font-bold text-xl text-white mb-3">
            {title}
          </h3>
        )}
        <div>{children}</div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Charts (Recharts)
   ------------------------- */

function Donut({ percentRecovered }: { percentRecovered: number }) {
  const abandonPercent = 70; // baseline visual
  const recovered = Math.max(0, Math.min(100, Math.round(percentRecovered)));
  const remaining = Math.max(0, abandonPercent - recovered);
  const data = [
    { name: "Recovered", value: recovered },
    { name: "Remaining", value: remaining },
  ];
  const COLORS = ["#7c3aed", "#374151"];

  return (
    <div style={{ width: 120, height: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={36} outerRadius={54} startAngle={90} endAngle={-270}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  // Build datapoints with small labels
  const data = points.map((v, i) => ({ x: `T${i + 1}`, y: v }));
  return (
    <div style={{ width: "100%", height: 70 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="x" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <RechartsTooltip formatter={(value: any) => currency(value)} />
          <Area dataKey="y" stroke="none" fill="rgba(52,211,153,0.08)" />
          <Line type="monotone" dataKey="y" stroke="#34d399" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* -------------------------
   AI script generation + variations
   ------------------------- */

/**
 * generateAiScript
 * - Produces a scripted conversation (array of message objects) for the AI modal.
 * - Messages use interpolation from cart and customer fields.
 * - Multiple variation strategies are supported; we pick one based on customer/cart state
 *   and a random seed so repeated previews show different messages.
 *
 * Note: In production the AI provider would generate content; this function simulates that.
 */
function generateAiScript(cart: DummyCart, customer: DummyCustomer | null, settings: any, variationSeed = 0) {
  const name = customer?.name ?? "there";
  const tier = customer?.loyaltyTier ?? "Customer";
  const aov = customer?.aov ?? 0;
  const items = joinItemNames(cart.items);
  const total = currency(cart.total);

  // variation index can be 0..2 to choose different tone/offers
  const idx = variationSeed % 3;

  // pick likely friction reason
  const friction =
    cart.triggers.includes("coupon-error")
      ? "a coupon error at checkout"
      : cart.triggers.includes("high-value")
      ? "concern about shipping or added costs"
      : cart.triggers.includes("exit-intent")
      ? "you looked like you were leaving"
      : "an idle session";

  // dynamic incentive determination
  let incentive = { label: "10% off + free shipping", code: "RECOVER10", percent: 10 };
  if (tier === "Gold" || aov > 150) {
    incentive = { label: "15% off + free expedited shipping", code: "VIP15", percent: 15 };
  } else if (cart.total >= 100) {
    incentive = { label: "12% off + free shipping", code: "SAVE12", percent: 12 };
  } else if (cart.triggers.includes("coupon-error")) {
    incentive = { label: "free shipping", code: "FREESHIP", percent: 0 };
  }

  const commonIntro = `Hi ${name} — I noticed you left ${items} in your cart (${total}).`;

  const variations = [
    // Variation 0: helpful, diagnostic -> offer
    [
      { actor: "bot", text: commonIntro },
      { actor: "bot", text: `It looks like we detected ${friction}. Can I help fix that?` },
      { actor: "bot", text: `Here's a personalized offer: use code ${incentive.code} for ${incentive.label}. This is valid for the next 2 hours.` },
      { actor: "bot", text: `If you'd like, I can apply the coupon for you and reserve the items.` },
    ],
    // Variation 1: urgency + social proof
    [
      { actor: "bot", text: `Quick note — items in your cart have a limited stock.` },
      { actor: "bot", text: commonIntro },
      { actor: "bot", text: `Because you're a ${tier} customer, here's ${incentive.label} with code ${incentive.code}.` },
      { actor: "bot", text: `Customers who accept typically complete checkout 72% faster.` },
    ],
    // Variation 2: empathy + reassurance (security/trust)
    [
      { actor: "bot", text: `Hey ${name}, I can help if there were any concerns about security or checkout.` },
      { actor: "bot", text: commonIntro },
      { actor: "bot", text: `We can also reserve your cart and hold it for 30 minutes. Use ${incentive.code} for ${incentive.label}.` },
      { actor: "bot", text: `If payment failed, reply 'HELP' and we'll walk you through secure options.` },
    ],
  ];

  // Add a final "outcome" message that simulates conversion probability
  const recoveryChance = cart.recoveryProbability ?? Math.min(90, 20 + (variationSeed % 50));
  const outcome = recoveryChance > 50 ? { actor: "system", text: `Recovered! Estimated recovered amount ${currency(Math.round(cart.total * (0.6 + Math.random() * 0.4)))}` } : { actor: "system", text: `Not recovered (simulation)` };

  const script = variations[idx].concat([outcome]);
  return { script, incentive, recoveryChance };
}

/* -------------------------
   Main Demo Component
   ------------------------- */
export default function RevenueRecoveryDemo() {
  // demo state
  const [customers, setCustomers] = useState<DummyCustomer[]>(seedCustomers);
  const [carts, setCarts] = useState<DummyCart[]>(seedCarts);
  const [selectedCart, setSelectedCart] = useState<DummyCart | null>(null);
  const [inspectedCustomer, setInspectedCustomer] = useState<DummyCustomer | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [variationSeed, setVariationSeed] = useState(0);

  const [settings, setSettings] = useState({
    idleThresholdSeconds: 60,
    exitIntentSensitivity: 0.7,
    minCartValueForIncentive: 100,
  });

  // analytics controls
  const [recoveryRate, setRecoveryRate] = useState(20); // percent recovered (simulated)
  const [aovLiftPercent, setAovLiftPercent] = useState(12); // percent lift

  const { toast } = useToast();

  // computed analytics: Recovered revenue over last 8 periods (months)
  const baseMonthlyRevenue = [12000, 11500, 12800, 13000, 12500, 14000, 13800, 14500];
  const recoveredMonthly = useMemo(
    () => baseMonthlyRevenue.map((m) => Math.round(m * (recoveryRate / 100))),
    [baseMonthlyRevenue, recoveryRate]
  );

  // helper: get customer for a cart
  const getCustomerForCart = (cart: DummyCart) => customers.find((c) => c.id === cart.customerId) ?? null;

  // helper: open AI modal with a specific cart
  function previewAiResponse(cart: DummyCart) {
    setSelectedCart(cart);
    const cust = getCustomerForCart(cart);
    setInspectedCustomer(cust);
    // bump variation seed so repeated opens rotate variations
    setVariationSeed((s) => s + 1);
    setAiModalOpen(true);
  }

  // simulate "recover" action (demo only)
  function simulateRecover(cartId: string) {
    setCarts((prev) =>
      prev.map((c) =>
        c.id === cartId
          ? {
              ...c,
              recovered: true,
              recoveredAmount: Math.round(c.total * (0.6 + Math.random() * 0.4)), // simulate partial/full recovery
            }
          : c
      )
    );
    toast({
      title: "Recovered (simulation only)",
      description: "This action is a simulation and no real messages were sent.",
    });
    setAiModalOpen(false);
  }

  // handle a "Send Test Message" click in Campaign Builder
  function handleSendTestMessage() {
    toast({
      title: "Message sent (simulation only)",
      description: "This was a simulated test message. No external APIs were called.",
    });
  }

  // When settings change, update derived recoveryProbability on carts (local only)
  useEffect(() => {
    setCarts((prev) =>
      prev.map((c) => {
        const base = c.triggers.includes("high-value") ? 60 : 30;
        const modifier = c.total >= settings.minCartValueForIncentive ? 1.15 : 0.95;
        const recoveryProbability = Math.min(95, Math.round(base * modifier * (recoveryRate / 20)));
        return { ...c, recoveryProbability };
      })
    );
  }, [settings, recoveryRate]);

  // allow editing customer fields within the demo and reflect in global customers array
  useEffect(() => {
    if (!inspectedCustomer) return;
    setCustomers((prev) => prev.map((c) => (c.id === inspectedCustomer.id ? inspectedCustomer : c)));
  }, [inspectedCustomer]);

  /* -------------------------
     UI rendering
     ------------------------- */

  return (
    <div className="space-y-8 p-6">
      {/* HERO */}
      <section className="relative bg-gradient-to-r from-slate-900 to-black rounded-xl p-8 border border-white/6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-white">Recover Your Lost Revenue</h1>
            <p className="text-subtle-gray mt-2 max-w-2xl">
              AI-driven, proactive cart recovery that detects exit-intent, idle sessions, and high-value carts — and
              engages shoppers with tailored incentives. Simulated demo only; no live data or messages are sent.
            </p>
            <div className="mt-4 flex gap-3">
              <Button
                onClick={() =>
                  toast({
                    title: "Start Your Free Trial (simulation only)",
                    description: "This CTA is a demo and does not start a real trial.",
                  })
                }
              >
                Start Your Free Trial
              </Button>
              <Button variant="ghost" onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}>
                See Simulator
              </Button>
            </div>
            <p className="mt-3 text-xs text-gray-400 font-mono">Demo only — no real stores or messages are used.</p>
          </div>

          <div className="hidden md:flex flex-col items-end">
            {/* simple illustrative card */}
            <div className="bg-white/5 border border-white/6 rounded-lg p-4 w-80">
              <p className="text-white font-mono font-semibold">Simulated Impact</p>
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">{recoveryRate}%</p>
                  <p className="text-xs text-gray-400">Recovery rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{aovLiftPercent}%</p>
                  <p className="text-xs text-gray-400">AOV lift</p>
                </div>
              </div>
              <p className="text-xs mt-3 text-gray-400">Typical cart abandonment ~70% — proactive engagement can recover 15–25%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Simulator + Customer Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Abandoned Cart Simulator */}
          <section id="simulator" className="bg-black/40 border border-white/6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-lg text-white">Abandoned Cart Simulator</h2>
              <Badge className="font-mono">Demo only</Badge>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Items</th>
                    <th className="py-2 px-3">Value</th>
                    <th className="py-2 px-3">Abandoned</th>
                    <th className="py-2 px-3">Triggers</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((cart) => {
                    const cust = getCustomerForCart(cart);
                    return (
                      <tr key={cart.id} className="border-t border-white/6">
                        <td className="py-3 px-3">
                          <div className="font-mono text-white">{cust?.name}</div>
                          <div className="text-xs text-gray-400">{cust?.email}</div>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <div className="text-sm text-white text-clamp-1">{joinItemNames(cart.items)}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-white">{currency(cart.total)}</td>
                        <td className="py-3 px-3 text-gray-400">{cart.abandonedMinutesAgo}m</td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2 flex-wrap">
                            {cart.triggers.map((t) => (
                              <Badge key={t} className="font-mono bg-white/5 text-white/90">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => previewAiResponse(cart)}>
                              Preview AI Response
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setInspectedCustomer(getCustomerForCart(cart));
                                window.scrollTo({ top: 600, behavior: "smooth" });
                              }}
                            >
                              Inspect
                            </Button>
                          </div>
                          {cart.recovered && (
                            <div className="mt-2 text-xs text-green-400 font-mono">Recovered: {currency(cart.recoveredAmount ?? 0)}</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Customer History Panel (interactive controls) */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-white">Customer History</h3>
              <p className="text-xs text-gray-400">Edit fields to see AI message change</p>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                {inspectedCustomer ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-mono font-semibold">{inspectedCustomer.name}</div>
                        <div className="text-xs text-gray-400">{inspectedCustomer.email}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Tier: <strong className="text-white font-mono">{inspectedCustomer.loyaltyTier}</strong>
                        </div>
                      </div>
                      <div>
                        <Badge className="font-mono bg-white/6 text-white">LTV ${inspectedCustomer.lifetimeValue}</Badge>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs text-gray-400 font-mono">Average order value (AOV)</label>
                      <Input
                        aria-label="AOV"
                        className="mt-1"
                        value={String(inspectedCustomer.aov)}
                        onChange={(e) => {
                          const val = Number(e.target.value || 0);
                          setInspectedCustomer((prev) => (prev ? { ...prev, aov: val } : prev));
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <label className="text-xs text-gray-400 font-mono">Notes</label>
                      <Textarea
                        aria-label="Customer notes"
                        className="mt-1"
                        value={inspectedCustomer.notes}
                        onChange={(e) => setInspectedCustomer((prev) => (prev ? { ...prev, notes: e.target.value } : prev))}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-sm font-mono">Select a cart and click "Inspect" to view customer history.</div>
                )}
              </div>

              <div className="md:col-span-1 bg-white/2 rounded p-3">
                <div className="text-xs text-gray-400 font-mono">Past orders</div>
                <div className="mt-2 space-y-2">
                  {inspectedCustomer?.orders?.map((o) => (
                    <div key={o.id} className="flex justify-between items-center">
                      <div className="text-sm text-white font-mono">{o.id}</div>
                      <div className="text-xs text-gray-400">{currency(o.total)}</div>
                    </div>
                  )) ?? <div className="text-xs text-gray-500">No orders</div>}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 font-mono">Tip: The robot uses customer history to personalize incentives (e.g., loyalty-based coupons).</p>
          </section>
        </div>

        {/* Right column: Campaign Builder + Analytics + Settings */}
        <aside className="space-y-6">
          {/* Campaign Builder */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-white">Campaign Builder</h3>
              <Badge className="font-mono">Simulated</Badge>
            </div>

            <div className="mt-3">
              <label className="text-xs text-gray-400 font-mono">Message preview</label>
              <Textarea
                aria-label="Campaign message"
                value={
                  selectedCart
                    ? `Hi ${inspectedCustomer?.name ?? "Customer"}, we noticed you left ${joinItemNames(selectedCart.items)} in your cart. Use code RECOVER10 for 10% off or get free shipping today. (Simulation only)`
                    : "Select a cart and click Preview AI Response to generate an AI suggested message."
                }
                onChange={() => {
                  /* user-editable; no external send */
                }}
                className="mt-2"
              />
              <div className="mt-3 flex gap-2">
                <Button onClick={handleSendTestMessage}>Send Test Message</Button>
                <Button variant="outline" onClick={() => toast({ title: "Save (simulation only)", description: "Saved to demo workspace only." })}>
                  Save
                </Button>
              </div>
            </div>
          </section>

          {/* Analytics */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-white">Analytics (simulated)</h3>
              <p className="text-xs text-gray-400">Interactive</p>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4">
                <Donut percentRecovered={recoveryRate} />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-mono text-white">{recoveryRate}%</div>
                    <div className="text-xs text-gray-400">of abandoned carts recovered (simulated)</div>
                  </div>
                  <div className="mt-3">
                    <input
                      aria-label="Recovery rate slider"
                      type="range"
                      min={0}
                      max={40}
                      value={recoveryRate}
                      onChange={(e) => setRecoveryRate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Recovered revenue over recent months</div>
                <div className="mt-2">
                  <Sparkline points={recoveredMonthly} />
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Average Order Value lift</div>
                    <div className="text-xl font-mono text-white">{aovLiftPercent}%</div>
                  </div>
                  <div className="w-40">
                    <input
                      aria-label="AOV lift slider"
                      type="range"
                      min={0}
                      max={30}
                      value={aovLiftPercent}
                      onChange={(e) => setAovLiftPercent(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Interactive: change values to see visual impact. Real installs take ~1 week to integrate.</p>
              </div>
            </div>
          </section>

          {/* Settings & Triggers */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-white">Settings & Triggers</h3>
              <Badge className="font-mono">Local only</Badge>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <div>
                <label className="text-xs text-gray-400 block font-mono">Idle time threshold (seconds)</label>
                <input
                  aria-label="Idle threshold"
                  type="number"
                  value={settings.idleThresholdSeconds}
                  onChange={(e) => setSettings((s) => ({ ...s, idleThresholdSeconds: Number(e.target.value || 0) }))}
                  className="w-full mt-1 p-2 rounded bg-white/3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block font-mono">Exit-intent sensitivity (0-1)</label>
                <input
                  aria-label="Exit intent sensitivity"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.exitIntentSensitivity}
                  onChange={(e) => setSettings((s) => ({ ...s, exitIntentSensitivity: Number(e.target.value) }))}
                  className="w-full mt-1"
                />
                <div className="text-xs text-gray-400 mt-1">Higher is more aggressive at detecting exit intent.</div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block font-mono">Min cart value for incentive</label>
                <input
                  aria-label="Min cart value"
                  type="number"
                  value={settings.minCartValueForIncentive}
                  onChange={(e) => setSettings((s) => ({ ...s, minCartValueForIncentive: Number(e.target.value || 0) }))}
                  className="w-full mt-1 p-2 rounded bg-white/3 text-white"
                />
              </div>
            </div>
          </section>

          {/* Education & Trust */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <h4 className="font-mono text-white">Why shoppers abandon carts</h4>
            <ul className="mt-2 text-sm text-gray-400 space-y-1">
              <li>- Unexpected costs (shipping/taxes)</li>
              <li>- Forced account creation or long forms</li>
              <li>- Trust/security concerns (payment auth)</li>
              <li>- Slow checkout or limited payment options</li>
              <li>- Coupon errors / checkout friction</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">Sources: Industry benchmarks — average abandonment ≈ 70%. (Demo-only citations)</p>
            <div className="mt-3 text-xs text-gray-400">
              <strong>Security & Privacy:</strong> This demo uses no personal data. Production uses secure, encrypted webhooks and tokens.
            </div>
          </section>
        </aside>
      </div>

      {/* AI Response Modal */}
      <Dialog
        title={selectedCart ? `AI Response Preview — ${getCustomerForCart(selectedCart as DummyCart)?.name ?? ""}` : "AI Response Preview"}
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      >
        {selectedCart && (
          <AIResponseView
            cart={selectedCart}
            customer={inspectedCustomer}
            onRecover={() => simulateRecover(selectedCart.id)}
            onSendSim={() => toast({ title: "Send message (simulation only)", description: "No external messages were sent." })}
            seed={variationSeed}
            settings={settings}
          />
        )}
      </Dialog>
    </div>
  );
}

/* -------------------------
   Small child: AIResponseView
   - Renders generated script with variations and interpolation
   ------------------------- */
function AIResponseView({
  cart,
  customer,
  onRecover,
  onSendSim,
  seed,
  settings,
}: {
  cart: DummyCart;
  customer: DummyCustomer | null;
  onRecover: () => void;
  onSendSim: () => void;
  seed: number;
  settings: any;
}) {
  const { script, incentive, recoveryChance } = generateAiScript(cart, customer, settings, seed || 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {script.map((m, i) => (
          <div key={i} className={m.actor === "bot" ? "p-3 rounded bg-white/5" : m.actor === "system" ? "p-3 rounded bg-green-900/30" : "p-3 rounded bg-gray-800"}>
            <div className="text-xs text-gray-400 font-mono">{m.actor === "bot" ? "Bot" : m.actor === "system" ? "System" : "Bot"}</div>
            <div className="mt-1 text-white font-mono">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">Simulated conversion chance: <strong className="text-white font-mono">{recoveryChance}%</strong></div>
        <div className="flex gap-2">
          <Button onClick={onRecover}>Mark as Recovered (simulate)</Button>
          <Button variant="outline" onClick={onSendSim}>Send Message (simulate)</Button>
        </div>
      </div>

      <div className="text-xs text-gray-500">Demo only — generated content simulates what the AI would write. In production the AI provider would return these messages and the message would be sent via secure APIs (Twilio/SendGrid).</div>
    </div>
  );
}
