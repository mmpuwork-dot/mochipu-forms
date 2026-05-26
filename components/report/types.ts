import type { FeedbackSubmission, FeedbackIssue, DeliveryConfirmation } from '@/lib/supabase/types';

export type DisplayMode = 'original' | 'translated' | 'bilingual';

export interface IssueTranslations {
  title?: string;
  expected?: string;
  current_state?: string;
}

export interface ReportTranslations {
  issues?: IssueTranslations[];
  additional_message?: string;
}

export type FeedbackReportData = FeedbackSubmission & {
  issues: FeedbackIssue[];
};

export type ConfirmReportData = DeliveryConfirmation;
