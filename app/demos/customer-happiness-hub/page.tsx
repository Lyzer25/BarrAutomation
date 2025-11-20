'use client'

import React, { useEffect, useMemo, useState } from 'react'

// Static generation with 1-hour revalidation
export const dynamic = 'force-static'
export const revalidate = 3600

type Channel = 'Google' | 'Yelp' | 'Email' | 'Social'
type Sentiment = 'positive' | 'neutral' | 'negative'

type Review = {
  id: string
  channel: Channel
  text: string
  date: string
  sentiment?: Sentiment
  routedTo?: string | null
  responded?: boolean
  responseText?: string | null
}

/**
 * Customer Happiness Hub demo page
 *
 * Self-contained interactive demo showcasing:
 * - keyword-based sentiment classification (heuristic)
 * - suggested response generation (heuristic)
 * - routing simulation (select department)
 * - aggregated metrics: totals, pie chart, avg sentiment
 * - animated "98% faster" stat and radial gauge
 * - workflow modal and CTA "Book a demo"
 *
 * All data and logic live locally so the page runs without backend services.
 *
 * Note: In production the sentiment & responses would be produced by an AI/NLP model.
 */

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'r1',
    channel: 'Google',
    text: 'Amazing service — the technician was on time and super friendly. Will recommend!',
    date: '2025-08-20'
  },
  {
    id: 'r2',
    channel: 'Yelp',
    text: 'Had to wait too long, very frustrated with the delay. Terrible experience.',
    date: '2025-08-19'
  },
  {
    id: 'r3',
    channel: 'Email',
    text: 'Overall okay but the invoice had an incorrect line item. Please advise.',
    date: '2025-08-18'
  },
  {
    id: 'r4',
    channel: 'Social',
    text: 'Love the new scheduling app — it made booking a breeze. Awesome work!',
    date: '2025-08-17'
  },
  {
    id: 'r5',
    channel: 'Google',
    text: 'Staff were helpful but checkout took too long — disappointed.',
    date: '2025-08-16'
  },
  {
    id: 'r6',
    channel: 'Email',
    text: 'Thanks for the quick response earlier. Everything resolved.',
    date: '2025-08-15'
  }
]

const POSITIVE_KEYWORDS = ['great', 'awesome', 'amazing', 'love', 'excellent', 'helpful', 'quick']
const NEGATIVE_KEYWORDS = ['terrible', 'awful', 'frustrated', 'disappointed', 'delay', 'too long', 'problem']

function classifySentiment(text: string): Sentiment {
  const t = text.toLowerCase()
  for (const k of POSITIVE_KEYWORDS) {
    if (t.includes(k)) return 'positive'
  }
  for (const k of NEGATIVE_KEYWORDS) {
    if (t.includes(k)) return 'negative'
  }
  return 'neutral'
}

/** Simple heuristic to generate a suggested response. In production, an AI model would generate tone-aware responses. */
function generateSuggestedResponse(review: Review): string {
  const sentiment = review.sentiment ?? classifySentiment(review.text)
  if (sentiment === 'positive') {
    return `Thank you for your kind words! We're thrilled you had a great experience — we'll share this with the team.`
  }
  if (sentiment === 'negative') {
    return `We're very sorry to hear about this. We take feedback seriously — a manager will reach out to resolve this as soon as possible.`
  }
  return `Thanks for the feedback — can you share a few more details so we can investigate and improve?`
}

/** Convert sentiment to numeric score for averaging: positive=1, neutral=0, negative=-1 */
function sentimentScore(s: Sentiment) {
  return s === 'positive' ? 1 : s === 'negative' ? -1 : 0
}

/** Tiny, accessible tooltip */
function Info({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 inline-block group relative">
      <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-white/6 text-white/90">i</span>
      <span
        role="tooltip"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs absolute -top-10 left-1/2 -translate-x-1/2 w-64 p-2 rounded bg-black border border-white/10 text-white/80 shadow"
      >
        {children}
      </span>
    </span>
  )
}

