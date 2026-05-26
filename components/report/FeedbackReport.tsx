import { RoundCard } from './RoundCard';
import { ReportIssueCard } from './IssueCard';
import type { FeedbackReportData, DisplayMode, ReportTranslations } from './types';

interface Props {
  data: FeedbackReportData;
  mode: DisplayMode;
  translations?: ReportTranslations;
  isPrint?: boolean;
}

// ── Date helpers ─────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', {
    timeZone: 'Asia/Shanghai',
  }).replace(/-/g, '.');
}

function formatTime(iso: string): string {
  return (
    new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Shanghai',
    }) + ' (UTC+8)'
  );
}

// ── Shared style atoms ────────────────────────────────────────────────────────

const microLabel = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.16em',
  color: '#6B5FA0',
  fontWeight: 500,
  margin: '0 0 4px',
};

// ── Component ─────────────────────────────────────────────────────────────────

export function FeedbackReport({ data, mode, translations, isPrint }: Props) {
  const itemCount   = data.issues.length;
  const highCount   = data.issues.filter((i) => i.priority === 'high').length;
  const mediumCount = data.issues.filter((i) => i.priority === 'medium').length;
  const lowCount    = data.issues.filter((i) => i.priority === 'low').length;
  const sorted      = [...data.issues].sort((a, b) => a.order_index - b.order_index);

  return (
    <div style={{ background: 'white', maxWidth: isPrint ? '100%' : '860px', margin: '0 auto' }}>

      {/* ── Header — WHITE background ── */}
      <div style={{ background: 'white', padding: '32px 40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>

          {/* Left: brand eyebrow + report type + title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span style={{ width: '32px', height: '1px', background: '#1A1525', display: 'inline-block' }} />
              <p style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#1A1525', margin: 0 }}>
                Mochipu Live2D
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#6B5FA0', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, margin: '0 0 10px' }}>
              Feedback Report
            </p>
            <h1 style={{ fontSize: '31px', fontWeight: 400, color: '#1A1525', letterSpacing: '0.01em', margin: 0, lineHeight: 1.2 }}>
              {data.commission_name}
            </h1>
          </div>

          {/* Right: Round card + Submitted timestamp */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexShrink: 0 }}>
            <RoundCard round={data.feedback_round} />
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#6B5FA0', margin: '0 0 4px', fontWeight: 500 }}>
                — Submitted
              </p>
              <p style={{ fontSize: '14px', color: '#1A1525', fontWeight: 500, margin: '0 0 2px' }}>
                {formatDate(data.created_at)}
              </p>
              <p style={{ fontSize: '12px', color: '#5D5470', margin: 0 }}>
                {formatTime(data.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Decorative divider — 48px black + light purple ── */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(to right, #1A1525 0%, #1A1525 48px, #D9D2E8 48px, #D9D2E8 100%)',
        }}
      />

      {/* ── Content area ── */}
      <div style={{ padding: '28px 40px' }}>

        {/* 4-column summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div>
            <p style={microLabel}>Client</p>
            <p style={{ fontSize: '14px', color: '#1A1525', fontWeight: 500, margin: 0 }}>
              {data.commission_name}
            </p>
          </div>
          <div>
            <p style={microLabel}>Email</p>
            <p style={{ fontSize: '13px', color: '#1A1525', margin: 0, wordBreak: 'break-all' }}>
              {data.email}
            </p>
          </div>
          <div>
            <p style={microLabel}>Round</p>
            <p style={{ fontSize: '14px', color: '#1A1525', fontWeight: 500, margin: 0 }}>
              #{data.feedback_round}
            </p>
          </div>
          <div>
            <p style={microLabel}>Total Items</p>
            <p style={{ fontSize: '14px', color: '#1A1525', fontWeight: 500, margin: 0 }}>
              {itemCount}
            </p>
          </div>
        </div>

        {/* Priority breakdown */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ width: '16px', height: '1px', background: '#6B5FA0', display: 'inline-block' }} />
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.22em', color: '#6B5FA0', fontWeight: 500, margin: 0 }}>
              Priority Breakdown
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {highCount > 0 && (
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#791F1F', background: '#F8E4E4', border: '0.5px solid #D88C8C', padding: '3px 10px' }}>
                {highCount} High
              </span>
            )}
            {mediumCount > 0 && (
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#7A4D08', background: '#FBEFD9', border: '0.5px solid #E0A14A', padding: '3px 10px' }}>
                {mediumCount} Medium
              </span>
            )}
            {lowCount > 0 && (
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#4A6B2A', background: '#EDF4E6', border: '0.5px solid #B8D198', padding: '3px 10px' }}>
                {lowCount} Low
              </span>
            )}
          </div>
        </div>

        {/* Issue cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sorted.map((issue, i) => (
            <ReportIssueCard
              key={issue.id}
              issue={issue}
              index={i}
              mode={mode}
              translations={translations?.issues?.[i]}
              locale={data.locale}
            />
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: '0.5px solid #D9D2E8',
          padding: '12px 40px',
          background: '#F4F2F7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: '12px', color: '#A89FC2', margin: 0 }}>
          Mochipu Live2D · mochipuworks.com
        </p>
        <p style={{ fontSize: '12px', color: '#A89FC2', margin: 0 }}>
          Generated {formatDate(new Date().toISOString())}
        </p>
      </div>
    </div>
  );
}
