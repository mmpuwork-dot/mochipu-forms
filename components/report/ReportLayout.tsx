import { FeedbackReport } from './FeedbackReport';
import { ConfirmReport } from './ConfirmReport';
import type { FeedbackReportData, ConfirmReportData, DisplayMode, ReportTranslations } from './types';

interface FeedbackProps {
  type: 'feedback';
  data: FeedbackReportData;
  mode: DisplayMode;
  translations?: ReportTranslations;
  isPrint?: boolean;
}

interface ConfirmProps {
  type: 'confirm';
  data: ConfirmReportData;
  mode: DisplayMode;
  translations?: ReportTranslations;
  isPrint?: boolean;
}

export type ReportLayoutProps = FeedbackProps | ConfirmProps;

export function ReportLayout(props: ReportLayoutProps) {
  if (props.type === 'feedback') {
    return (
      <FeedbackReport
        data={props.data}
        mode={props.mode}
        translations={props.translations}
        isPrint={props.isPrint}
      />
    );
  }

  return (
    <ConfirmReport
      data={props.data}
      mode={props.mode}
      translations={props.translations}
      isPrint={props.isPrint}
    />
  );
}
