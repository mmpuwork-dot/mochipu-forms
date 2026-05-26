import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { render } from '@react-email/render';

import FeedbackToMochipu from '@/lib/email/templates/FeedbackToMochipu';
import ConfirmToMochipu  from '@/lib/email/templates/ConfirmToMochipu';

export const runtime = 'nodejs';

// Dev-only helper. Renders the React Email templates as HTML so we can preview
// without needing to actually send via Resend. Mounts mock data.
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 });
  }

  const kind  = req.nextUrl.searchParams.get('kind') ?? 'feedback';
  const round = Number(req.nextUrl.searchParams.get('round') ?? 2);
  const hasMessage = req.nextUrl.searchParams.get('message') !== 'false';

  const base      = `https://forms.mochipuworks.com/en/report/${kind === 'confirm' ? 'confirm' : 'feedback'}/example-id`;
  const reportUrl = `${base}?token=example-token`;
  const pdfUrl    = `${base}/pdf?token=example-token&mode=original`;

  let element: React.ReactElement;

  if (kind === 'confirm') {
    element = React.createElement(ConfirmToMochipu, {
      commissionName:    'Aiko Stream',
      clientEmail:       'client@example.com',
      locale:            'en',
      debutDateStatus:   'decided',
      debutDate:         '2026-06-19',
      additionalMessage: hasMessage
        ? 'Thank you so much for the wonderful work on the model. The fluidity is exactly what I hoped for.'
        : null,
      submittedAt:       'May 26, 2026, 1:53 PM',
      reportUrl,
      pdfUrl,
    });
  } else {
    const issues = [
      { order_index: 1, location: 'face',    type: 'model_error',    priority: 'high'   as const, expected: null, current_state: null, reference_url: null },
      { order_index: 2, location: 'hair',    type: 'adjust_physics', priority: 'medium' as const, expected: null, current_state: null, reference_url: null },
      { order_index: 3, location: 'body',    type: 'change_artwork', priority: 'low'    as const, expected: null, current_state: null, reference_url: null },
    ];
    element = React.createElement(FeedbackToMochipu, {
      commissionName: 'Aiko Stream',
      clientEmail:    'client@example.com',
      locale:         'en',
      feedbackRound:  round,
      issues,
      submittedAt:    'May 26, 2026, 1:53 PM',
      reportUrl,
      pdfUrl,
    });
  }

  const html = await render(element, { pretty: true });
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
