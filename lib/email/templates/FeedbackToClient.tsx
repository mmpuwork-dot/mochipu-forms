import React from 'react';
import {
  Body, Column, Container, Head, Hr, Html,
  Link, Preview, Row, Section, Text,
} from '@react-email/components';

export interface FeedbackToClientProps {
  commissionName: string;
  locale: 'en' | 'ja' | 'zh';
  issueCount: number;
  issueSummary: Array<{
    num: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

// ─── i18n ────────────────────────────────────────────────
const T = {
  en: {
    preview: (n: string, c: number) => `Feedback received — ${c} item${c !== 1 ? 's' : ''} from ${n}`,
    tag: 'Feedback Received',
    title: (name: string) => `Thank you, ${name}.`,
    message: (count: number) =>
      `I've received your ${count} feedback item${count !== 1 ? 's' : ''}. I'll review everything carefully and get back to you in a few days.`,
    summaryLabel: 'SUBMISSION SUMMARY',
    priorityMap: { high: 'High', medium: 'Med', low: 'Low' },
    footer: 'Mochipu Live2D · forms.mochipuworks.com',
  },
  ja: {
    preview: (n: string, c: number) => `フィードバックを受け付けました — ${n} 様より ${c} 件`,
    tag: 'フィードバック受領',
    title: (name: string) => `${name}様、ありがとうございます。`,
    message: (count: number) =>
      `${count} 件のフィードバックを受領いたしました。丁寧に確認のうえ、数日以内にご連絡いたします。`,
    summaryLabel: '送信内容',
    priorityMap: { high: '高', medium: '中', low: '低' },
    footer: 'Mochipu Live2D · forms.mochipuworks.com',
  },
  zh: {
    preview: (n: string, c: number) => `已收到您的反饋 — ${n}，共 ${c} 個項目`,
    tag: '已收到反饋',
    title: (name: string) => `謝謝您，${name}。`,
    message: (count: number) =>
      `已收到您的 ${count} 個反饋項目。我會仔細檢視，並在數日內回覆您下一步的進度。`,
    summaryLabel: '提交摘要',
    priorityMap: { high: '高', medium: '中', low: '低' },
    footer: 'Mochipu Live2D · forms.mochipuworks.com',
  },
};

const PRIORITY_COLOR: Record<string, { bg: string; text: string }> = {
  high:   { bg: '#F8E4E4', text: '#791F1F' },
  medium: { bg: '#FBEFD9', text: '#7A4D08' },
  low:    { bg: '#EDF4E6', text: '#4A6B2A' },
};

export default function FeedbackToClient({
  commissionName,
  locale,
  issueCount,
  issueSummary,
}: FeedbackToClientProps) {
  const t = T[locale];

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{t.preview(commissionName, issueCount)}</Preview>
      <Body style={{
        background: '#F4F2F7',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        margin: 0,
        padding: '40px 0',
      }}>
        <Container style={{
          maxWidth: '540px',
          margin: '0 auto',
          background: '#FBFAFD',
          border: '1px solid #D9D2E8',
        }}>

          {/* ── Header ── */}
          <Section style={{ padding: '36px 36px 0' }}>
            <Row style={{ marginBottom: '28px' }}>
              <Column>
                <table cellPadding={0} cellSpacing={0}>
                  <tbody><tr>
                    <td style={{ width: '32px', paddingRight: '10px', verticalAlign: 'middle' }}>
                      <div style={{ height: '1px', background: '#1A1525', width: '100%' }} />
                    </td>
                    <td>
                      <Text style={{
                        fontSize: '10px', fontWeight: 600, letterSpacing: '0.24em',
                        textTransform: 'uppercase', color: '#1A1525', margin: 0,
                      }}>
                        Mochipu Live2D
                      </Text>
                    </td>
                  </tr></tbody>
                </table>
              </Column>
            </Row>
          </Section>

          {/* ── Hero ── */}
          <Section style={{ padding: '0 36px' }}>
            {/* Check icon */}
            <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '28px' }}>
              <tbody><tr>
                <td style={{
                  width: '52px', height: '52px',
                  border: '1px solid #B8D9F0',
                  background: '#EAF2FA',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                }}>
                  <Text style={{ fontSize: '22px', margin: 0, lineHeight: 1 }}>✓</Text>
                </td>
              </tr></tbody>
            </table>

            <Text style={{
              fontSize: '10px', fontWeight: 600,
              letterSpacing: locale === 'en' ? '0.22em' : '0.05em',
              textTransform: locale === 'en' ? 'uppercase' : 'none',
              color: '#5A8BBF', margin: '0 0 12px',
            }}>
              {t.tag}
            </Text>
            <Text style={{
              fontSize: '26px', fontWeight: 400, color: '#1A1525',
              margin: '0 0 16px', lineHeight: '1.2',
              letterSpacing: locale === 'en' ? '-0.01em' : '0.02em',
            }}>
              {t.title(commissionName)}
            </Text>
            <Text style={{
              fontSize: '13px', color: '#5D5470', margin: '0 0 28px',
              lineHeight: locale === 'en' ? '1.65' : '1.8',
            }}>
              {t.message(issueCount)}
            </Text>
          </Section>

          {/* ── Issue summary ── */}
          {issueSummary.length > 0 && (
            <Section style={{ padding: '0 36px 32px' }}>
              <div style={{
                border: '1px solid #D9D2E8',
                background: '#FFFFFF',
                padding: '16px 18px',
              }}>
                <Text style={{
                  fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#6B5FA0',
                  margin: '0 0 12px',
                }}>
                  {t.summaryLabel}
                </Text>
                {issueSummary.map(({ num, title, priority }, i, arr) => {
                  const p = PRIORITY_COLOR[priority] ?? PRIORITY_COLOR.medium;
                  return (
                    <table
                      key={num}
                      cellPadding={0}
                      cellSpacing={0}
                      style={{
                        width: '100%',
                        borderBottom: i < arr.length - 1 ? '1px solid #EBE6F2' : 'none',
                      }}
                    >
                      <tbody><tr>
                        <td style={{ padding: '7px 0', verticalAlign: 'middle' }}>
                          <Text style={{ fontSize: '12px', color: '#5D5470', margin: 0 }}>
                            {num}{title ? ` · ${title}` : ''}
                          </Text>
                        </td>
                        <td style={{ textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap', paddingLeft: '12px' }}>
                          <Text style={{
                            fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
                            background: p.bg, color: p.text,
                            padding: '2px 7px', margin: 0,
                          }}>
                            {t.priorityMap[priority] ?? priority}
                          </Text>
                        </td>
                      </tr></tbody>
                    </table>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── Footer ── */}
          <Hr style={{ borderColor: '#EBE6F2', margin: 0 }} />
          <Section style={{ padding: '18px 36px' }}>
            <Text style={{ fontSize: '11px', color: '#A89FC2', margin: 0, textAlign: 'center' }}>
              {t.footer}
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
