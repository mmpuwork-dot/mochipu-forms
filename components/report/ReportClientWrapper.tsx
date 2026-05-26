'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { ReportLayout } from './ReportLayout';
import type { FeedbackReportData, ConfirmReportData, DisplayMode } from './types';

interface FeedbackProps {
  type: 'feedback';
  data: FeedbackReportData;
  mode: DisplayMode;
  isPrint?: boolean;
}

interface ConfirmProps {
  type: 'confirm';
  data: ConfirmReportData;
  mode: DisplayMode;
  isPrint?: boolean;
}

type Props = FeedbackProps | ConfirmProps;

export function ReportClientWrapper(props: Props) {
  const input =
    props.type === 'feedback'
      ? { type: 'feedback' as const, locale: props.data.locale, issues: props.data.issues }
      : {
          type: 'confirm' as const,
          locale: props.data.locale,
          additional_message: props.data.additional_message,
        };

  const { translations, loading, done } = useTranslation(input, props.mode);

  return (
    <div style={{ position: 'relative' }} data-report-ready={done ? 'true' : 'false'}>
      {/* Loading overlay — only visible during translation fetch */}
      {loading && !props.isPrint && (
        <div
          style={{
            position: 'fixed',
            top: '48px',
            right: '16px',
            fontSize: '11px',
            color: '#A89FC2',
            background: '#FBFAFD',
            border: '0.5px solid #D9D2E8',
            padding: '4px 10px',
            zIndex: 20,
          }}
        >
          翻譯中…
        </div>
      )}
      <ReportLayout
        type={props.type as 'feedback'}
        data={props.data as FeedbackReportData}
        mode={props.mode}
        translations={translations}
        isPrint={props.isPrint}
      />
    </div>
  );
}
