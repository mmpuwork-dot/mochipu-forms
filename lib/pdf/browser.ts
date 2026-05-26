import puppeteer, { type Browser } from 'puppeteer-core';

// ── Local Chrome discovery (dev only) ─────────────────────────────────────────

const LOCAL_CHROME_CANDIDATES: string[] = [
  process.env.CHROME_EXECUTABLE_PATH ?? '',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].filter(Boolean);

async function resolveLocalExecutable(): Promise<string | null> {
  const { existsSync } = await import('fs');
  for (const candidate of LOCAL_CHROME_CANDIDATES) {
    if (candidate && existsSync(candidate)) return candidate;
  }
  return null;
}

async function launchLocalBrowser(): Promise<Browser> {
  const localPath = await resolveLocalExecutable();
  if (!localPath) {
    throw new Error(
      'No local Chrome/Edge executable found. Set CHROME_EXECUTABLE_PATH env var.',
    );
  }
  return puppeteer.launch({
    executablePath: localPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

// ── Cloudflare Browser Rendering (production) ────────────────────────────────

async function launchCloudflareBrowser(): Promise<Browser> {
  // Lazy imports — `getRequestContext` throws outside the Cloudflare runtime,
  // so we keep them async and inside the try/catch in launchBrowser().
  const { getRequestContext } = await import('@cloudflare/next-on-pages');
  const ctx = getRequestContext();
  const env = ctx?.env as { BROWSER?: unknown } | undefined;
  if (!env?.BROWSER) {
    throw new Error('Cloudflare Browser Rendering binding "BROWSER" not configured.');
  }
  const cfp = (await import('@cloudflare/puppeteer')).default;
  // The @cloudflare/puppeteer Browser shares the methods we use (newPage, pdf,
  // close, …) with puppeteer-core. Cast at the boundary.
  return cfp.launch(env.BROWSER as never) as unknown as Browser;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function launchBrowser(): Promise<Browser> {
  // Try Cloudflare first; if we're not on Cloudflare Pages the import or
  // getRequestContext() call will throw, and we drop through to local Chrome.
  try {
    return await launchCloudflareBrowser();
  } catch {
    return launchLocalBrowser();
  }
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
