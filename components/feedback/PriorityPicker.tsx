'use client';

import { useTranslations } from 'next-intl';

type Priority = 'high' | 'medium' | 'low';

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

interface Props {
  value: string;
  onChange: (v: Priority) => void;
  error?: string;
}

const SELECTED_STYLES: Record<Priority, string> = {
  high: 'bg-[var(--color-high-bg)] text-[var(--color-high-text)] border-[var(--color-high-border)] font-medium',
  medium: 'bg-[var(--color-medium-bg)] text-[var(--color-medium-text)] border-[var(--color-border-mid)] font-medium',
  low: 'bg-[var(--color-low-bg)] text-[var(--color-low-text)] border-[var(--color-low-border)] font-medium',
};

const DOT_STYLES: Record<Priority, string> = {
  high: 'bg-[var(--color-high)]',
  medium: 'bg-[var(--color-medium)]',
  low: 'bg-[var(--color-low)]',
};

export function PriorityPicker({ value, onChange, error }: Props) {
  const t = useTranslations('feedback');

  return (
    <div>
      {/* section label → buttons: --space-group (12px) */}
      <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-ink)] mb-[var(--space-group)]">
        {t('field.priority')}
      </p>
      <div className="grid grid-cols-3 gap-[6px]">
        {PRIORITIES.map((p) => {
          const active = value === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={[
                'flex items-center justify-center gap-2 px-3 py-2 text-[12px] border cursor-pointer transition-colors',
                active
                  ? SELECTED_STYLES[p]
                  : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-mid)] hover:border-[var(--color-black)]',
              ].join(' ')}
            >
              <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${DOT_STYLES[p]}`} />
              {t(`priority.${p}`)}
            </button>
          );
        })}
      </div>
      {/* error sits tight below the buttons: --space-tight (6px) */}
      {error && (
        <p className="text-[11px] italic text-[var(--color-required)] mt-[var(--space-tight)]">{error}</p>
      )}
    </div>
  );
}
