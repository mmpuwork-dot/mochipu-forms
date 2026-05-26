// PDF generation uses @cloudflare/puppeteer with the `BROWSER` binding
// provided by Cloudflare Browser Rendering. Bindings are accessed via
// `getCloudflareContext` from @opennextjs/cloudflare.

import type { Browser } from '@cloudflare/puppeteer';

export async function launchBrowser(): Promise<Browser> {
  const { getCloudflareContext } = await import('@opennextjs/cloudflare');
  const ctx = await getCloudflareContext({ async: true });
  const env = ctx?.env as { BROWSER?: unknown } | undefined;
  if (!env?.BROWSER) {
    throw new Error(
      'Cloudflare Browser Rendering binding "BROWSER" not configured. ' +
        'Add the binding in the Worker settings, then redeploy.',
    );
  }
  const cfp = (await import('@cloudflare/puppeteer')).default;
  return cfp.launch(env.BROWSER as never);
}

// ── Shared URL / filename / mode helpers ─────────────────────────────────────

export function buildReportInternalUrl(
  origin: string,
  locale: string,
  kind: 'feedback' | 'confirm',
  id: string,
  token: string,
  mode: string,
): string {
  const base = `${origin}/${locale}/report/${kind}/${id}`;
  const params = new URLSearchParams({ token, print: 'true', mode });
  return `${base}?${params.toString()}`;
}

export function buildFilename(
  kind: 'feedback' | 'confirm',
  commissionName: string,
  round: number | null,
  mode: string,
): string {
  const sanitized = commissionName.replace(/[^a-zA-Z0-9]/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  const modeTag = mode === 'original' ? '' : `_${mode.toUpperCase()}`;

  if (kind === 'feedback' && round !== null) {
    return `Feedback_${sanitized}_Round${round}${modeTag}_${date}.pdf`;
  }
  return `Delivery_${sanitized}${modeTag}_${date}.pdf`;
}

export const VALID_MODES = ['original', 'translated', 'bilingual'] as const;
export type PdfMode = (typeof VALID_MODES)[number];

export function normalizeMode(raw: string | null): PdfMode {
  return VALID_MODES.includes(raw as PdfMode) ? (raw as PdfMode) : 'original';
}
