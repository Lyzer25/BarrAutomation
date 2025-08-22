/**
 * simulate.ts
 * Small helpers to simulate sending payloads to external systems.
 */

export type SimResult = {
  status: number;
  id: string;
  timeline: { step: string; at: string }[];
  responseBody: any;
};

export async function simulateSend(payload: any, variant: string): Promise<SimResult> {
  // create deterministic-ish id
  const id = `${variant.toUpperCase().slice(0, 3)}-${Math.floor(Math.random() * 900000 + 100000)}`;
  const now = Date.now();
  const timeline = [
    { step: 'Queued', at: new Date(now).toISOString() },
    { step: 'Validated', at: new Date(now + 120).toISOString() },
    { step: 'Inserted', at: new Date(now + 320).toISOString() },
  ];

  // simulated response body
  const responseBody = { id, createdAt: new Date(now + 320).toISOString(), variant };

  // mimic network latency
  await new Promise((res) => setTimeout(res, 250));

  return {
    status: 201,
    id,
    timeline,
    responseBody,
  };
}
