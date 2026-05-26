import React from 'react';
import {
  Body, Column, Container, Head, Hr, Html,
  Link, Preview, Row, Section, Text,
} from '@react-email/components';

export interface ConfirmToClientProps {
  commissionName: string;
  locale: 'en' | 'ja' | 'zh';
  debutDate?: string | null;
  mochipuEmail: string;
  snsHandle: string;
}

// ─── i18n ────────────────────────────────────────────────
const T = {
  en: {
    preview: (n: string) => `Delivery confirmed — ${n}`,
    tag: 'Commission Complete',
    title: 'Congratulations on your new model.',
    message: "Thank you for trusting me with this commission. It's been a pleasure working with you — I can't wait to see this character brought to life.",
    debutLabel: 'Debut date noted',
    debutNote: "I'll be cheering you on that day! If you'd like, feel free to tag me when you debut.",
    emailLabel: 'Confirmation sent to',
    futureLabel: 'Future commissions',
    futureNote: (email: string) => `Feel free to reach out at ${email} anytime.`,
    snsLabel: 'Stay connected',
    snsNote: (handle: string) => `Follow ${handle} for more of my work.`,
    footer: 'Mochipu Live2D · forms.mochipuworks.com',
  },
  ja: {
    preview: (n: string) => `納品を確認いたしました — ${n}`,
    tag: 'ご依頼完了',
    title: '新しいモデル、おめでとうございます。',
    message: 'このたびはご依頼いただき、誠にありがとうございました。一緒にお仕事できて光栄でございました。このキャラクターが生き生きと動き出す姿を楽しみにしております。',
    debutLabel: 'デビュー日を記録いたしました',
    debutNote: 'その日は応援しております。もしよろしければ、デビュー時にタグ付けしていただけますと嬉しく存じます。',
    emailLabel: '確認メール送信先',
    futureLabel: '今後のご依頼',
    futureNote: (email: string) => `${email} までお気軽にどうぞ。`,
    snsLabel: 'SNS',
    snsNote: (handle: string) => `作品をもっと見たい方は ${handle} をフォローしてくださいませ。`,
    footer: 'Mochipu Live2D · forms.mochipuworks.com',
  },
  zh: {
    preview: (n: string) => `收貨確認完成 — ${n}`,
    tag: '委託完成',
    title: '恭喜您擁有新模型。',
    message: '感謝您信任我完成這次委託。能與您合作真的非常開心 — 期待看見這個角色因您而活起來。',
    debutLabel: '已記錄出道日',
    debutNote: '我會在那天為您加油的！如果方便，出道時 tag 我一下。',
    emailLabel: '確認副本已寄送至',
    futureLabel: '未來委託',
    futureNote: (email: string) => `歡迎直接寄信至 ${email}。`,
    snsLabel: '追蹤更多作品',
    snsNote: (handle: string) => `追蹤 ${handle} 查看更多。`,
    footer: 'Mochipu Live2D · forms.mochipuworks.com',
  },
};

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (locale === 'zh') return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  if (locale === 'ja') return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

// ─── Info row component ───────────────────────────────────
function InfoRow({ label, value, isLink, href }: {
  label: string; value: string; isLink?: boolean; href?: string;
}) {
  return (
    <table cellPadding={0} cellSpacing={0} style={{ width: '100%', borderTop: '1px solid #EBE6F2' }}>
      <tbody><tr>
        <td style={{ padding: '12px 0', verticalAlign: 'middle' }}>
          <Text style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A89FC2', margin: '0 0 2px' }}>
            {label}
          </Text>
          {isLink && href ? (
            <Link href={href} style={{ fontSize: '12.5px', color: '#6B5FA0', textDecoration: 'none' }}>{value}</Link>
          ) : (
            <Text style={{ fontSize: '12.5px', color: '#5D5470', margin: 0, lineHeight: '1.55' }}>{value}</Text>
          )}
        </td>
      </tr></tbody>
    </table>
  );
}

export default function ConfirmToClient({
  commissionName,
  locale,
  debutDate,
  mochipuEmail,
  snsHandle,
}: ConfirmToClientProps) {
  const t = T[locale];
  const isCJK = locale !== 'en';

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{t.preview(commissionName)}</Preview>
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
            <Row style={{ marginBottom: '32px' }}>
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

          {/* ── Sparkle icon ── */}
          <Section style={{ padding: '0 36px' }}>
            <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '28px' }}>
              <tbody><tr>
                <td style={{
                  width: '56px', height: '56px',
                  border: '1px solid #B8D9F0',
                  background: '#EAF2FA',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                }}>
                  <Text style={{ fontSize: '24px', margin: 0, lineHeight: 1 }}>✦</Text>
                </td>
              </tr></tbody>
            </table>

            <Text style={{
              fontSize: '10px', fontWeight: 600, color: '#5A8BBF', margin: '0 0 12px',
              letterSpacing: isCJK ? '0.05em' : '0.22em',
              textTransform: isCJK ? 'none' : 'uppercase',
            }}>
              {t.tag}
            </Text>
            <Text style={{
              fontSize: '26px', fontWeight: 400, color: '#1A1525',
              margin: '0 0 16px', lineHeight: '1.2',
              letterSpacing: isCJK ? '0.02em' : '-0.01em',
            }}>
              {t.title}
            </Text>
            <Text style={{
              fontSize: '13px', color: '#5D5470',
              margin: '0 0 32px',
              lineHeight: isCJK ? '1.8' : '1.65',
            }}>
              {t.message}
            </Text>
          </Section>

          {/* ── Debut date card ── */}
          {debutDate && (
            <Section style={{ padding: '0 36px 24px' }}>
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #D9D2E8',
                borderLeft: '3px solid #5A8BBF',
                padding: '16px 18px',
              }}>
                <Text style={{
                  fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#5A8BBF', margin: '0 0 6px',
                }}>
                  {t.debutLabel}
                </Text>
                <Text style={{
                  fontSize: '15px', fontWeight: 500, color: '#1A1525',
                  margin: '0 0 8px', letterSpacing: isCJK ? '0.02em' : '0',
                }}>
                  {formatDate(debutDate, locale)}
                </Text>
                <Text style={{ fontSize: '12px', color: '#5D5470', margin: 0, lineHeight: '1.6' }}>
                  {t.debutNote}
                </Text>
              </div>
            </Section>
          )}

          {/* ── Info rows ── */}
          <Section style={{ padding: '0 36px 32px' }}>
            <InfoRow
              label={t.futureLabel}
              value={t.futureNote(mochipuEmail)}
              isLink
              href={`mailto:${mochipuEmail}`}
            />
            <InfoRow
              label={t.snsLabel}
              value={t.snsNote(snsHandle)}
              isLink
              href={`https://twitter.com/${snsHandle.replace('@', '')}`}
            />
            <div style={{ borderTop: '1px solid #EBE6F2' }} />
          </Section>

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
