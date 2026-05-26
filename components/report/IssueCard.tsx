import type { CSSProperties } from 'react';
import { getPriorityStyle, generateIssueTitle, LOCATION_LABELS, TYPE_LABELS } from './utils';
import { PriorityBadge } from './PriorityBadge';
import { BilingualText } from './BilingualText';
import { ReferenceSection } from './ReferenceSection';
import type { FeedbackIssue } from '@/lib/supabase/types';
import type { DisplayMode, IssueTranslations } from './types';

interface Props {
  issue: FeedbackIssue;
  index: number;
  mode: DisplayMode;
  translations?: IssueTranslations;
  locale: string;
}

const sectionLabelStyle: CSSProperties = {
  fontSize: '11px',
  color: '#6B5FA0',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  fontWeight: 500,
  margin: '0 0 5px',
};

export function ReportIssueCard({ issue, index, mode, translations, locale }: Props) {
  const s   = getPriorityStyle(issue.priority);
  const num = String(index + 1).padStart(2, '0');

  // Short text title from description
  const rawTitle = generateIssueTitle(issue.expected, issue.current_state);

  // Type + Location chips
  const typeStr      = Array.isArray(issue.type) ? (issue.type as string[])[0] : (issue.type as unknown as string);
  const locationLabel = LOCATION_LABELS[issue.location] ?? issue.location;
  const typeLabel     = TYPE_LABELS[typeStr]             ?? typeStr;

  return (
    <div
      style={{
        background: '#FBFAFD',
        border: '0.5px solid #D9D2E8',
        borderLeft: `3px solid ${s.accent}`,
        padding: '14px 16px',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      {/* ── Header: number / title / priority badge ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '11px',
              color: '#A89FC2',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 500,
              margin: '0 0 4px',
            }}
          >
            {num} Issue
          </p>
          {mode === 'bilingual' && translations?.title ? (
            <BilingualText
              original={rawTitle}
              translated={translations.title}
              locale={locale}
              mode={mode}
            />
          ) : (
            <p
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#1A1525',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {mode === 'translated' && translations?.title ? translations.title : rawTitle}
            </p>
          )}
        </div>
        <PriorityBadge priority={issue.priority} />
      </div>

      {/* ── Type + Location chips ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
        {[typeLabel, locationLabel].map((label) => (
          <span
            key={label}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '2px 8px',
              background: '#F4F2F7',
              border: '0.5px solid #D9D2E8',
              color: '#5D5470',
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* ── Expected ── */}
      {issue.expected && (
        <div style={{ marginBottom: '10px' }}>
          <p style={sectionLabelStyle}>— Expected</p>
          <BilingualText
            original={issue.expected}
            translated={translations?.expected}
            locale={locale}
            mode={mode}
          />
        </div>
      )}

      {/* ── Current ── */}
      {issue.current_state && (
        <div style={{ marginBottom: '4px' }}>
          <p style={sectionLabelStyle}>— Current</p>
          <BilingualText
            original={issue.current_state}
            translated={translations?.current_state}
            locale={locale}
            mode={mode}
          />
        </div>
      )}

      {/* ── Reference files / cloud link ── */}
      <ReferenceSection
        files={issue.reference_files}
        cloudUrl={issue.reference_url}
      />
    </div>
  );
}
