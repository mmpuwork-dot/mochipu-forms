import { IconRosetteDiscountCheck } from '@tabler/icons-react';
import { BilingualText } from './BilingualText';
import type { ConfirmReportData, DisplayMode, ReportTranslations } from './types';

interface Props {
  data: ConfirmReportData;
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

function formatDateLong(dateOnly: string): string {
  // "May 19, 2026" — accepts YYYY-MM-DD or full ISO
  const d = dateOnly.length === 10 ? new Date(dateOnly + 'T00:00:00') : new Date(dateOnly);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function dayOfWeek(dateOnly: string): string {
  return new Date(dateOnly + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
}

function daysFromConfirmation(debut: string, confirmedIso: string): string {
  const d = new Date(debut + 'T00:00:00').getTime();
  const c = new Date(confirmedIso).getTime();
  const days = Math.ceil((d - c) / (1000 * 60 * 60 * 24));
  if (days > 0) return `in ${days} day${days === 1 ? '' : 's'} from confirmation`;
  if (days === 0) return 'today';
  return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
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

const blockLabel = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.22em',
  fontWeight: 500,
  margin: 0,
};

// ── Component ─────────────────────────────────────────────────────────────────

export function ConfirmReport({ data, mode, translations, isPrint }: Props) {
  const confirmedAt = data.created_at;
  const debutDate   = data.debut_date_status === 'decided' && data.debut_date ? data.debut_date : null;
  const hasMessage  = Boolean(data.additional_message && data.additional_message.trim());

  return (
    <div style={{ background: 'white', maxWidth: isPrint ? '100%' : '860px', margin: '0 auto' }}>

      {/* ── HEADER ── */}
      <div style={{ background: 'white', padding: '32px 40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>

          {/* Left: brand eyebrow + report type + title + subtitle */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span style={{ width: '32px', height: '1px', background: '#1A1525', display: 'inline-block' }} />
              <p style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#1A1525', margin: 0 }}>
                Mochipu Live2D
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#6B5FA0', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, margin: '0 0 10px' }}>
              Delivery Report
            </p>
            <h1 style={{ fontSize: '31px', fontWeight: 400, color: '#1A1525', letterSpacing: '0.01em', margin: 0, lineHeight: 1.2 }}>
              {data.commission_name}
            </h1>
            <p style={{ fontSize: '12px', color: '#5D5470', margin: '8px 0 0' }}>
              Commission complete
            </p>
          </div>

          {/* Right: — Confirmed + date + time */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#6B5FA0', margin: '0 0 4px', fontWeight: 500 }}>
              — Confirmed
            </p>
            <p style={{ fontSize: '14px', color: '#1A1525', fontWeight: 500, margin: '0 0 2px' }}>
              {formatDate(confirmedAt)}
            </p>
            <p style={{ fontSize: '12px', color: '#5D5470', margin: 0 }}>
              {formatTime(confirmedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* ── DECORATIVE DIVIDER — 48px black + light purple ── */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(to right, #1A1525 0%, #1A1525 48px, #D9D2E8 48px, #D9D2E8 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── CONTENT ── */}
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
            <p style={microLabel}>Locale</p>
            <p style={{ fontSize: '14px', color: '#1A1525', fontWeight: 500, margin: 0 }}>
              {data.locale.toUpperCase()}
            </p>
          </div>
          <div>
            <p style={microLabel}>Confirmed at</p>
            <p style={{ fontSize: '13px', color: '#1A1525', margin: 0 }}>
              {formatDate(confirmedAt)}
            </p>
          </div>
        </div>

        {/* ── ⭐ EDITORIAL STAMP — STATUS BOX ── */}
        <div
          style={{
            background: '#FBFAFD',
            border: '1px solid #6FA94A',
            borderLeftWidth: '4px',
            padding: '20px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div
              style={{
                background: '#E8F4E8',
                border: '1.5px solid #6FA94A',
                width: '52px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconRosetteDiscountCheck size={28} color="#4A6B2A" stroke={1.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ ...blockLabel, fontSize: '11px', letterSpacing: '0.24em', color: '#4A6B2A', fontWeight: 600, margin: '0 0 6px' }}>
                — Commission complete
              </p>
              <p style={{ fontSize: '17px', color: '#1A1525', fontWeight: 500, lineHeight: 1.3, margin: '0 0 4px' }}>
                Successfully delivered &amp; confirmed
              </p>
              <p style={{ fontSize: '12px', color: '#5D5470', lineHeight: 1.5, margin: 0 }}>
                All deliverables approved by client on {formatDateLong(confirmedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ── DEBUT DATE — DECIDED ── */}
        {debutDate && (
          <div
            style={{
              background: '#FBFAFD',
              border: '0.5px solid #D9D2E8',
              padding: '16px',
              marginBottom: '14px',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-1px',
                left: '-1px',
                width: '28px',
                height: '2px',
                background: '#5A8BBF',
              }}
              aria-hidden="true"
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ ...blockLabel, color: '#6B5FA0' }}>
                — Estimated debut
              </p>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  background: '#EAF2FA',
                  color: '#2A5A8B',
                  border: '0.5px solid #B8D9F0',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Scheduled
              </span>
            </div>
            <p
              style={{
                fontSize: '22px',
                color: '#1A1525',
                fontWeight: 500,
                lineHeight: 1.2,
                margin: '0 0 6px',
                letterSpacing: '0.01em',
              }}
            >
              {formatDateLong(debutDate)}
            </p>
            <p style={{ fontSize: '11px', color: '#5D5470', margin: 0 }}>
              {dayOfWeek(debutDate)} · {daysFromConfirmation(debutDate, confirmedAt)}
            </p>
          </div>
        )}

        {/* ── DEBUT DATE — UNDECIDED ── */}
        {data.debut_date_status === 'undecided' && (
          <div
            style={{
              background: '#F4F2F7',
              border: '0.5px solid #D9D2E8',
              padding: '16px',
              marginBottom: '14px',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-1px',
                left: '-1px',
                width: '28px',
                height: '2px',
                background: '#A89FC2',
              }}
              aria-hidden="true"
            />
            <p style={{ ...blockLabel, color: '#A89FC2', margin: '0 0 6px' }}>
              — Estimated debut
            </p>
            <p style={{ fontSize: '15px', color: '#5D5470', margin: 0 }}>
              Undecided
            </p>
          </div>
        )}

        {/* ── CLIENT MESSAGE — only if exists ── */}
        {hasMessage && (
          <div
            style={{
              background: '#FBFAFD',
              border: '0.5px solid #D9D2E8',
              padding: '16px',
              marginBottom: '14px',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-1px',
                left: '-1px',
                width: '28px',
                height: '2px',
                background: '#6B5FA0',
              }}
              aria-hidden="true"
            />
            <p style={{ ...blockLabel, color: '#6B5FA0', margin: '0 0 10px' }}>
              — Client message
            </p>
            <BilingualText
              original={data.additional_message as string}
              translated={translations?.additional_message}
              locale={data.locale}
              mode={mode}
            />
          </div>
        )}

        {/* ── AGREEMENT — 2px black left edge ── */}
        <div
          style={{
            background: '#FBFAFD',
            border: '0.5px solid #D9D2E8',
            borderLeft: '2px solid #1A1525',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <p style={{ ...blockLabel, color: '#1A1525', margin: '0 0 8px' }}>
            — Commission agreement
          </p>
          <p style={{ fontSize: '13px', color: '#1A1525', lineHeight: 1.65, margin: '0 0 6px' }}>
            Client confirmed that{' '}
            <span style={{ fontWeight: 500 }}>this commission is complete</span>.{' '}
            Final files have been delivered and approved.
          </p>
          <p style={{ fontSize: '12px', color: '#5D5470', lineHeight: 1.6, margin: 0 }}>
            Future changes, updates, or additions will be treated as a new commission.
          </p>
        </div>

        {/* ── CLOSING MIRROR DIVIDER — block on RIGHT ── */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, #D9D2E8 0%, #D9D2E8 calc(100% - 48px), #1A1525 calc(100% - 48px), #1A1525 100%)',
            marginBottom: '14px',
          }}
          aria-hidden="true"
        />

        {/* ── FOOTER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '12px', color: '#A89FC2', margin: 0 }}>
            Mochipu Live2D · mochipuworks.com
          </p>
          <p style={{ fontSize: '12px', color: '#A89FC2', margin: 0 }}>
            Generated {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>
    </div>
  );
}
