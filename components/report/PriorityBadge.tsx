import { getPriorityStyle, PRIORITY_LABELS } from './utils';

export function PriorityBadge({ priority }: { priority: string }) {
  const s = getPriorityStyle(priority);

  return (
    <span
      style={{
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.18em',
        padding: '4px 8px',
        background: s.bg,
        border: `0.5px solid ${s.border}`,
        color: s.text,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {PRIORITY_LABELS[priority] ?? priority.toUpperCase()}
    </span>
  );
}
