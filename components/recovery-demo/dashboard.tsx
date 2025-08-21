"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
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
} from "recharts"

/**
 * Revenue Recovery Robot - Interactive dashboard
 */

/* -----------------------------
   Data models
   ----------------------------- */
type CartItem = {
  id: string
  name: string
  price: number
  qty: number
}

type Cart = {
  id: string
  customerId: string
  items: CartItem[]
  total: number
  abandonedMinutesAgo: number
  triggers: string[]
  recovered?: boolean
  recoveredAmount?: number
  recoveryProbability?: number
}

type Customer = {
  id: string
  name: string
  email: string
  aov: number
  lifetimeValue: number
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum"
  notes?: string
  orders: { id: string; total: number; date: string }[]
}

/* Seed data */
const seedCustomers: Customer[] = [
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
]

const seedCarts: Cart[] = [
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
    recoveryProbability: 75,
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
    recoveryProbability: 85,
  },
  {
    id: "cart-3",
    customerId: "c3",
    items: [{ id: "p20", name: "Organic Face Serum", price: 44.0, qty: 1 }],
    total: 44.0,
    abandonedMinutesAgo: 1,
    triggers: ["coupon-error"],
    recoveryProbability: 60,
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
    recoveryProbability: 70,
  },
]

/* Utility functions */
const currency = (n: number) => `$${n.toFixed(2)}`

const joinItemNames = (items: CartItem[]) => items.map((i) => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ""}`).join(", ")

/* Modal Component */
function useLockBodyScroll(open: boolean) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])
}

function Dialog({
  title,
  open,
  onClose,
  children,
}: {
  title?: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const el = ref.current?.querySelector<HTMLElement>(
      "button, [href], input, textarea, [tabindex]:not([tabindex='-1'])",
    )
    el?.focus()
  }, [open])

  if (!open) return null

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
  )
}

/* Charts */
function Donut({ percentRecovered }: { percentRecovered: number }) {
  const abandonPercent = 70
  const recovered = Math.max(0, Math.min(100, Math.round(percentRecovered)))
  const remaining = Math.max(0, abandonPercent - recovered)

  // Use RGB colors to avoid any hex color conflicts
  const data = [
    { name: "Recovered", value: recovered, fill: "rgb(124, 58, 237)" }, // Purple
    { name: "Remaining", value: remaining, fill: "rgb(107, 114, 128)" }, // Gray
  ]

  return (
    <div style={{ width: 120, height: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={36} outerRadius={54} startAngle={90} endAngle={-270}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} style={{ fill: entry.fill }} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function Sparkline({ points }: { points: number[] }) {
  const data = points.map((v, i) => ({ x: `T${i + 1}`, y: v }))
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
  )
}

/* AI script generation */
function generateAiScript(cart: Cart, customer: Customer | null, variationSeed = 0) {
  const name = customer?.name ?? "there"
  const tier = customer?.loyaltyTier ?? "Customer"
  const aov = customer?.aov ?? 0
  const items = joinItemNames(cart.items)
  const total = currency(cart.total)

  const idx = variationSeed % 3

  const friction = cart.triggers.includes("coupon-error")
    ? "a coupon error at checkout"
    : cart.triggers.includes("high-value")
      ? "concern about shipping or added costs"
      : cart.triggers.includes("exit-intent")
        ? "you looked like you were leaving"
        : "an idle session"

  let incentive = { label: "10% off + free shipping", code: "RECOVER10", percent: 10 }
  if (tier === "Gold" || aov > 150) {
    incentive = { label: "15% off + free expedited shipping", code: "VIP15", percent: 15 }
  } else if (cart.total >= 100) {
    incentive = { label: "12% off + free shipping", code: "SAVE12", percent: 12 }
  } else if (cart.triggers.includes("coupon-error")) {
    incentive = { label: "free shipping", code: "FREESHIP", percent: 0 }
  }

  const commonIntro = `Hi ${name} — I noticed you left ${items} in your cart (${total}).`

  const variations = [
    [
      { actor: "bot", text: commonIntro },
      { actor: "bot", text: `It looks like we detected ${friction}. Can I help fix that?` },
      {
        actor: "bot",
        text: `Here's a personalized offer: use code ${incentive.code} for ${incentive.label}. This is valid for the next 2 hours.`,
      },
      { actor: "bot", text: `If you'd like, I can apply the coupon for you and reserve the items.` },
    ],
    [
      { actor: "bot", text: `Quick note — items in your cart have a limited stock.` },
      { actor: "bot", text: commonIntro },
      {
        actor: "bot",
        text: `Because you're a ${tier} customer, here's ${incentive.label} with code ${incentive.code}.`,
      },
      { actor: "bot", text: `Customers who accept typically complete checkout 72% faster.` },
    ],
    [
      { actor: "bot", text: `Hey ${name}, I can help if there were any concerns about security or checkout.` },
      { actor: "bot", text: commonIntro },
      {
        actor: "bot",
        text: `We can also reserve your cart and hold it for 30 minutes. Use ${incentive.code} for ${incentive.label}.`,
      },
      { actor: "bot", text: `If payment failed, reply 'HELP' and we'll walk you through secure options.` },
    ],
  ]

  const recoveryChance = cart.recoveryProbability ?? 70
  const outcome =
    recoveryChance > 50
      ? {
          actor: "system",
          text: `Recovered! Estimated recovered amount ${currency(Math.round(cart.total * (0.6 + Math.random() * 0.4)))}`,
        }
      : { actor: "system", text: `Not recovered` }

  const script = variations[idx].concat([outcome])
  return { script, incentive, recoveryChance }
}

