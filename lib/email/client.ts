import React from 'react';
import { Resend } from 'resend';
import { MOCHIPU_EMAIL } from '@/lib/constants';
import type { FeedbackSubmission, FeedbackIssue, DeliveryConfirmation } from '@/lib/supabase/types';

import FeedbackToMochipu from './templates/FeedbackToMochipu';
import FeedbackToClient  from './templates/FeedbackToClient';
import ConfirmToMochipu  from './templates/ConfirmToMochipu';
import ConfirmToClient   from './templates/ConfirmToClient';

// Lazy-init the Resend client so Next.js's `next build` can statically
// analyse the API routes without RESEND_API_KEY being present (Cloudflare
// only injects secrets at runtime, not at build time).
let _resend: Resend | undefined;
function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set.');
  _resend = new Resend(key);
  return _resend;
}

const FROM       = process.env.RESEND_FROM ?? 'Mochipu Live2D <noreply@mochipuworks.com>';
const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://forms.mochipuworks.com';

function formatSubmittedAt(dateStr: string): string {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
}

function buildReportUrl(
  kind: 'feedback' | 'confirm',
  locale: string,
  id: string,
  token: string,
): string {
  return `${SITE_URL}/${locale}/report/${kind}/${id}?token=${token}`;
}

function buildPdfUrl(
  kind: 'feedback' | 'confirm',
  locale: string,
  id: string,
  token: string,
): string {
  return `${SITE_URL}/${locale}/report/${kind}/${id}/pdf?token=${token}&mode=original`;
}

// ─── Feedback emails ──────────────────────────────────────
export async function sendFeedbackEmails(
  submission: FeedbackSubmission,
  issues: FeedbackIssue[],
) {
  const submittedAt = formatSubmittedAt(submission.created_at);
  const reportUrl   = buildReportUrl('feedback', submission.locale, submission.id, submission.access_token);
  const pdfUrl      = buildPdfUrl('feedback', submission.locale, submission.id, submission.access_token);

  // Subject per spec — `⚠` prefix when round ≥ 4
  const warn = submission.feedback_round >= 4 ? '⚠' : '';
  const itemWord = issues.length === 1 ? 'item' : 'items';
  const mochipuSubject = `📬${warn} ${submission.commission_name} · Round ${submission.feedback_round} · ${issues.length} ${itemWord}`;

  // Issue summary for client receipt (still uses titles for short preview)
  const issueSummary = issues.map((issue) => ({
    num: String(issue.order_index).padStart(2, '0'),
    title: (issue.expected ?? '').trim().slice(0, 40) || (issue.current_state ?? '').trim().slice(0, 40),
    priority: issue.priority,
  }));

  await Promise.all([
    // 1. Notification to Mochipu — minimal, all detail lives in the linked PDF report
    getResend().emails.send({
      from: FROM,
      to: MOCHIPU_EMAIL,
      replyTo: submission.email,
      subject: mochipuSubject,
      react: React.createElement(FeedbackToMochipu, {
        commissionName: submission.commission_name,
        clientEmail:    submission.email,
        locale:         submission.locale,
        feedbackRound:  submission.feedback_round,
        issues:         issues.map((i) => ({
          order_index:   i.order_index,
          location:      i.location,
          type:          Array.isArray(i.type) ? i.type[0] : i.type,
          priority:      i.priority,
          expected:      i.expected,
          current_state: i.current_state,
          reference_url: i.reference_url,
        })),
        submittedAt,
        reportUrl,
        pdfUrl,
      }),
    }),

    // 2. Receipt to client — never includes report link (reports are private)
    getResend().emails.send({
      from: FROM,
      to: submission.email,
      subject:
        submission.locale === 'ja' ? `フィードバックを受け付けました — ${submission.commission_name}` :
        submission.locale === 'zh' ? `已收到您的反饋 — ${submission.commission_name}` :
        `Feedback received — ${submission.commission_name}`,
      react: React.createElement(FeedbackToClient, {
        commissionName: submission.commission_name,
        locale:         submission.locale,
        issueCount:     issues.length,
        issueSummary,
      }),
    }),
  ]);
}

// ─── Confirm emails ───────────────────────────────────────
export async function sendConfirmationEmails(confirmation: DeliveryConfirmation) {
  const submittedAt = formatSubmittedAt(confirmation.created_at);
  const reportUrl   = buildReportUrl('confirm', confirmation.locale, confirmation.id, confirmation.access_token);
  const pdfUrl      = buildPdfUrl('confirm', confirmation.locale, confirmation.id, confirmation.access_token);

  await Promise.all([
    // 1. Notification to Mochipu
    getResend().emails.send({
      from: FROM,
      to: MOCHIPU_EMAIL,
      replyTo: confirmation.email,
      subject: `✅ ${confirmation.commission_name} · Delivery confirmed`,
      react: React.createElement(ConfirmToMochipu, {
        commissionName:    confirmation.commission_name,
        clientEmail:       confirmation.email,
        locale:            confirmation.locale,
        debutDateStatus:   confirmation.debut_date_status,
        debutDate:         confirmation.debut_date,
        additionalMessage: confirmation.additional_message,
        submittedAt,
        reportUrl,
        pdfUrl,
      }),
    }),

    // 2. Receipt to client — never includes report link
    getResend().emails.send({
      from: FROM,
      to: confirmation.email,
      subject:
        // Warmer, more personal subjects (the prior "Delivery confirmed"
        // wording triggers Gmail's e-commerce/spam heuristics on a brand-new
        // sender domain). Keep the commission name so threads still group.
        confirmation.locale === 'ja' ? `ご確認ありがとうございました — ${confirmation.commission_name}` :
        confirmation.locale === 'zh' ? `感謝您完成確認 — ${confirmation.commission_name}` :
        `Thank you for your confirmation — ${confirmation.commission_name}`,
      react: React.createElement(ConfirmToClient, {
        commissionName: confirmation.commission_name,
        locale:         confirmation.locale,
        debutDate:      confirmation.debut_date,
        mochipuEmail:   MOCHIPU_EMAIL,
      }),
    }),
  ]);
}
