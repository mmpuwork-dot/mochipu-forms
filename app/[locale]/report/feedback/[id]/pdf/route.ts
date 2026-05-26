import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import {
  launchBrowser,
  buildReportInternalUrl,
  buildFilename,
  normalizeMode,
} from '@/lib/pdf/browser';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface Context {
  params: Promise<{ locale: string; id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  const { locale, id } = await params;
  const token = req.nextUrl.searchParams.get('token');
  const mode  = normalizeMode(req.nextUrl.searchParams.get('mode'));

  if (!token) return new NextResponse('Not found', { status: 404 });

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('feedback_submissions')
    .select('commission_name, feedback_round')
    .eq('id', id)
    .eq('access_token', token)
    .single();

  if (error || !data) return new NextResponse('Not found', { status: 404 });

  // Always use request origin (not NEXT_PUBLIC_SITE_URL) — Puppeteer runs on the
  // same host as the Next.js server, so it should fetch via the local origin.
  const reportUrl = buildReportInternalUrl(req.nextUrl.origin, locale, 'feedback', id, token, mode);

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 860, height: 1100 });
    await page.goto(reportUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    // Wait until React signals the translation has resolved (or is unneeded).
    await page.waitForSelector('[data-report-ready="true"]', { timeout: 60_000 });
    await page.evaluateHandle('document.fonts.ready');
    // Final paint settle.
    await new Promise((r) => setTimeout(r, 400));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    const filename = buildFilename(
      'feedback',
      data.commission_name,
      data.feedback_round,
      mode,
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[pdf/feedback]', err);
    return new NextResponse('PDF generation failed', { status: 500 });
  } finally {
    await browser.close();
  }
}
