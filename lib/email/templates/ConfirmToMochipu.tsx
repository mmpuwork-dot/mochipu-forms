import React from 'react';
import {
  Body, Button, Column, Container, Head, Hr, Html,
  Preview, Row, Section, Text, Link,
} from '@react-email/components';

export interface ConfirmToMochipuProps {
  commissionName: string;
  clientEmail: string;
  locale: 'en' | 'ja' | 'zh';
  debutDateStatus: 'decided' | 'undecided';
  debutDate?: string | null;
  additionalMessage?: string | null;
  submittedAt: string;
  reportUrl: string;
  pdfUrl: string;
}

const LOCALE_BADGE: Record<string, string> = { en: 'EN', ja: 'JA', zh: 'ZH' };

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (locale === 'zh') return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  if (locale === 'ja') return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

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
  metaLabel: {
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: '#A89FC2',
    margin: '0 0 3px',
  },
  metaValue: {
    fontSize: '13px',
    color: '#2C2540',
    margin: '0 0 14px',
    lineHeight: '1.5',
  },
};

export default function ConfirmToMochipu({
  commissionName,
  clientEmail,
  locale,
  debutDateStatus,
  debutDate,
  additionalMessage,
  submittedAt,
  reportUrl,
  pdfUrl,
}: ConfirmToMochipuProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>[Delivery Confirmed] {commissionName}</Preview>
      <Body style={s.body}>
        <Container style={s.card}>

          {/* ── Header ── */}
          <Section style={{ padding: '32px 36px 24px' }}>
            <Row style={{ marginBottom: '24px' }}>
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

            <Row>
              <Column>
                <Text style={{
                  fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: '#6FA94A', margin: '0 0 10px',
                }}>
                  Delivery Confirmed ✓
                </Text>
                <Text style={{
                  fontSize: '26px', fontWeight: 400, color: '#1A1525',
                  margin: '0 0 12px', lineHeight: '1.2', letterSpacing: '-0.01em',
                }}>
                  {commissionName}
                </Text>
                <Text style={{ fontSize: '12px', color: '#A89FC2', margin: '0 0 4px' }}>
                  {LOCALE_BADGE[locale]} · {submittedAt}
                </Text>
                <Link href={`mailto:${clientEmail}`} style={{ fontSize: '12px', color: '#6B5FA0', textDecoration: 'none' }}>
                  {clientEmail}
                </Link>
              </Column>
              <Column align="right" style={{ verticalAlign: 'top' }}>
                <Text style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                  background: '#EDF4E6', color: '#4A6B2A',
                  padding: '5px 10px', margin: 0,
                }}>
                  COMPLETE
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#D9D2E8', margin: '0 36px' }} />

          {/* ── Details ── */}
          <Section style={{ padding: '24px 36px' }}>

            {/* Debut date */}
            <Text style={s.metaLabel}>Debut Date</Text>
            {debutDateStatus === 'decided' && debutDate ? (
              <Text style={{ ...s.metaValue, color: '#5A8BBF', fontWeight: 500 }}>
                {formatDate(debutDate, locale)}
              </Text>
            ) : (
              <Text style={{ ...s.metaValue, color: '#A89FC2' }}>Not decided yet</Text>
            )}

            {/* Additional message */}
            {additionalMessage && (
              <>
                <Text style={s.metaLabel}>Message from client</Text>
                <div style={{
                  background: '#F4F2F7',
                  borderLeft: '2px solid #C9C0DD',
                  padding: '12px 14px',
                  marginBottom: '14px',
                }}>
                  <Text style={{ fontSize: '13px', color: '#2C2540', margin: 0, lineHeight: '1.65' }}>
                    {additionalMessage}
                  </Text>
                </div>
              </>
            )}

          </Section>

          <Hr style={{ borderColor: '#EBE6F2', margin: '0 36px' }} />

          {/* ── Buttons ── */}
          <Section style={{ padding: '24px 36px 18px' }}>
            <table cellPadding={0} cellSpacing={0}>
              <tbody><tr>
                <td style={{ paddingRight: '8px' }}>
                  <Button
                    href={reportUrl}
                    style={{
                      background: '#1A1525',
                      color: '#FBFAFD',
                      padding: '12px 18px',
                      fontSize: '13px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      display: 'inline-block',
                      border: '1px solid #1A1525',
                    }}
                  >
                    📄 View Full Report
                  </Button>
                </td>
                <td>
                  <Button
                    href={pdfUrl}
                    style={{
                      background: '#FBFAFD',
                      color: '#1A1525',
                      padding: '12px 18px',
                      fontSize: '13px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      display: 'inline-block',
                      border: '1px solid #1A1525',
                    }}
                  >
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
            <Text style={{ fontSize: '11px', color: '#A89FC2', margin: 0, textAlign: 'center' }}>
              Mochipu Live2D · forms.mochipuworks.com
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
