'use client';

import { ListOrdered } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ROUNDS = [1, 2, 3, 4, 5] as const;

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function FeedbackRoundIndicator({ value, onChange }: Props) {
  const t = useTranslations('feedback.field');

  return (
    <div className="flex items-center justify-between px-[14px] py-[10px] bg-[var(--color-bg-surface)] border border-[var(--color-border-light)]">
      <div className="flex items-center gap-[10px]">
        <ListOrdered size={14} color="var(--color-accent-blue)" aria-hidden="true" />
        <span className="text-[12px] text-[var(--color-purple-soft)]">
          {t('feedbackRound')}
        </span>
      </div>
      <div className="flex gap-1">
        {ROUNDS.map((r) => {
          const active = value === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => onChange(r)}
              className={[
                'text-[11px] px-[10px] py-1 border cursor-pointer transition-colors',
                active
                  ? 'bg-[var(--color-black)] text-[var(--color-white)] border-[var(--color-black)] font-medium'
                  : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-mid)] hover:border-[var(--color-black)]',
              ].join(' ')}
            >
              {r === 5 ? '5+' : r}
            </button>
          );
        })}
      </div>
    </div>
  );
}
