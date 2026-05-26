import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { ReportClientWrapper } from '@/components/report/ReportClientWrapper';
import { ReportToolbar } from '@/components/report/ReportToolbar';
import type { DisplayMode, FeedbackReportData } from '@/components/report/types';

export const runtime = 'nodejs';

interface Props {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ token?: string; mode?: string; print?: string }>;
}

export default async function FeedbackReportPage({ params, searchParams }: Props) {
  const { locale, id }               = await params;
  const { token, mode: rawMode, print } = await searchParams;

  if (!token) notFound();

  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('feedback_submissions')
    .select('*, issues:feedback_issues(*)')
    .eq('id', id)
    .eq('access_token', token)
    .single();

  if (error || !data) notFound();

  const submission = data as unknown as FeedbackReportData;

  const VALID_MODES = ['original', 'translated', 'bilingual'];
  const mode     = (VALID_MODES.includes(rawMode ?? '') ? rawMode : 'original') as DisplayMode;
  const isPrint  = print === 'true';
  const baseUrl  = `/${locale}/report/feedback/${id}`;

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      {!isPrint && (
        <div className="no-print">
          <ReportToolbar
            locale={submission.locale}
            baseUrl={baseUrl}
            token={token}
            currentMode={mode}
          />
        </div>
      )}
      <ReportClientWrapper
        type="feedback"
        data={submission}
        mode={mode}
        isPrint={isPrint}
      />
    </div>
  );
}
