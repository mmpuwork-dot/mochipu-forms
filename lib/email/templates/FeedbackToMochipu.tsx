import React from 'react';
import {
  Body, Button, Column, Container, Head, Hr, Html,
  Link, Preview, Row, Section, Text,
} from '@react-email/components';

// ─── Types ────────────────────────────────────────────────
// NOTE: per spec, this notification email is intentionally minimal —
// issue details live in the PDF report (linked from the buttons below),
// NOT in the email body. The `issues` array is used only to count priorities.
export interface FeedbackIssueRow {
  order_index: number;
  location: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  expected?: string | null;
  current_state?: string | null;
  reference_url?: string | null;
}

export interface FeedbackToMochipuProps {
  commissionName: string;
  clientEmail: string;
  locale: 'en' | 'ja' | 'zh';
  feedbackRound: number;
  issues: FeedbackIssueRow[];
  submittedAt: string;
  reportUrl: string;
  pdfUrl: string;
}

const LOCALE_BADGE: Record<string, string> = { en: 'EN', ja: 'JA', zh: 'ZH' };

const PRIORITY_PILL = {
  high:   { bg: '#F8E4E4', text: '#791F1F', border: '#D88C8C' },
  medium: { bg: '#FBEFD9', text: '#7A4D08', border: '#E0A14A' },
  low:    { bg: '#EDF4E6', text: '#4A6B2A', border: '#B8D198' },
};

// ─── Shared styles ────────────────────────────────────────
const s = {
  body: {
    background: '#F4F2F7',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    margin: 0,
    padding: '40px 0',
  } as React.CSSProperties,
  card: {
    maxWidth: '540px',
    margin: '0 auto',
    background: '#FBFAFD',
    border: '1px solid #D9D2E8',
  } as React.CSSProperties,
  brandLine: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.24em',
    textTransform: 'uppercase' as const,
    color: '#1A1525',
    margin: 0,
  },
  sectionLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    color: '#6B5FA0',
    margin: '0 0 10px',
  },
  metaLabel: {
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    color: '#A89FC2',
    margin: '0 0 3px',
  },
  primaryButton: {
    background: '#1A1525',
    color: '#FBFAFD',
    padding: '12px 18px',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'inline-block',
    border: '1px solid #1A1525',
  } as React.CSSProperties,
  secondaryButton: {
    background: '#FBFAFD',
    color: '#1A1525',
    padding: '12px 18px',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'inline-block',
    border: '1px solid #1A1525',
  } as React.CSSProperties,
  pill: (kind: keyof typeof PRIORITY_PILL) => ({
    fontSize: '12px',
    fontWeight: 500,
    background: PRIORITY_PILL[kind].bg,
    color: PRIORITY_PILL[kind].text,
    border: `0.5px solid ${PRIORITY_PILL[kind].border}`,
    padding: '4px 10px',
    margin: 0,
    display: 'inline-block',
  } as React.CSSProperties),
};

