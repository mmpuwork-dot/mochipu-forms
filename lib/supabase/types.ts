// Generated types placeholder — replace with output from: npx supabase gen types typescript
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      feedback_submissions: { Row: FeedbackSubmission; Insert: Omit<FeedbackSubmission, 'id' | 'created_at'>; };
      feedback_issues: { Row: FeedbackIssue; Insert: Omit<FeedbackIssue, 'id' | 'created_at'>; };
      delivery_confirmations: { Row: DeliveryConfirmation; Insert: Omit<DeliveryConfirmation, 'id' | 'created_at'>; };
    };
  };
}

export interface FeedbackSubmission {
  id: string;
  created_at: string;
  commission_name: string;
  email: string;
  feedback_round: number;
  locale: 'en' | 'ja' | 'zh';
  status: 'pending' | 'in_progress' | 'done' | 'need_discussion';
  access_token: string;
}

export interface FeedbackIssue {
  id: string;
  submission_id: string;
  order_index: number;
  location: 'face' | 'hair' | 'body' | 'physics' | 'toggle' | 'other';
  type: string[];
  priority: 'high' | 'medium' | 'low';
  expected?: string;
  current_state?: string;
  reference_url?: string;
  reference_files?: Json;
  status: 'pending' | 'in_progress' | 'done' | 'out_of_scope';
  needs_extra_fee: boolean;
  mochipu_note?: string;
  created_at: string;
}

export interface DeliveryConfirmation {
  id: string;
  created_at: string;
  commission_name: string;
  email: string;
  locale: 'en' | 'ja' | 'zh';
  debut_date_status: 'decided' | 'undecided';
  debut_date?: string;
  additional_message?: string;
  confirmed: boolean;
  access_token: string;
}
