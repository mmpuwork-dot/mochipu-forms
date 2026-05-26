import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { feedbackSchema } from '@/lib/validations/feedback';
import { createServerSupabase } from '@/lib/supabase/server';
import { sendFeedbackEmails } from '@/lib/email/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = feedbackSchema.parse(body);

    const supabase = createServerSupabase();

    // 1. Insert submission row
    const { data: submission, error: subError } = await supabase
      .from('feedback_submissions')
      .insert({
        commission_name: data.commission_name,
        email:           data.email,
        feedback_round:  data.feedback_round,
        locale:          data.locale,
        status:          'pending',
      })
      .select()
      .single();

    if (subError) throw subError;

    // 2. Insert issue rows
    const issueRows = data.issues.map((issue, idx) => ({
      submission_id:   submission.id,
      order_index:     idx + 1,
      location:        issue.location,
      type:            issue.type,
      priority:        issue.priority,
      expected:        issue.expected        ?? null,
      current_state:   issue.current_state   ?? null,
      reference_url:   issue.reference_url   || null,
      reference_files: issue.reference_files?.length ? issue.reference_files : null,
      status:          'pending',
      needs_extra_fee: false,
    }));

    const { data: issues, error: issuesError } = await supabase
      .from('feedback_issues')
      .insert(issueRows)
      .select();

    if (issuesError) throw issuesError;

    // 3. Send emails (non-blocking — don't delay response)
    sendFeedbackEmails(submission, issues ?? []).catch((err) =>
      console.error('[email] sendFeedbackEmails failed:', err),
    );

    return NextResponse.json({ success: true, id: submission.id, access_token: submission.access_token });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: err.flatten() },
        { status: 400 },
      );
    }
    console.error('[api/feedback] error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
