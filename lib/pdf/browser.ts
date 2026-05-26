import puppeteer, { type Browser } from '@cloudflare/puppeteer';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function launchBrowser(): Promise<Browser> {
  console.log('[pdf/launchBrowser] step 1: getCloudflareContext');
  let ctx: ReturnType<typeof getCloudflareContext> | undefined;
  try {
    ctx = getCloudflareContext();
  } catch (err) {
    console.error('[pdf/launchBrowser] getCloudflareContext threw', err);
    throw new Error(`getCloudflareContext failed: ${(err as Error).message}`);
  }

  const env = ctx?.env as { BROWSER?: unknown } | undefined;
  console.log('[pdf/launchBrowser] step 2: env present?', !!env, 'BROWSER present?', !!env?.BROWSER);
  if (!env?.BROWSER) {
    throw new Error(
      'Cloudflare Browser Rendering binding "BROWSER" not configured on this Worker. ' +
        'Add the binding via wrangler.toml then redeploy.',
    );
  }

  console.log('[pdf/launchBrowser] step 3: puppeteer.launch');
  const browser = await puppeteer.launch(env.BROWSER as never);
  console.log('[pdf/launchBrowser] step 4: launched OK');
  return browser;
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
