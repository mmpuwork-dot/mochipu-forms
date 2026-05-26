import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { confirmSchema } from '@/lib/validations/confirm';
import { createServerSupabase } from '@/lib/supabase/server';
import { sendConfirmationEmails } from '@/lib/email/client';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = confirmSchema.parse(body);

    const supabase = createServerSupabase();

    // 1. Insert confirmation row
    const { data: confirmation, error } = await supabase
      .from('delivery_confirmations')
      .insert({
        commission_name:    data.commission_name,
        email:              data.email,
        locale:             data.locale,
        debut_date_status:  data.debut_date_status,
        debut_date:         data.debut_date ?? null,
        additional_message: data.additional_message ?? null,
        confirmed:          true,
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Send emails (non-blocking)
    sendConfirmationEmails(confirmation).catch((err) =>
      console.error('[email] sendConfirmationEmails failed:', err),
    );

    return NextResponse.json({ success: true, id: confirmation.id, access_token: confirmation.access_token });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: err.flatten() },
        { status: 400 },
      );
    }
    console.error('[api/confirm] error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