// ─── Component ────────────────────────────────────────────
export default function FeedbackToMochipu({
  commissionName,
  clientEmail,
  locale,
  feedbackRound,
  issues,
  submittedAt,
  reportUrl,
  pdfUrl,
}: FeedbackToMochipuProps) {
  const issueCount  = issues.length;
  const highCount   = issues.filter((i) => i.priority === 'high').length;
  const mediumCount = issues.filter((i) => i.priority === 'medium').length;
  const lowCount    = issues.filter((i) => i.priority === 'low').length;
  const showWarning = feedbackRound >= 4;

  return (
    <Html lang="en">
      <Head />
      <Preview>
        {`${showWarning ? '⚠ ' : ''}${commissionName} · Round ${feedbackRound} · ${issueCount} item${issueCount !== 1 ? 's' : ''}`}
      </Preview>
      <Body style={s.body}>
        <Container style={s.card}>

          {/* ── Header ── */}
          <Section style={{ padding: '32px 36px 20px' }}>
            <Row style={{ marginBottom: '20px' }}>
              <Column>
                <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
                  <tbody><tr>
                    <td style={{ width: '32px', paddingRight: '10px', verticalAlign: 'middle' }}>
                      <div style={{ height: '1px', background: '#1A1525', width: '100%' }} />
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <Text style={s.brandLine}>Mochipu Live2D</Text>
                    </td>
                  </tr></tbody>
                </table>
              </Column>
            </Row>

            <Text style={s.sectionLabel}>— New feedback received</Text>
            <Text style={{
              fontSize: '26px', fontWeight: 400, color: '#1A1525',
              margin: '0 0 8px', lineHeight: '1.2', letterSpacing: '-0.01em',
            }}>
              {commissionName}
            </Text>
            <Text style={{ fontSize: '13px', color: '#5D5470', margin: 0 }}>
              Round {feedbackRound} · {issueCount} item{issueCount !== 1 ? 's' : ''} · {LOCALE_BADGE[locale]}
            </Text>
          </Section>

          {/* ── Round 4+ warning bar ── */}
          {showWarning && (
            <Section style={{ padding: '0 36px 20px' }}>
              <div style={{
                background: '#F8E4E4',
                border: '1px solid #D88C8C',
                borderLeft: '3px solid #C04A6A',
                padding: '12px 14px',
              }}>
                <Text style={{
                  fontSize: '12px', color: '#791F1F', fontWeight: 500,
                  margin: 0, lineHeight: '1.5',
                }}>
                  ⚠ Round {feedbackRound} reached — consider charging
                </Text>
              </div>
            </Section>
          )}

          <Hr style={{ borderColor: '#D9D2E8', margin: '0 36px' }} />

          {/* ── Info row: From + Submitted ── */}
          <Section style={{ padding: '20px 36px 4px' }}>
            <Row>
              <Column>
                <Text style={s.metaLabel}>From</Text>
                <Link href={`mailto:${clientEmail}`} style={{
                  fontSize: '12px', color: '#6B5FA0', textDecoration: 'none',
                }}>
                  {clientEmail}
                </Link>
              </Column>
              <Column align="right" style={{ verticalAlign: 'top' }}>
                <Text style={s.metaLabel}>Submitted</Text>
                <Text style={{ fontSize: '12px', color: '#5D5470', margin: 0 }}>
                  {submittedAt}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── Priority breakdown ── */}
          <Section style={{ padding: '20px 36px 24px' }}>
            <Text style={s.sectionLabel}>— Priority breakdown</Text>
            <table cellPadding={0} cellSpacing={0}>
              <tbody><tr>
                {highCount > 0 && (
                  <td style={{ paddingRight: '6px' }}>
                    <Text style={s.pill('high')}>{highCount} High</Text>
                  </td>
                )}
                {mediumCount > 0 && (
                  <td style={{ paddingRight: '6px' }}>
                    <Text style={s.pill('medium')}>{mediumCount} Medium</Text>
                  </td>
                )}
                {lowCount > 0 && (
                  <td style={{ paddingRight: '6px' }}>
                    <Text style={s.pill('low')}>{lowCount} Low</Text>
                  </td>
                )}
              </tr></tbody>
            </table>
          </Section>

          <Hr style={{ borderColor: '#EBE6F2', margin: '0 36px' }} />

          {/* ── Buttons ── */}
          <Section style={{ padding: '24px 36px 18px' }}>
            <table cellPadding={0} cellSpacing={0}>
              <tbody><tr>
                <td style={{ paddingRight: '8px' }}>
                  <Button href={reportUrl} style={s.primaryButton}>
                    📄 View Full Report
                  </Button>
                </td>
                <td>
                  <Button href={pdfUrl} style={s.secondaryButton}>
                    ⬇ Download PDF
                  </Button>
                </td>
              </tr></tbody>
            </table>
            <Text style={{
              fontSize: '11px', color: '#A89FC2', margin: '14px 0 0', lineHeight: '1.5',
            }}>
              View link is private — please don&apos;t share.
            </Text>
          </Section>

          {/* ── Footer ── */}
          <Hr style={{ borderColor: '#EBE6F2', margin: 0 }} />
          <Section style={{ padding: '16px 36px' }}>
            <Text style={{
              fontSize: '11px', color: '#A89FC2', margin: 0, textAlign: 'center',
            }}>
              Mochipu Live2D · forms.mochipuworks.com
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
