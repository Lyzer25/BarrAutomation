/**
 * sampleLoader
 * Client-friendly helper to request sample data via the local API endpoints.
 * The API route will read files from /data/demo/data-entry and return text content.
 */

export type SampleVariant = 'invoice' | 'leads' | 'email';

export async function loadSampleText(variant: SampleVariant): Promise<{ text: string; name?: string; attachedCsv?: string | null }> {
  const res = await fetch(`/api/demo/data-entry/sample?variant=${encodeURIComponent(variant)}`);
  if (!res.ok) throw new Error('Failed to load sample');
  const payload = await res.json();
  return payload as { text: string; name?: string; attachedCsv?: string | null };
}