/* Main Component */
export default function RevenueRecoveryDemo() {
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers)
  const [carts, setCarts] = useState<Cart[]>(seedCarts)
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null)
  const [inspectedCustomer, setInspectedCustomer] = useState<Customer | null>(null)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [variationSeed, setVariationSeed] = useState(0)

  const { toast } = useToast()

  // Calculate live analytics based on current cart states
  const analytics = useMemo(() => {
    const totalCarts = carts.length
    const recoveredCarts = carts.filter((c) => c.recovered).length
    const recoveryRate = totalCarts > 0 ? Math.round((recoveredCarts / totalCarts) * 100) : 23

    const totalRecoveredRevenue = carts.filter((c) => c.recovered).reduce((sum, c) => sum + (c.recoveredAmount || 0), 0)

    // Base monthly revenue with live updates
    const baseMonthlyRevenue = [12000, 11500, 12800, 13000, 12500, 14000, 13800, 14500]
    const currentMonthBoost = totalRecoveredRevenue * 10 // Simulate monthly impact
    const recoveredMonthly = baseMonthlyRevenue.map((m, i) =>
      i === baseMonthlyRevenue.length - 1 ? Math.round(m * 0.23 + currentMonthBoost) : Math.round(m * 0.23),
    )

    return {
      recoveryRate,
      totalRecoveredRevenue,
      recoveredMonthly,
      aovLiftPercent: 15,
      responseRate: 68,
    }
  }, [carts])

  const getCustomerForCart = (cart: Cart) => customers.find((c) => c.id === cart.customerId) ?? null

  function previewAiResponse(cart: Cart) {
    setSelectedCart(cart)
    const cust = getCustomerForCart(cart)
    setInspectedCustomer(cust)
    setVariationSeed((s) => s + 1)
    setAiModalOpen(true)
  }

  function simulateRecover(cartId: string) {
    setCarts((prev) =>
      prev.map((c) =>
        c.id === cartId
          ? {
              ...c,
              recovered: true,
              recoveredAmount: Math.round(c.total * (0.6 + Math.random() * 0.4)),
            }
          : c,
      ),
    )
    toast({
      title: "Cart recovered successfully",
      description: "Customer completed their purchase with the personalized offer.",
    })
    setAiModalOpen(false)
  }

  useEffect(() => {
    if (!inspectedCustomer) return
    setCustomers((prev) => prev.map((c) => (c.id === inspectedCustomer.id ? inspectedCustomer : c)))
  }, [inspectedCustomer])

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-black rounded-xl p-8 border border-white/6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-white">Revenue Recovery Robot</h1>
            <p className="text-subtle-gray mt-2 max-w-2xl">
              AI-powered cart recovery that detects exit-intent, idle sessions, and high-value carts — engaging shoppers
              with personalized incentives to recover lost revenue.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <div className="bg-white/5 border border-white/6 rounded-lg p-4 w-80">
              <p className="text-white font-mono font-semibold">Performance Metrics</p>
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">{analytics.recoveryRate}%</p>
                  <p className="text-xs text-gray-400">Recovery rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{analytics.aovLiftPercent}%</p>
                  <p className="text-xs text-gray-400">AOV lift</p>
                </div>
              </div>
              <p className="text-xs mt-3 text-gray-400">Proactive engagement recovers 15–25% of abandoned carts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cart Monitor + Customer Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Abandoned Cart Monitor */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-lg text-white">Live Cart Monitor</h2>
              <Badge className="font-mono bg-red-500/20 text-red-300">
                {carts.filter((c) => !c.recovered).length} Active Abandons
              </Badge>
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
                    const cust = getCustomerForCart(cart)
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
                        <td className="py-3 px-3 text-gray-400">{cart.abandonedMinutesAgo}m ago</td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2 flex-wrap">
                            {cart.triggers.map((t) => (
                              <Badge key={t} className="font-mono bg-white/5 text-white/90 text-xs">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => previewAiResponse(cart)} disabled={cart.recovered}>
                              View AI Response
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setInspectedCustomer(getCustomerForCart(cart))
                                window.scrollTo({ top: 600, behavior: "smooth" })
                              }}
                            >
                              Customer Details
                            </Button>
                          </div>
                          {cart.recovered && (
                            <div className="mt-2 text-xs text-green-400 font-mono">
                              ✓ Recovered: {currency(cart.recoveredAmount ?? 0)}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Customer Details Panel */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-white">Customer Intelligence</h3>
              <p className="text-xs text-gray-400">AI uses this data for personalization</p>
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
                        <Badge className="font-mono bg-white/6 text-white">
                          LTV ${inspectedCustomer.lifetimeValue}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs text-gray-400 font-mono">Average Order Value</label>
                      <Input
                        aria-label="AOV"
                        className="mt-1"
                        value={String(inspectedCustomer.aov)}
                        onChange={(e) => {
                          const val = Number(e.target.value || 0)
                          setInspectedCustomer((prev) => (prev ? { ...prev, aov: val } : prev))
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <label className="text-xs text-gray-400 font-mono">Customer Notes</label>
                      <Textarea
                        aria-label="Customer notes"
                        className="mt-1"
                        value={inspectedCustomer.notes}
                        onChange={(e) =>
                          setInspectedCustomer((prev) => (prev ? { ...prev, notes: e.target.value } : prev))
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-sm font-mono">
                    Select a customer to view their profile and purchase history.
                  </div>
                )}
              </div>

              <div className="md:col-span-1 bg-white/2 rounded p-3">
                <div className="text-xs text-gray-400 font-mono">Purchase History</div>
                <div className="mt-2 space-y-2">
                  {inspectedCustomer?.orders?.map((o) => (
                    <div key={o.id} className="flex justify-between items-center">
                      <div className="text-sm text-white font-mono">{o.id}</div>
                      <div className="text-xs text-gray-400">{currency(o.total)}</div>
                    </div>
                  )) ?? <div className="text-xs text-gray-500">No purchase history</div>}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right column: Analytics */}
        <aside className="space-y-6">
          {/* Performance Analytics */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-white">Performance Analytics</h3>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4">
                <Donut percentRecovered={analytics.recoveryRate} />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-mono text-white">{analytics.recoveryRate}%</div>
                    <div className="text-xs text-gray-400">of abandoned carts recovered</div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Industry average: 8-12%</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Recovered revenue (last 8 months)</div>
                <div className="mt-2">
                  <Sparkline points={analytics.recoveredMonthly} />
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400">AOV Lift</div>
                  <div className="text-xl font-mono text-white">{analytics.aovLiftPercent}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Response Rate</div>
                  <div className="text-xl font-mono text-white">{analytics.responseRate}%</div>
                </div>
              </div>
            </div>
          </section>

          {/* Recovery Insights */}
          <section className="bg-black/40 border border-white/6 rounded-lg p-4">
            <h4 className="font-mono text-white">Recovery Insights</h4>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Exit-intent triggers</span>
                <span className="text-sm text-white font-mono">42%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">High-value carts</span>
                <span className="text-sm text-white font-mono">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Idle sessions</span>
                <span className="text-sm text-white font-mono">23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Coupon errors</span>
                <span className="text-sm text-white font-mono">7%</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded">
              <div className="text-xs text-gray-400">Best performing offer</div>
              <div className="text-sm text-white font-mono mt-1">15% off + free shipping</div>
              <div className="text-xs text-gray-400 mt-1">85% conversion rate</div>
            </div>
          </section>
        </aside>
      </div>

      {/* AI Response Modal */}
      <Dialog
        title={
          selectedCart
            ? `AI Recovery Message — ${getCustomerForCart(selectedCart as Cart)?.name ?? ""}`
            : "AI Recovery Message"
        }
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      >
        {selectedCart && (
          <AIResponseView
            cart={selectedCart}
            customer={inspectedCustomer}
            onRecover={() => simulateRecover(selectedCart.id)}
            seed={variationSeed}
          />
        )}
      </Dialog>
    </div>
  )
}

/* AI Response View Component */
function AIResponseView({
  cart,
  customer,
  onRecover,
  seed,
}: {
  cart: Cart
  customer: Customer | null
  onRecover: () => void
  seed: number
}) {
  const { script, incentive, recoveryChance } = generateAiScript(cart, customer, seed || 0)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {script.map((m, i) => (
          <div key={i} className={m.actor === "bot" ? "p-3 rounded bg-white/5" : "p-3 rounded bg-green-900/30"}>
            <div className="text-xs text-gray-400 font-mono">{m.actor === "bot" ? "AI Assistant" : "System"}</div>
            <div className="mt-1 text-white font-mono">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Recovery probability: <strong className="text-white font-mono">{recoveryChance}%</strong>
        </div>
        <div className="flex gap-2">
          <Button onClick={onRecover}>Send Recovery Message</Button>
        </div>
      </div>
    </div>
  )
}
