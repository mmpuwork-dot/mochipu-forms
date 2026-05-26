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

  const reportUrl = buildReportInternalUrl(req.nextUrl.origin, locale, 'feedback', id, token, mode);

  // Wrap the entire flow so launchBrowser failures also get reported with a
  // useful body. Browser will only be defined if launch succeeded.
  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 860, height: 1100 });
    await page.goto(reportUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForSelector('[data-report-ready="true"]', { timeout: 60_000 });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 400));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    const filename = buildFilename('feedback', data.commission_name, data.feedback_round, mode);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    const e = err as Error;
    console.error('[pdf/feedback] failed:', e?.message, e?.stack);
    // TEMP: surface the error in the response body so we can debug in the
    // browser without needing the Cloudflare logs UI. Remove after diagnosis.
    return new NextResponse(
      `PDF generation failed:\n\n${e?.name ?? 'Error'}: ${e?.message}\n\n${e?.stack ?? ''}`,
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