export default function CustomerHappinessHubDemo() {
  const [reviews, setReviews] = useState<Review[]>(
    SAMPLE_REVIEWS.map((r) => ({ ...r, sentiment: classifySentiment(r.text), routedTo: null, responded: false, responseText: null }))
  )
  const [expanded, setExpanded] = useState<string | null>(null)
  const [stat, setStat] = useState(0) // animated stat (0 -> 98)
  const [showWorkflowModal, setShowWorkflowModal] = useState(false)
  const [showCtaModal, setShowCtaModal] = useState(false)
  const [sortKey, setSortKey] = useState<'date' | 'sentiment' | 'channel'>('date')

  // animate stat to 98
  useEffect(() => {
    let mounted = true
    let v = 0
    const target = 98
    const step = 2
    const t = setInterval(() => {
      if (!mounted) return
      v = Math.min(target, v + step)
      setStat(v)
      if (v >= target) clearInterval(t)
    }, 40)
    return () => {
      mounted = false
      clearInterval(t)
    }
  }, [])

  const totals = useMemo(() => {
    const total = reviews.length
    const counts = { positive: 0, neutral: 0, negative: 0 }
    for (const r of reviews) {
      counts[r.sentiment as Sentiment] = (counts[r.sentiment as Sentiment] ?? 0) + 1
    }
    const avg = reviews.reduce((acc, r) => acc + sentimentScore(r.sentiment as Sentiment), 0) / (reviews.length || 1)
    return { total, counts, avg }
  }, [reviews])

  const sentimentPercents = useMemo(() => {
    const { counts, total } = totals
    return {
      positive: Math.round((counts.positive / Math.max(1, total)) * 100),
      neutral: Math.round((counts.neutral / Math.max(1, total)) * 100),
      negative: Math.round((counts.negative / Math.max(1, total)) * 100)
    }
  }, [totals])

  function toggleExpand(id: string) {
    setExpanded((prev) => (prev === id ? null : id))
  }

  function routeReview(id: string, department: string) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, routedTo: department } : r)))
    // simulate a small confirmation toast by briefly expanding
    setExpanded(id)
  }

  function sendResponse(id: string) {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const responseText = r.responseText ?? generateSuggestedResponse(r)
        return { ...r, responded: true, responseText }
      })
    )
  }

  function onChangeRoutingDraft(id: string, val: string) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, routedTo: val } : r)))
  }

  const sortedReviews = useMemo(() => {
    const copy = [...reviews]
    if (sortKey === 'date') {
      copy.sort((a, b) => (b.date > a.date ? 1 : -1))
    } else if (sortKey === 'sentiment') {
      const order = { positive: -1, neutral: 0, negative: 1 } as any
      copy.sort((a, b) => order[a.sentiment as Sentiment] - order[b.sentiment as Sentiment])
    } else if (sortKey === 'channel') {
      copy.sort((a, b) => a.channel.localeCompare(b.channel))
    }
    return copy
  }, [reviews, sortKey])

  // pie chart stroke-dash for 3 equal arcs using percents
  const pieStroke = {
    positive: sentimentPercents.positive,
    neutral: sentimentPercents.neutral,
    negative: sentimentPercents.negative
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#051018] to-[#07121a] text-white py-12">
      <div className="container mx-auto px-6">
        {/* Header card */}
        <div className="max-w-4xl mx-auto bg-black/60 border border-white/6 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Customer Happiness Hub</h1>
                <span className="px-3 py-1 rounded-full text-xs bg-teal-700/20 text-teal-300 font-medium">Service Businesses</span>
                <span className="ml-2 text-xs px-2 py-1 rounded bg-white/6 text-white/80 border border-white/8">Coming Soon</span>
              </div>

              <p className="mt-3 text-sm text-white/80 max-w-2xl">
                The system monitors reviews, classifies sentiment and drafts auto-responses.
                <br />
                It aggregates feedback from all channels, uses AI to understand sentiment, and routes issues to the right team member with a suggested response.
              </p>

              <div className="mt-4 flex items-center gap-6">
                <div className="flex flex-col">
                  <div className="text-sm text-white/70">Response time improvement</div>
                  <div className="text-3xl font-bold text-teal-300 flex items-baseline gap-2">
                    <AnimatedStat value={stat} suffix="%" />
                    <span className="text-sm text-white/60 ml-1">faster response time</span>
                  </div>
                </div>

                <div className="ml-4">
                  <RadialGauge value={stat} />
                </div>

                <div className="ml-auto flex gap-3">
                  <button
                    onClick={() => setShowWorkflowModal(true)}
                    className="px-3 py-2 rounded bg-white/6 hover:bg-white/8 transition text-sm"
                    aria-label="How it works"
                  >
                    How it works
                  </button>
                  <button
                    onClick={() => setShowCtaModal(true)}
                    className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-500 transition text-sm font-semibold"
                  >
                    Book a demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left: Reviews list */}
          <div className="lg:col-span-2 bg-black/50 border border-white/6 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Reviews</h2>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-white/70">Sort:</label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className="bg-black/30 border border-white/6 px-2 py-1 rounded text-sm"
                >
                  <option value="date">Date</option>
                  <option value="sentiment">Sentiment</option>
                  <option value="channel">Channel</option>
                </select>
                <Info>
                  Example sentiment classification runs locally in this demo using keyword heuristics. In production AI/NLP models process thousands of reviews and detect tone.
                </Info>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {sortedReviews.map((r) => (
                <div
                  key={r.id}
                  className={`rounded-lg border border-white/6 p-3 bg-black/30 transition hover:shadow-md ${expanded === r.id ? 'ring-2 ring-teal-600/30' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 text-xs text-white/70">
                      <div className="font-mono">{r.channel}</div>
                      <div className="text-[11px] text-white/60 mt-1">{r.date}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="text-sm">{r.text}</div>
                        <div className="ml-3 text-sm">
                          <SentimentPill sentiment={r.sentiment as Sentiment} />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(r.id)}
                          className="text-xs px-2 py-1 rounded bg-white/6 hover:bg-white/8"
                        >
                          {expanded === r.id ? 'Collapse' : 'View'}
                        </button>
                        <button
                          onClick={() => {
                            routeReview(r.id, 'Support')
                          }}
                          className="text-xs px-2 py-1 rounded bg-teal-700 text-white/90 hover:bg-teal-600"
                        >
                          Route → Support
                        </button>
                        <div className="text-xs text-white/70 ml-auto">{r.responded ? 'Responded' : 'Pending'}</div>
                      </div>

                      {expanded === r.id && (
                        <div className="mt-3 border-t border-white/6 pt-3 text-sm">
                          <div className="mb-2">
                            <strong>Suggested response</strong>
                            <span className="text-white/60 ml-2 text-xs">(heuristic)</span>
                          </div>
                          <textarea
                            className="w-full bg-black/20 border border-white/6 rounded p-2 text-sm min-h-[80px]"
                            value={r.responseText ?? generateSuggestedResponse(r)}
                            onChange={(e) =>
                              setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, responseText: e.target.value } : x)))
                            }
                          />

                          <div className="mt-3 flex items-center gap-2">
                            <select
                              value={r.routedTo ?? ''}
                              onChange={(e) => onChangeRoutingDraft(r.id, e.target.value)}
                              className="bg-black/20 border border-white/6 px-2 py-1 rounded text-sm"
                            >
                              <option value="">Select department</option>
                              <option value="Sales">Sales</option>
                              <option value="Support">Support</option>
                              <option value="Operations">Operations</option>
                              <option value="Management">Management</option>
                            </select>
                            <button
                              onClick={() => {
                                if (!r.routedTo) routeReview(r.id, 'Support')
                              }}
                              className="px-3 py-1 rounded bg-white/6 hover:bg-white/8 text-sm"
                            >
                              Simulate Route
                            </button>
                            <button
                              onClick={() => sendResponse(r.id)}
                              className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-sm text-black font-semibold"
                            >
                              Send Response
                            </button>

                            {r.routedTo && (
                              <div className="ml-auto text-xs text-white/70">
                                Routed to <span className="font-mono text-teal-300">{r.routedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Metrics & charts */}
          <aside className="bg-black/50 border border-white/6 rounded-xl p-4">
            <h3 className="text-lg font-semibold flex items-center">
              Overview
              <Info>
                Aggregated metrics show volume, sentiment distribution and response-time improvements driven by automation.
              </Info>
            </h3>

            <div className="mt-4 space-y-4">
              <div className="text-sm text-white/70">Total reviews</div>
              <div className="text-3xl font-bold text-teal-300">{totals.total}</div>

              <div className="mt-2">
                <div className="text-sm text-white/70">Sentiment breakdown</div>
                <div className="flex items-center gap-4 mt-2">
                  <PieChart values={pieStroke} size={96} />
                  <div className="text-sm">
                    <div className="flex gap-3 items-center"><span className="w-3 h-3 bg-teal-400 rounded" /> Positive <span className="ml-2 text-white/70">{sentimentPercents.positive}%</span></div>
                    <div className="flex gap-3 items-center mt-2"><span className="w-3 h-3 bg-white/40 rounded" /> Neutral <span className="ml-2 text-white/70">{sentimentPercents.neutral}%</span></div>
                    <div className="flex gap-3 items-center mt-2"><span className="w-3 h-3 bg-pink-500 rounded" /> Negative <span className="ml-2 text-white/70">{sentimentPercents.negative}%</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div className="text-sm text-white/70">Average sentiment score</div>
                <div className="mt-1">
                  <div className="text-xl font-bold">{totals.avg.toFixed(2)}</div>
                  <div className="text-xs text-white/60">(-1 = negative, 0 = neutral, 1 = positive)</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-white/70">Response time: Automated vs Manual</div>
                <div className="mt-2 space-y-2">
                  <div className="text-xs text-white/70 flex justify-between"><span>Manual (e.g., 1 h)</span><span>60 min</span></div>
                  <Bar widthPercent={100} color="bg-white/12" label="Manual" />
                  <div className="text-xs text-white/70 flex justify-between mt-2"><span>Automated (a few minutes)</span><span>~2 min</span></div>
                  <Bar widthPercent={6} color="bg-teal-500" label="Automated" />
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Customers of similar platforms report <strong>up to 98% faster response time</strong>.
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setShowCtaModal(true)}
                  className="w-full px-3 py-2 rounded bg-teal-600 hover:bg-teal-500 font-semibold text-black"
                >
                  Book a demo
                </button>
                <div className="mt-2 text-xs text-white/60">Or click "Try Live Demo" on the Demos page to open this tool directly.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showWorkflowModal && (
        <Modal onClose={() => setShowWorkflowModal(false)} title="Workflow Overview">
          <ol className="list-decimal pl-5 space-y-2 text-sm text-white/80">
            <li>
              The system pulls in reviews from multiple channels (review sites, social, support tickets).
            </li>
            <li>
              AI uses natural-language processing to detect tone and categorize sentiment.
            </li>
            <li>
              It generates an appropriate response and suggests a routing path to the right team member.
            </li>
            <li>
              Managers see analytics dashboards and response-time improvements (up to 98%).
            </li>
          </ol>
        </Modal>
      )}

      {showCtaModal && (
        <Modal onClose={() => setShowCtaModal(false)} title="Book a demo">
          <div className="text-sm text-white/80">
            <p className="mb-3">See how Customer Happiness Hub improves customer satisfaction and resolution times.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setShowCtaModal(false)
                alert('Thanks — demo request submitted (simulated).')
              }}
            >
              <div className="flex flex-col gap-2">
                <input required placeholder="Name" className="bg-black/20 border border-white/6 rounded p-2 text-sm" />
                <input required placeholder="Email" type="email" className="bg-black/20 border border-white/6 rounded p-2 text-sm" />
                <textarea placeholder="Company / Notes" className="bg-black/20 border border-white/6 rounded p-2 text-sm" />
                <button type="submit" className="mt-2 px-3 py-2 rounded bg-teal-600 text-black font-semibold">Request demo</button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}

/** Small components used in-page - kept local and simple for the self-contained demo */

function AnimatedStat({ value, suffix }: { value: number; suffix?: string }) {
  return (
    <div className="inline-flex items-baseline gap-1">
      <span className="text-3xl font-bold text-teal-300">{value}</span>
      {suffix && <span className="text-sm text-white/70">{suffix}</span>}
    </div>
  )
}

function RadialGauge({ value }: { value: number }) {
  // value 0..100
  const r = 36
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const dash = (c * pct) / 100
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="rotate-[-90deg]">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <g transform="translate(44,44)">
        <circle r={r} stroke="#ffffff10" strokeWidth="8" fill="none" />
        <circle
          r={r}
          stroke="url(#g1)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: 'stroke-dasharray 700ms ease' }}
          fill="none"
        />
        <text x="0" y="4" textAnchor="middle" fontSize="14" fill="#ffffffcc" transform="rotate(90)">
          {Math.round(pct)}%
        </text>
      </g>
    </svg>
  )
}

function SentimentPill({ sentiment }: { sentiment: Sentiment }) {
  const map = {
    positive: { label: 'Positive', bg: 'bg-teal-600 text-black' },
    neutral: { label: 'Neutral', bg: 'bg-white/10 text-white' },
    negative: { label: 'Negative', bg: 'bg-pink-500 text-black' }
  }
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${map[sentiment].bg}`}>{map[sentiment].label}</span>
}

function PieChart({ values, size = 120 }: { values: { positive: number; neutral: number; negative: number }; size?: number }) {
  const total = values.positive + values.neutral + values.negative || 1
  const p1 = (values.positive / total) * 100
  const p2 = (values.neutral / total) * 100
  const p3 = (values.negative / total) * 100
  // draw using conic-gradient fallback to CSS circle segments using inline styles
  const style = {
    background: `conic-gradient(#06b6d4 ${p1}%, #ffffff66 ${p1} ${p1 + p2}%, #fb7185 ${p1 + p2} 100%)`
  }
  return <div style={style as any} className="rounded-full" dangerouslySetInnerHTML={{ __html: '' }} aria-hidden />
}

function Bar({ widthPercent, color, label }: { widthPercent: number; color: string; label?: string }) {
  return (
    <div className="w-full bg-white/6 rounded h-4 overflow-hidden">
      <div className={`${color} h-4`} style={{ width: `${widthPercent}%`, transition: 'width 700ms ease' }} />
    </div>
  )
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-black/80 border border-white/8 rounded-lg p-6 max-w-xl w-full shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">Close</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
